from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.models import Company, Job, CompanyVerificationRequest, User, RecruiterProfile
from app.schemas.schemas import CompanyOut, CompanyCreate, CompanyUpdate, JobOut

router = APIRouter(prefix="/api/companies", tags=["Companies"])

@router.get("", response_model=List[CompanyOut])
def get_companies(
    q: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Company)
    if q:
        query = query.filter(Company.name.ilike(f"%{q}%"))
    if industry and industry.lower() != "all":
        query = query.filter(Company.industry.ilike(industry))

    return query.order_by(Company.is_verified.desc(), Company.name.asc()).all()


@router.get("/{company_id}")
def get_company_details(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    active_jobs = (
        db.query(Job)
        .filter(Job.company_id == company_id, Job.status == "published", Job.is_moderated == False)
        .order_by(Job.created_at.desc())
        .all()
    )

    return {
        "company": CompanyOut.model_validate(company),
        "active_jobs_count": len(active_jobs),
        "jobs": [
            {
                "id": j.id,
                "title": j.title,
                "department": j.department,
                "location": j.location,
                "work_arrangement": j.work_arrangement,
                "employment_type": j.employment_type,
                "experience_level": j.experience_level,
                "min_salary": j.min_salary,
                "max_salary": j.max_salary,
                "currency": j.currency,
                "created_at": j.created_at.isoformat()
            }
            for j in active_jobs
        ]
    }


@router.post("/{company_id}/request-verification")
def request_company_verification(
    company_id: int,
    business_reg_no: str,
    website: Optional[str] = None,
    current_user: User = Depends(require_roles(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Update company verification status to pending
    company.verification_status = "pending"

    req = CompanyVerificationRequest(
        company_id=company.id,
        requester_id=current_user.id,
        business_registration_no=business_reg_no,
        official_website=website or company.website,
        status="pending"
    )
    db.add(req)
    db.commit()

    return {"message": "Verification request submitted. Platform administrators will review your credentials."}
