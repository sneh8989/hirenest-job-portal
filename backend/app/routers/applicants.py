from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.models import (
    User,
    ApplicantProfile,
    Application,
    SavedJob,
    JobAlert,
    Interview,
    Job
)
from app.schemas.schemas import (
    ApplicantProfileOut,
    ApplicantProfileUpdate,
    SavedJobOut,
    JobAlertCreate,
    JobAlertOut,
    ApplicationOut
)
from app.services.storage_service import save_upload_file

router = APIRouter(prefix="/api/applicant", tags=["Applicant Panel"])

def compute_profile_completion(profile: ApplicantProfile) -> int:
    score = 20  # Base registration
    if profile.headline:
        score += 15
    if profile.bio:
        score += 10
    if profile.location:
        score += 10
    if profile.skills and len(profile.skills) > 0:
        score += 20
    if profile.experience and len(profile.experience) > 0:
        score += 10
    if profile.education and len(profile.education) > 0:
        score += 5
    if profile.resume_url:
        score += 10
    return min(100, score)

@router.get("/profile", response_model=ApplicantProfileOut)
def get_applicant_profile(
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(ApplicantProfile)
        .options(joinedload(ApplicantProfile.user))
        .filter(ApplicantProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = ApplicantProfile(user_id=current_user.id, skills=[], profile_completion=30)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=ApplicantProfileOut)
def update_applicant_profile(
    profile_in: ApplicantProfileUpdate,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_user.id).first()
    if not profile:
        profile = ApplicantProfile(user_id=current_user.id)
        db.add(profile)

    for field, val in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)

    profile.profile_completion = compute_profile_completion(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    file_url = await save_upload_file(file, subfolder="resumes")
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_user.id).first()
    if not profile:
        profile = ApplicantProfile(user_id=current_user.id)
        db.add(profile)

    profile.resume_url = file_url
    profile.resume_filename = file.filename
    profile.profile_completion = compute_profile_completion(profile)
    db.commit()

    return {
        "message": "Resume uploaded successfully",
        "resume_url": file_url,
        "filename": file.filename,
        "profile_completion": profile.profile_completion
    }

@router.get("/dashboard-metrics")
def get_applicant_dashboard_metrics(
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_user.id).first()
    total_apps = db.query(Application).filter(Application.applicant_id == current_user.id).count()
    shortlisted_apps = db.query(Application).filter(
        Application.applicant_id == current_user.id,
        Application.status.in_(["shortlisted", "interview_scheduled", "selected"])
    ).count()

    upcoming_interviews = db.query(Interview).filter(
        Interview.applicant_id == current_user.id,
        Interview.status.in_(["scheduled", "accepted"])
    ).count()

    saved_jobs_count = db.query(SavedJob).filter(SavedJob.user_id == current_user.id).count()

    recent_apps = (
        db.query(Application)
        .options(joinedload(Application.job).joinedload(Job.company))
        .filter(Application.applicant_id == current_user.id)
        .order_by(Application.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "welcome_name": current_user.full_name,
        "total_applications": total_apps,
        "shortlisted_applications": shortlisted_apps,
        "upcoming_interviews": upcoming_interviews,
        "saved_jobs_count": saved_jobs_count,
        "profile_completion": profile.profile_completion if profile else 30,
        "recent_applications": [
            {
                "id": a.id,
                "job_title": a.job.title if a.job else "Unknown",
                "company_name": a.job.company.name if (a.job and a.job.company) else "Unknown",
                "status": a.status,
                "ai_match_score": a.ai_match_score,
                "applied_at": a.created_at.isoformat()
            }
            for a in recent_apps
        ]
    }

@router.get("/saved-jobs", response_model=List[SavedJobOut])
def get_saved_jobs(
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    saved = (
        db.query(SavedJob)
        .options(joinedload(SavedJob.job).joinedload(Job.company))
        .filter(SavedJob.user_id == current_user.id)
        .order_by(SavedJob.created_at.desc())
        .all()
    )
    return saved

@router.post("/saved-jobs/{job_id}")
def toggle_save_job(
    job_id: int,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    existing = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Job removed from saved list."}
    else:
        new_save = SavedJob(user_id=current_user.id, job_id=job_id)
        db.add(new_save)
        db.commit()
        return {"saved": True, "message": "Job saved successfully."}

@router.delete("/saved-jobs/{job_id}")
def remove_saved_job(
    job_id: int,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    saved = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()
    if saved:
        db.delete(saved)
        db.commit()
    return {"message": "Job removed from saved vacancies."}

@router.get("/alerts", response_model=List[JobAlertOut])
def get_job_alerts(
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    return db.query(JobAlert).filter(JobAlert.user_id == current_user.id).all()

@router.post("/alerts", response_model=JobAlertOut, status_code=status.HTTP_201_CREATED)
def create_job_alert(
    alert_in: JobAlertCreate,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    alert = JobAlert(
        user_id=current_user.id,
        title=alert_in.title,
        keywords=alert_in.keywords,
        location=alert_in.location,
        category=alert_in.category,
        job_type=alert_in.job_type,
        frequency=alert_in.frequency,
        is_active=True
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.delete("/alerts/{alert_id}")
def delete_job_alert(
    alert_id: int,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    alert = db.query(JobAlert).filter(
        JobAlert.id == alert_id,
        JobAlert.user_id == current_user.id
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"message": "Job alert removed."}
