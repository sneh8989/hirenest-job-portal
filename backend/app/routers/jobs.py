from typing import Optional, List
import math
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, asc, func
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_current_user, require_roles
from app.models.models import Job, Company, User, RecruiterProfile, UserReport
from app.schemas.schemas import JobCreate, JobUpdate, JobOut, JobListResponse, UserReportCreate
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.get("", response_model=JobListResponse)
def list_jobs(
    q: Optional[str] = Query(None, description="Search term for title, description, skills"),
    location: Optional[str] = Query(None, description="Location search"),
    work_arrangement: Optional[str] = Query(None, description="Remote, Hybrid, On-site"),
    employment_type: Optional[str] = Query(None, description="Full-time, Part-time, Contract, Internship"),
    experience_level: Optional[str] = Query(None, description="Entry-level, Mid-level, Senior, Lead, Executive"),
    category: Optional[str] = Query(None, description="Job category"),
    min_salary: Optional[int] = Query(None, description="Minimum salary filter"),
    company_id: Optional[int] = Query(None, description="Filter by company"),
    sort_by: str = Query("latest", description="latest, salary_desc, views"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    query = db.query(Job).options(joinedload(Job.company)).filter(
        Job.status == "published",
        Job.is_moderated == False
    )

    if q:
        search_filter = or_(
            Job.title.ilike(f"%{q}%"),
            Job.description.ilike(f"%{q}%"),
            Job.department.ilike(f"%{q}%"),
            Job.category.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))

    if work_arrangement and work_arrangement.lower() != "all":
        query = query.filter(Job.work_arrangement.ilike(work_arrangement))

    if employment_type and employment_type.lower() != "all":
        query = query.filter(Job.employment_type.ilike(employment_type))

    if experience_level and experience_level.lower() != "all":
        query = query.filter(Job.experience_level.ilike(experience_level))

    if category and category.lower() != "all":
        query = query.filter(Job.category.ilike(category))

    if min_salary:
        query = query.filter(or_(Job.min_salary >= min_salary, Job.max_salary >= min_salary))

    if company_id:
        query = query.filter(Job.company_id == company_id)

    # Sorting
    if sort_by == "salary_desc":
        query = query.order_by(desc(Job.max_salary))
    elif sort_by == "views":
        query = query.order_by(desc(Job.views_count))
    else:
        query = query.order_by(desc(Job.created_at))

    total = query.count()
    total_pages = math.ceil(total / size) if total > 0 else 1
    items = query.offset((page - 1) * size).limit(size).all()

    return JobListResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=total_pages
    )


@router.get("/categories")
def get_job_categories(db: Session = Depends(get_db)):
    """Returns categories with count of published vacancies."""
    categories_count = (
        db.query(Job.category, func.count(Job.id))
        .filter(Job.status == "published", Job.is_moderated == False)
        .group_by(Job.category)
        .all()
    )
    return [{"category": c[0], "count": c[1]} for c in categories_count]


@router.get("/{job_id}", response_model=JobOut)
def get_job_details(job_id: int, db: Session = Depends(get_db)):
    job = (
        db.query(Job)
        .options(joinedload(Job.company))
        .filter(Job.id == job_id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    # Increment view count
    job.views_count += 1
    db.commit()
    db.refresh(job)
    return job


@router.post("", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    # Retrieve recruiter company
    recruiter_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_profile or not recruiter_profile.company_id:
        # Fallback to first company or create one if none linked
        first_comp = db.query(Company).first()
        company_id = first_comp.id if first_comp else 1
    else:
        company_id = recruiter_profile.company_id

    job = Job(
        recruiter_id=current_user.id,
        company_id=company_id,
        title=job_in.title,
        department=job_in.department,
        category=job_in.category,
        location=job_in.location,
        work_arrangement=job_in.work_arrangement,
        employment_type=job_in.employment_type,
        experience_level=job_in.experience_level,
        min_salary=job_in.min_salary,
        max_salary=job_in.max_salary,
        currency=job_in.currency,
        description=job_in.description,
        responsibilities=job_in.responsibilities,
        requirements=job_in.requirements,
        skills_required=job_in.skills_required,
        skills_preferred=job_in.skills_preferred,
        status=job_in.status,
        deadline=job_in.deadline
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    log_audit_event(
        db,
        action="JOB_CREATED",
        resource_type="Job",
        resource_id=str(job.id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Job '{job.title}' posted by {current_user.email}"
    )

    return job


@router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    job_in: JobUpdate,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Only recruiter who created it or admin can update
    if current_user.role != "admin" and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this job")

    for field, val in job_in.model_dump(exclude_unset=True).items():
        setattr(job, field, val)

    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}")
def delete_or_close_job(
    job_id: int,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role != "admin" and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")

    job.status = "closed"
    db.commit()
    return {"message": "Job marked as closed."}


@router.post("/{job_id}/report", status_code=status.HTTP_201_CREATED)
def report_job(
    job_id: int,
    report_in: UserReportCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    report = UserReport(
        reporter_id=current_user.id if current_user else None,
        reported_job_id=job_id,
        reason=report_in.reason,
        details=report_in.details,
        status="pending"
    )
    db.add(report)
    db.commit()
    return {"message": "Thank you. This listing has been reported and sent to platform administrators for review."}
