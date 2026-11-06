from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.models import Interview, Application, ApplicationTimeline, Job, User
from app.schemas.schemas import InterviewCreate, InterviewStatusUpdate, InterviewOut
from app.services.notification_service import create_notification
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])

@router.post("", response_model=InterviewOut, status_code=status.HTTP_201_CREATED)
def schedule_interview(
    inter_in: InterviewCreate,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .options(joinedload(Application.job))
        .filter(Application.id == inter_in.application_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    interview = Interview(
        application_id=application.id,
        job_id=application.job_id,
        applicant_id=application.applicant_id,
        recruiter_id=current_user.id,
        title=inter_in.title,
        interview_date=inter_in.interview_date,
        start_time=inter_in.start_time,
        duration_minutes=inter_in.duration_minutes,
        timezone=inter_in.timezone,
        mode=inter_in.mode,
        meeting_link=inter_in.meeting_link,
        location=inter_in.location,
        instructions=inter_in.instructions,
        status="scheduled"
    )
    db.add(interview)

    # Transition application status to interview_scheduled
    application.status = "interview_scheduled"
    timeline = ApplicationTimeline(
        application_id=application.id,
        status="interview_scheduled",
        notes=f"Interview scheduled for {inter_in.interview_date} at {inter_in.start_time} ({inter_in.mode})",
        changed_by_user_id=current_user.id
    )
    db.add(timeline)
    db.commit()
    db.refresh(interview)

    # Notify applicant
    create_notification(
        db,
        user_id=application.applicant_id,
        title="Interview Invitation Received",
        message=f"You have been invited to an interview for '{application.job.title}' on {inter_in.interview_date} at {inter_in.start_time}.",
        type="interview",
        link="/applicant/interviews"
    )

    log_audit_event(
        db,
        action="INTERVIEW_SCHEDULED",
        resource_type="Interview",
        resource_id=str(interview.id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Interview scheduled with candidate {application.applicant_id} for job {application.job.title}"
    )

    return interview


@router.get("/my", response_model=List[InterviewOut])
def get_my_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Interview).options(
        joinedload(Interview.job).joinedload(Job.company),
        joinedload(Interview.applicant),
        joinedload(Interview.recruiter)
    )

    if current_user.role == "applicant":
        query = query.filter(Interview.applicant_id == current_user.id)
    elif current_user.role == "recruiter":
        query = query.filter(Interview.recruiter_id == current_user.id)
    # Admin sees all interviews

    return query.order_by(Interview.interview_date.desc(), Interview.start_time.desc()).all()


@router.patch("/{interview_id}/respond", response_model=InterviewOut)
def respond_to_interview(
    interview_id: int,
    action: str,  # "accept" or "decline"
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .options(joinedload(Interview.job))
        .filter(Interview.id == interview_id)
        .first()
    )
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if action.lower() == "accept":
        interview.status = "accepted"
        msg = f"{current_user.full_name} accepted the interview invitation for '{interview.job.title}'."
    elif action.lower() == "decline":
        interview.status = "declined"
        msg = f"{current_user.full_name} declined the interview invitation for '{interview.job.title}'."
    else:
        raise HTTPException(status_code=400, detail="Action must be 'accept' or 'decline'")

    db.commit()
    db.refresh(interview)

    # Notify recruiter
    create_notification(
        db,
        user_id=interview.recruiter_id,
        title=f"Interview {interview.status.title()}",
        message=msg,
        type="interview",
        link="/recruiter/interviews"
    )

    return interview


@router.patch("/{interview_id}/status", response_model=InterviewOut)
def update_interview_status(
    interview_id: int,
    update_in: InterviewStatusUpdate,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if current_user.role != "admin" and interview.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if update_in.status:
        interview.status = update_in.status
    if update_in.feedback:
        interview.recruiter_feedback = update_in.feedback
    if update_in.rating:
        interview.rating = update_in.rating

    db.commit()
    db.refresh(interview)
    return interview
