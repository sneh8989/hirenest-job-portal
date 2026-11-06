from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.models import (
    User,
    Company,
    Job,
    Application,
    UserReport,
    CompanyVerificationRequest,
    AuditLog,
    PlatformFeedback
)
from app.schemas.schemas import (
    AdminDashboardMetrics,
    UserOut,
    UserReportOut,
    ReportResolutionRequest,
    CompanyVerificationAction,
    AuditLogOut,
    JobOut
)
from app.services.audit_service import log_audit_event
from app.services.notification_service import create_notification

router = APIRouter(prefix="/api/admin", tags=["Administration"])

@router.get("/metrics", response_model=AdminDashboardMetrics)
def get_admin_dashboard_metrics(
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_applicants = db.query(User).filter(User.role == "applicant").count()
    total_recruiters = db.query(User).filter(User.role == "recruiter").count()
    total_companies = db.query(Company).count()
    verified_companies = db.query(Company).filter(Company.is_verified == True).count()
    active_jobs = db.query(Job).filter(Job.status == "published", Job.is_moderated == False).count()
    total_applications = db.query(Application).count()
    pending_reports = db.query(UserReport).filter(UserReport.status == "pending").count()
    pending_verifications = db.query(CompanyVerificationRequest).filter(CompanyVerificationRequest.status == "pending").count()

    recent_users = db.query(User).order_by(User.created_at.desc()).limit(8).all()

    return AdminDashboardMetrics(
        total_users=total_users,
        total_applicants=total_applicants,
        total_recruiters=total_recruiters,
        total_companies=total_companies,
        verified_companies=verified_companies,
        active_jobs=active_jobs,
        total_applications=total_applications,
        pending_reports=pending_reports,
        pending_verifications=pending_verifications,
        recent_users=recent_users
    )


@router.get("/users")
def get_all_users(
    q: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(15, ge=1, le=50),
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if q:
        query = query.filter(
            (User.email.ilike(f"%{q}%")) | (User.full_name.ilike(f"%{q}%"))
        )
    if role and role.lower() != "all":
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    total = query.count()
    items = query.order_by(User.created_at.desc()).offset((page - 1) * size).limit(size).all()

    return {
        "items": [UserOut.model_validate(u) for u in items],
        "total": total,
        "page": page,
        "size": size
    }


@router.patch("/users/{user_id}/status")
def toggle_user_active_status(
    user_id: int,
    is_active: bool,
    reason: Optional[str] = None,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot alter own administrative status")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = is_active
    db.commit()

    action_text = "USER_REACTIVATED" if is_active else "USER_SUSPENDED"
    log_audit_event(
        db,
        action=action_text,
        resource_type="User",
        resource_id=str(user.id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Admin {current_user.email} changed user {user.email} status to active={is_active}. Reason: {reason or 'Administrative action'}"
    )

    return {"message": f"User account has been {'reactivated' if is_active else 'suspended'}."}


@router.get("/verifications")
def get_verification_requests(
    status: Optional[str] = Query("pending"),
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(CompanyVerificationRequest).options(
        joinedload(CompanyVerificationRequest.company),
        joinedload(CompanyVerificationRequest.requester)
    )
    if status and status.lower() != "all":
        query = query.filter(CompanyVerificationRequest.status == status)

    requests = query.order_by(CompanyVerificationRequest.created_at.desc()).all()

    return [
        {
            "id": r.id,
            "company_id": r.company_id,
            "company_name": r.company.name if r.company else "Unknown",
            "industry": r.company.industry if r.company else None,
            "website": r.official_website or (r.company.website if r.company else None),
            "business_reg_no": r.business_registration_no,
            "requester_name": r.requester.full_name if r.requester else "Unknown",
            "requester_email": r.requester.email if r.requester else "Unknown",
            "status": r.status,
            "admin_notes": r.admin_notes,
            "submitted_at": r.created_at.isoformat()
        }
        for r in requests
    ]


@router.patch("/verifications/{request_id}")
def process_verification_request(
    request_id: int,
    action: CompanyVerificationAction,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    v_req = db.query(CompanyVerificationRequest).options(
        joinedload(CompanyVerificationRequest.company)
    ).filter(CompanyVerificationRequest.id == request_id).first()
    if not v_req:
        raise HTTPException(status_code=404, detail="Verification request not found")

    v_req.status = action.status
    v_req.admin_notes = action.verification_notes

    company = v_req.company
    if company:
        if action.status == "verified":
            company.is_verified = True
            company.verification_status = "verified"
            company.verification_notes = action.verification_notes
        else:
            company.is_verified = False
            company.verification_status = "rejected"
            company.verification_notes = action.verification_notes

    db.commit()

    if v_req.requester_id:
        create_notification(
            db,
            user_id=v_req.requester_id,
            title=f"Company Verification {action.status.title()}",
            message=f"Verification request for '{company.name if company else 'Company'}' was marked as {action.status}.",
            type="moderation",
            link="/recruiter/company"
        )

    log_audit_event(
        db,
        action=f"COMPANY_VERIFICATION_{action.status.upper()}",
        resource_type="Company",
        resource_id=str(company.id if company else request_id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Company '{company.name if company else ''}' verification set to {action.status}"
    )

    return {"message": f"Verification status updated to {action.status}."}


@router.get("/reports", response_model=List[UserReportOut])
def get_moderation_reports(
    status: Optional[str] = Query("pending"),
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(UserReport).options(
        joinedload(UserReport.reported_job).joinedload(Job.company),
        joinedload(UserReport.reporter)
    )
    if status and status.lower() != "all":
        query = query.filter(UserReport.status == status)

    return query.order_by(UserReport.created_at.desc()).all()


@router.patch("/reports/{report_id}/resolve")
def resolve_moderation_report(
    report_id: int,
    resolution: ReportResolutionRequest,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    report = db.query(UserReport).filter(UserReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = resolution.status
    report.moderation_notes = resolution.moderation_notes

    if resolution.take_down_job and report.reported_job_id:
        job = db.query(Job).filter(Job.id == report.reported_job_id).first()
        if job:
            job.is_moderated = True
            job.status = "closed"
            job.moderation_reason = resolution.moderation_notes
            if job.recruiter_id:
                create_notification(
                    db,
                    user_id=job.recruiter_id,
                    title="Job Vacancy Removed by Moderation",
                    message=f"Your vacancy '{job.title}' was moderated. Reason: {resolution.moderation_notes}",
                    type="moderation"
                )

    db.commit()

    log_audit_event(
        db,
        action="REPORT_RESOLVED",
        resource_type="UserReport",
        resource_id=str(report.id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Report {report.id} resolved as {resolution.status}. Takedown={resolution.take_down_job}"
    )

    return {"message": "Report status updated."}


@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    action: Optional[str] = None,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    return query.order_by(AuditLog.created_at.desc()).limit(limit).all()


@router.get("/jobs", response_model=List[JobOut])
def get_all_jobs_admin(
    status: Optional[str] = None,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(Job).options(joinedload(Job.company))
    if status and status.lower() != "all":
        query = query.filter(Job.status == status)
    return query.order_by(Job.created_at.desc()).limit(100).all()


@router.patch("/jobs/{job_id}/moderate")
def moderate_job(
    job_id: int,
    action: str,  # "hide" or "restore"
    reason: Optional[str] = None,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if action == "hide":
        job.is_moderated = True
        job.status = "closed"
        job.moderation_reason = reason or "Flagged by platform moderation"
    else:
        job.is_moderated = False
        job.status = "published"
        job.moderation_reason = None

    db.commit()

    log_audit_event(
        db,
        action="JOB_MODERATED",
        resource_type="Job",
        resource_id=str(job.id),
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Admin {current_user.email} set job {job.id} moderation to {action}"
    )

    return {"message": f"Job {action}d successfully."}
