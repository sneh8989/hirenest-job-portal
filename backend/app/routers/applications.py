from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.models import Application, ApplicationTimeline, Job, User, ApplicantProfile, RecruiterProfile
from app.schemas.schemas import (
    ApplicationCreate,
    ApplicationStatusUpdate,
    ApplicationOut,
    ApplicationTimelineOut
)
from app.services.ai_service import AIService
from app.services.notification_service import create_notification
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    app_in: ApplicationCreate,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).options(joinedload(Job.company)).filter(Job.id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job vacancy not found")
    
    if job.status != "published":
        raise HTTPException(status_code=400, detail="This job is no longer accepting applications")

    # Prevent duplicate applications
    existing = db.query(Application).filter(
        Application.job_id == job.id,
        Application.applicant_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already submitted an application for this vacancy."
        )

    # Fetch applicant profile to compute match score
    applicant_profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_user.id).first()
    user_skills = applicant_profile.skills if applicant_profile else []
    resume_to_use = app_in.resume_url or (applicant_profile.resume_url if applicant_profile else None)

    # AI Match score calculation
    match_result = AIService.calculate_match_score(
        applicant_skills=user_skills,
        required_skills=job.skills_required or [],
        preferred_skills=job.skills_preferred or []
    )

    new_application = Application(
        job_id=job.id,
        applicant_id=current_user.id,
        status="applied",
        resume_url=resume_to_use,
        cover_letter=app_in.cover_letter,
        applicant_notes=app_in.applicant_notes,
        ai_match_score=match_result["match_score"],
        ai_match_details=match_result
    )
    db.add(new_application)
    db.flush()

    # Timeline entry
    timeline_entry = ApplicationTimeline(
        application_id=new_application.id,
        status="applied",
        notes="Application submitted by applicant.",
        changed_by_user_id=current_user.id
    )
    db.add(timeline_entry)
    db.commit()
    db.refresh(new_application)

    # Notify recruiter if assigned
    if job.recruiter_id:
        create_notification(
            db,
            user_id=job.recruiter_id,
            title="New Application Received",
            message=f"{current_user.full_name} applied for '{job.title}'",
            type="application",
            link=f"/recruiter/applicants"
        )

    # Notify applicant
    create_notification(
        db,
        user_id=current_user.id,
        title="Application Submitted",
        message=f"Your application for '{job.title}' at {job.company.name if job.company else 'HireNest'} was received.",
        type="application",
        link=f"/applicant/applications"
    )

    log_audit_event(
        db,
        action="APPLICATION_SUBMITTED",
        resource_type="Application",
        resource_id=str(new_application.id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Applied to job {job.title} (ID: {job.id})"
    )

    return new_application


@router.get("/my", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    apps = (
        db.query(Application)
        .options(
            joinedload(Application.job).joinedload(Job.company),
            joinedload(Application.timeline)
        )
        .filter(Application.applicant_id == current_user.id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return apps


@router.get("/job/{job_id}", response_model=List[ApplicationOut])
def get_applicants_for_job(
    job_id: int,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role != "admin" and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to view applicants for this job")

    apps = (
        db.query(Application)
        .options(
            joinedload(Application.applicant),
            joinedload(Application.timeline),
            joinedload(Application.job)
        )
        .filter(Application.job_id == job_id)
        .order_by(Application.ai_match_score.desc().nullslast(), Application.created_at.desc())
        .all()
    )
    return apps


@router.get("/{app_id}", response_model=ApplicationOut)
def get_application_details(
    app_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .options(
            joinedload(Application.job).joinedload(Job.company),
            joinedload(Application.applicant),
            joinedload(Application.timeline)
        )
        .filter(Application.id == app_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Authorization check
    is_owner = application.applicant_id == current_user.id
    is_job_recruiter = application.job.recruiter_id == current_user.id if application.job else False
    is_admin = current_user.role == "admin"

    if not (is_owner or is_job_recruiter or is_admin):
        raise HTTPException(status_code=403, detail="Unauthorized to view this application")

    return application


@router.patch("/{app_id}/status", response_model=ApplicationOut)
def update_application_status(
    app_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .options(joinedload(Application.job))
        .filter(Application.id == app_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role != "admin" and application.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to modify this application")

    valid_statuses = [
        "applied",
        "under_review",
        "shortlisted",
        "interview_scheduled",
        "selected",
        "rejected",
        "withdrawn"
    ]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    old_status = application.status
    application.status = status_update.status
    if status_update.notes:
        application.recruiter_notes = status_update.notes

    # Add timeline log
    timeline = ApplicationTimeline(
        application_id=application.id,
        status=status_update.status,
        notes=status_update.notes or f"Status changed from {old_status} to {status_update.status}",
        changed_by_user_id=current_user.id
    )
    db.add(timeline)
    db.commit()
    db.refresh(application)

    # Notify applicant about status transition
    friendly_status = status_update.status.replace("_", " ").title()
    create_notification(
        db,
        user_id=application.applicant_id,
        title=f"Application Update: {friendly_status}",
        message=f"Your application status for '{application.job.title}' was updated to '{friendly_status}'.",
        type="application",
        link=f"/applicant/applications"
    )

    log_audit_event(
        db,
        action="APPLICATION_STATUS_UPDATED",
        resource_type="Application",
        resource_id=str(application.id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Updated status of app {application.id} to {status_update.status}"
    )

    return application


@router.post("/{app_id}/withdraw")
def withdraw_application(
    app_id: int,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if application.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    application.status = "withdrawn"
    timeline = ApplicationTimeline(
        application_id=application.id,
        status="withdrawn",
        notes="Candidate withdrew application.",
        changed_by_user_id=current_user.id
    )
    db.add(timeline)
    db.commit()
    return {"message": "Application has been withdrawn."}
