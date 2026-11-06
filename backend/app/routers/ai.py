from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.models import Job, User, ApplicantProfile
from app.schemas.schemas import (
    AIMatchRequest,
    AIMatchResponse,
    SkillGapRequest,
    SkillGapResponse,
    JobOut
)
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

@router.post("/match-score", response_model=AIMatchResponse)
def compute_match_score(
    req: AIMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).options(joinedload(Job.company)).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    target_user_id = req.applicant_id if (req.applicant_id and current_user.role in ["recruiter", "admin"]) else current_user.id
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == target_user_id).first()

    applicant_skills = profile.skills if profile and profile.skills else []
    required_skills = job.skills_required or []
    preferred_skills = job.skills_preferred or []

    res = AIService.calculate_match_score(applicant_skills, required_skills, preferred_skills)

    return AIMatchResponse(
        job_id=job.id,
        match_score=res["match_score"],
        rating_category=res["rating_category"],
        matching_skills=res["matching_skills"],
        missing_required_skills=res["missing_required_skills"],
        missing_preferred_skills=res["missing_preferred_skills"],
        experience_fit=f"Profile aligned with {job.experience_level} tier",
        explanation=res["explanation"],
        suggested_next_steps=res["suggested_next_steps"],
        is_ai_generated=True,
        provider=res["provider"]
    )


@router.post("/skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap(
    req: SkillGapRequest,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    job = db.query(Job).options(joinedload(Job.company)).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_user.id).first()
    if not profile:
        profile = ApplicantProfile(user_id=current_user.id, skills=[])

    analysis = AIService.generate_skill_gap_analysis(job, profile)
    return SkillGapResponse(**analysis)


@router.get("/recommendations")
def get_job_recommendations(
    limit: int = 6,
    current_user: User = Depends(require_roles(["applicant"])),
    db: Session = Depends(get_db)
):
    profile = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_user.id).first()
    all_published_jobs = (
        db.query(Job)
        .options(joinedload(Job.company))
        .filter(Job.status == "published", Job.is_moderated == False)
        .all()
    )

    recommended = AIService.recommend_jobs(profile, all_published_jobs, limit=limit)

    return [
        {
            "job": {
                "id": r["job"].id,
                "title": r["job"].title,
                "department": r["job"].department,
                "category": r["job"].category,
                "location": r["job"].location,
                "work_arrangement": r["job"].work_arrangement,
                "employment_type": r["job"].employment_type,
                "experience_level": r["job"].experience_level,
                "min_salary": r["job"].min_salary,
                "max_salary": r["job"].max_salary,
                "currency": r["job"].currency,
                "skills_required": r["job"].skills_required,
                "skills_preferred": r["job"].skills_preferred,
                "company": {
                    "id": r["job"].company.id if r["job"].company else None,
                    "name": r["job"].company.name if r["job"].company else "",
                    "logo_url": r["job"].company.logo_url if r["job"].company else None,
                    "is_verified": r["job"].company.is_verified if r["job"].company else False
                }
            },
            "match_score": r["score"],
            "recommendation_reason": r["reason"]
        }
        for r in recommended
    ]
