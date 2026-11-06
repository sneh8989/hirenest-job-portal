from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_current_user, require_roles
from app.models.models import PlatformFeedback, User
from app.schemas.schemas import PlatformFeedbackCreate, PlatformFeedbackOut

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

@router.post("", response_model=PlatformFeedbackOut, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    fb_in: PlatformFeedbackCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    entry = PlatformFeedback(
        user_id=current_user.id if current_user else None,
        user_name=current_user.full_name if current_user else "Anonymous User",
        category=fb_in.category,
        message=fb_in.message,
        rating=fb_in.rating
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("", response_model=List[PlatformFeedbackOut])
def get_all_feedback(
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    return db.query(PlatformFeedback).order_by(PlatformFeedback.created_at.desc()).limit(100).all()
