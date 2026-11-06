from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.models import (
    User,
    RecruiterProfile,
    Company,
    Job,
    Application,
    Interview,
    ApplicantProfile
)
from app.schemas.schemas import (
    CompanyOut,
    CompanyUpdate,
    JobOut,
    ApplicationOut
)

router = APIRouter(prefix="/api/recruiter", tags=["Recruiter Panel"])

@router.get("/dashboard-metrics")
def get_recruiter_dashboard_metrics(
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    # Get all jobs posted by this recruiter (or all jobs if admin)
    jobs_query = db.query(Job)
    if current_user.role != "admin":
        jobs_query = jobs_query.filter(Job.recruiter_id == current_user.id)
    
    recruiter_jobs = jobs_query.all()
    job_ids = [j.id for j in recruiter_jobs]

    active_jobs_count = len([j for j in recruiter_jobs if j.status == "published"])

    if not job_ids:
        return {
            "active_jobs": 0,
            "total_applicants": 0,
            "shortlisted": 0,
            "interviews_scheduled": 0,
            "stage_distribution": {
                "applied": 0,
                "under_review": 0,
                "shortlisted": 0,
                "interview_scheduled": 0,
                "selected": 0,
                "rejected": 0
            },
            "applicants_by_job": [],
            "recent_applications": []
        }

    total_applicants = db.query(Application).filter(Application.job_id.in_(job_ids)).count()
    shortlisted_count = db.query(Application).filter(
        Application.job_id.in_(job_ids),
        Application.status == "shortlisted"
    ).count()

    interviews_scheduled_count = db.query(Interview).filter(
        Interview.job_id.in_(job_ids),
        Interview.status.in_(["scheduled", "accepted"])
    ).count()

    # Stage distribution
    stages = ["applied", "under_review", "shortlisted", "interview_scheduled", "selected", "rejected"]
    stage_counts = {}
    for st in stages:
        stage_counts[st] = db.query(Application).filter(
            Application.job_id.in_(job_ids),
            Application.status == st
        ).count()

    # Applicants by job
    applicants_by_job = []
    for j in recruiter_jobs[:6]:
        cnt = db.query(Application).filter(Application.job_id == j.id).count()
        applicants_by_job.append({
            "job_id": j.id,
            "job_title": j.title,
            "applicant_count": cnt
        })

    # Recent applications
    recent = (
        db.query(Application)
        .options(
            joinedload(Application.applicant),
            joinedload(Application.job)
        )
        .filter(Application.job_id.in_(job_ids))
        .order_by(Application.created_at.desc())
        .limit(6)
        .all()
    )

    return {
        "active_jobs": active_jobs_count,
        "total_applicants": total_applicants,
        "shortlisted": shortlisted_count,
        "interviews_scheduled": interviews_scheduled_count,
        "stage_distribution": stage_counts,
        "applicants_by_job": applicants_by_job,
        "recent_applications": [
            {
                "id": a.id,
                "candidate_name": a.applicant.full_name if a.applicant else "Candidate",
                "candidate_email": a.applicant.email if a.applicant else "",
                "job_title": a.job.title if a.job else "Job",
                "ai_match_score": a.ai_match_score,
                "status": a.status,
                "applied_at": a.created_at.isoformat()
            }
            for a in recent
        ]
    }


@router.get("/jobs")
def get_recruiter_jobs(
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(Job).options(joinedload(Job.company))
    if current_user.role != "admin":
        query = query.filter(Job.recruiter_id == current_user.id)
    
    jobs = query.order_by(Job.created_at.desc()).all()
    
    result = []
    for j in jobs:
        cnt = db.query(Application).filter(Application.job_id == j.id).count()
        result.append({
            "id": j.id,
            "title": j.title,
            "department": j.department,
            "category": j.category,
            "location": j.location,
            "work_arrangement": j.work_arrangement,
            "employment_type": j.employment_type,
            "experience_level": j.experience_level,
            "min_salary": j.min_salary,
            "max_salary": j.max_salary,
            "status": j.status,
            "views_count": j.views_count,
            "applicant_count": cnt,
            "created_at": j.created_at.isoformat(),
            "deadline": j.deadline.isoformat() if j.deadline else None,
            "company": {
                "id": j.company.id if j.company else None,
                "name": j.company.name if j.company else "",
                "logo_url": j.company.logo_url if j.company else None,
                "is_verified": j.company.is_verified if j.company else False
            }
        })
    return result


@router.get("/company", response_model=CompanyOut)
def get_recruiter_company(
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not profile or not profile.company_id:
        company = db.query(Company).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company profile not found")
        return company
    
    company = db.query(Company).filter(Company.id == profile.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.put("/company", response_model=CompanyOut)
def update_recruiter_company(
    company_in: CompanyUpdate,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not profile or not profile.company_id:
        raise HTTPException(status_code=404, detail="No company associated with this recruiter")
    
    company = db.query(Company).filter(Company.id == profile.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    for field, val in company_in.model_dump(exclude_unset=True).items():
        setattr(company, field, val)

    db.commit()
    db.refresh(company)
    return company


@router.get("/pipeline/{job_id}")
def get_job_pipeline(
    job_id: int,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    """Returns candidate cards categorized by stage for the interactive Kanban pipeline."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role != "admin" and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    applications = (
        db.query(Application)
        .options(
            joinedload(Application.applicant).joinedload(User.applicant_profile)
        )
        .filter(Application.job_id == job_id)
        .order_by(Application.created_at.desc())
        .all()
    )

    stages = ["applied", "under_review", "shortlisted", "interview_scheduled", "selected", "rejected"]
    board = {st: [] for st in stages}

    for app in applications:
        applicant = app.applicant
        prof = applicant.applicant_profile if applicant else None
        st = app.status if app.status in board else "applied"
        board[st].append({
            "id": app.id,
            "applicant_id": app.applicant_id,
            "candidate_name": applicant.full_name if applicant else "Candidate",
            "candidate_email": applicant.email if applicant else "",
            "headline": prof.headline if prof else None,
            "skills": prof.skills if prof else [],
            "ai_match_score": app.ai_match_score,
            "resume_url": app.resume_url,
            "applied_at": app.created_at.isoformat(),
            "notes": app.recruiter_notes
        })

    return {
        "job_id": job.id,
        "job_title": job.title,
        "board": board
    }
