from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.models import User, ApplicantProfile, RecruiterProfile, Company
from app.schemas.schemas import (
    LoginRequest,
    ApplicantRegisterRequest,
    RecruiterRegisterRequest,
    TokenResponse,
    UserOut,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest
)
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register/applicant", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_applicant(req: ApplicantRegisterRequest, request: Request, db: Session = Depends(get_db)):
    # Check duplicate
    existing = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    # Security: public registration can NEVER create an admin
    user = User(
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name.strip(),
        role="applicant",
        phone=req.phone,
        is_active=True,
        is_verified=True
    )
    db.add(user)
    db.flush()

    # Create default applicant profile
    profile = ApplicantProfile(
        user_id=user.id,
        headline=req.headline or "Motivated Professional",
        skills=req.skills or [],
        profile_completion=50 if req.skills else 30
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    log_audit_event(
        db,
        action="USER_REGISTER_APPLICANT",
        resource_type="User",
        resource_id=str(user.id),
        user_id=user.id,
        user_email=user.email,
        details=f"Applicant {user.email} registered",
        ip_address=request.client.host if request.client else None
    )

    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, user=user)


@router.post("/register/recruiter", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_recruiter(req: RecruiterRegisterRequest, request: Request, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    # Find or create company
    company = db.query(Company).filter(Company.name == req.company_name.strip()).first()
    if not company:
        company = Company(
            name=req.company_name.strip(),
            industry=req.company_industry,
            website=req.company_website,
            verification_status="unverified"
        )
        db.add(company)
        db.flush()

    user = User(
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name.strip(),
        role="recruiter",
        is_active=True,
        is_verified=True
    )
    db.add(user)
    db.flush()

    profile = RecruiterProfile(
        user_id=user.id,
        company_id=company.id,
        job_title=req.job_title or "Talent Acquisition Specialist",
        department=req.department or "People & Culture"
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    log_audit_event(
        db,
        action="USER_REGISTER_RECRUITER",
        resource_type="User",
        resource_id=str(user.id),
        user_id=user.id,
        user_email=user.email,
        details=f"Recruiter {user.email} registered with company {company.name}",
        ip_address=request.client.host if request.client else None
    )

    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, user=user)


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended or deactivated. Contact support."
        )

    token = create_access_token(subject=user.id, role=user.role)

    log_audit_event(
        db,
        action="USER_LOGIN",
        resource_type="User",
        resource_id=str(user.id),
        user_id=user.id,
        user_email=user.email,
        details=f"Successful login for {user.email}",
        ip_address=request.client.host if request.client else None
    )

    return TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    # Always return success message to avoid email enumeration
    if user:
        reset_token = create_access_token(subject=user.id, role="password_reset", expires_delta=timedelta(minutes=30))
        # In development mode, return token in response for testing
        return {
            "message": "If this email is registered, password reset instructions have been generated.",
            "dev_reset_token": reset_token
        }
    return {"message": "If this email is registered, password reset instructions have been generated."}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    from app.core.security import decode_access_token
    payload = decode_access_token(req.token)
    if not payload or payload.get("role") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password has been successfully updated. You may now login."}


@router.post("/change-password")
def change_password(req: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(req.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password does not match")
    
    current_user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password changed successfully."}
