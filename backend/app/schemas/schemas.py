from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# ----------------- AUTH & USER SCHEMAS -----------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ApplicantRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None
    headline: Optional[str] = None
    skills: Optional[List[str]] = []

class RecruiterRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    company_name: str = Field(..., min_length=2)
    job_title: Optional[str] = None
    department: Optional[str] = None
    company_industry: Optional[str] = None
    company_website: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ----------------- COMPANY SCHEMAS -----------------

class CompanyBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    size: Optional[str] = None
    headquarters: Optional[str] = None
    contact_email: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    size: Optional[str] = None
    headquarters: Optional[str] = None
    contact_email: Optional[str] = None

class CompanyOut(CompanyBase):
    id: int
    is_verified: bool
    verification_status: str
    verification_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ----------------- APPLICANT PROFILE SCHEMAS -----------------

class ApplicantProfileUpdate(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    preferred_employment_type: Optional[str] = None
    preferred_location: Optional[str] = None
    expected_salary: Optional[str] = None
    skills: Optional[List[str]] = None
    education: Optional[List[Dict[str, Any]]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[Dict[str, Any]]] = None

class ApplicantProfileOut(BaseModel):
    id: int
    user_id: int
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    preferred_employment_type: Optional[str] = None
    preferred_location: Optional[str] = None
    expected_salary: Optional[str] = None
    skills: List[str] = []
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[Dict[str, Any]] = []
    profile_completion: int
    resume_url: Optional[str] = None
    resume_filename: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- RECRUITER SCHEMAS -----------------

class RecruiterProfileOut(BaseModel):
    id: int
    user_id: int
    company_id: Optional[int] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    company: Optional[CompanyOut] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ----------------- JOB SCHEMAS -----------------

class JobCreate(BaseModel):
    title: str = Field(..., min_length=3)
    department: Optional[str] = None
    category: str
    location: str
    work_arrangement: str  # Remote, Hybrid, On-site
    employment_type: str  # Full-time, Part-time, Contract, Internship
    experience_level: str  # Entry-level, Mid-level, Senior, Lead, Executive
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: str = "USD"
    description: str = Field(..., min_length=20)
    responsibilities: List[str] = []
    requirements: List[str] = []
    skills_required: List[str] = []
    skills_preferred: List[str] = []
    status: str = "published"  # draft, published
    deadline: Optional[datetime] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    work_arrangement: Optional[str] = None
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    skills_required: Optional[List[str]] = None
    skills_preferred: Optional[List[str]] = None
    status: Optional[str] = None
    deadline: Optional[datetime] = None

class JobOut(BaseModel):
    id: int
    recruiter_id: Optional[int] = None
    company_id: int
    title: str
    department: Optional[str] = None
    category: str
    location: str
    work_arrangement: str
    employment_type: str
    experience_level: str
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: str
    description: str
    responsibilities: List[str] = []
    requirements: List[str] = []
    skills_required: List[str] = []
    skills_preferred: List[str] = []
    status: str
    is_moderated: bool
    moderation_reason: Optional[str] = None
    deadline: Optional[datetime] = None
    views_count: int
    created_at: datetime
    updated_at: datetime
    company: Optional[CompanyOut] = None

    model_config = ConfigDict(from_attributes=True)

class JobListResponse(BaseModel):
    items: List[JobOut]
    total: int
    page: int
    size: int
    pages: int

# ----------------- APPLICATION SCHEMAS -----------------

class ApplicationCreate(BaseModel):
    job_id: int
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None
    applicant_notes: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str  # applied, under_review, shortlisted, interview_scheduled, selected, rejected, withdrawn
    notes: Optional[str] = None

class ApplicationTimelineOut(BaseModel):
    id: int
    application_id: int
    status: str
    notes: Optional[str] = None
    changed_by_user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ApplicationOut(BaseModel):
    id: int
    job_id: int
    applicant_id: int
    status: str
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None
    applicant_notes: Optional[str] = None
    recruiter_notes: Optional[str] = None
    ai_match_score: Optional[float] = None
    ai_match_details: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    job: Optional[JobOut] = None
    applicant: Optional[UserOut] = None
    timeline: List[ApplicationTimelineOut] = []

    model_config = ConfigDict(from_attributes=True)

# ----------------- SAVED JOB & ALERTS -----------------

class SavedJobOut(BaseModel):
    id: int
    user_id: int
    job_id: int
    created_at: datetime
    job: Optional[JobOut] = None

    model_config = ConfigDict(from_attributes=True)

class JobAlertCreate(BaseModel):
    title: str
    keywords: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    job_type: Optional[str] = None
    frequency: str = "weekly"

class JobAlertOut(BaseModel):
    id: int
    user_id: int
    title: str
    keywords: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    job_type: Optional[str] = None
    frequency: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ----------------- INTERVIEWS -----------------

class InterviewCreate(BaseModel):
    application_id: int
    title: str
    interview_date: str  # YYYY-MM-DD
    start_time: str  # HH:MM
    duration_minutes: int = 45
    timezone: str = "UTC"
    mode: str = "online"  # online, offline
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    instructions: Optional[str] = None

class InterviewStatusUpdate(BaseModel):
    status: str  # accepted, declined, completed, cancelled
    feedback: Optional[str] = None
    rating: Optional[int] = None

class InterviewOut(BaseModel):
    id: int
    application_id: int
    job_id: int
    applicant_id: int
    recruiter_id: int
    title: str
    interview_date: str
    start_time: str
    duration_minutes: int
    timezone: str
    mode: str
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    instructions: Optional[str] = None
    status: str
    recruiter_feedback: Optional[str] = None
    rating: Optional[int] = None
    created_at: datetime
    job: Optional[JobOut] = None
    applicant: Optional[UserOut] = None
    recruiter: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- NOTIFICATIONS -----------------

class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ----------------- AI SCHEMAS -----------------

class AIMatchRequest(BaseModel):
    job_id: int
    applicant_id: Optional[int] = None

class AIMatchResponse(BaseModel):
    job_id: int
    match_score: float  # 0 to 100
    rating_category: str  # High Match, Strong Candidate, Moderate Match, Potential Fit
    matching_skills: List[str]
    missing_required_skills: List[str]
    missing_preferred_skills: List[str]
    experience_fit: str
    explanation: str
    suggested_next_steps: List[str]
    is_ai_generated: bool
    provider: str

class SkillGapRequest(BaseModel):
    job_id: int

class LearningTask(BaseModel):
    skill: str
    priority: str  # High, Medium, Low
    learning_resources: List[str]
    recommended_project: str

class SkillGapResponse(BaseModel):
    job_title: str
    company_name: str
    overall_match_percentage: float
    skills_possessed: List[str]
    skills_to_acquire: List[str]
    learning_roadmap: List[LearningTask]
    estimated_time_to_ready: str
    provider: str

# ----------------- ADMIN & MODERATION SCHEMAS -----------------

class UserReportCreate(BaseModel):
    reported_job_id: Optional[int] = None
    reported_user_id: Optional[int] = None
    reason: str
    details: Optional[str] = None

class UserReportOut(BaseModel):
    id: int
    reporter_id: Optional[int] = None
    reported_job_id: Optional[int] = None
    reported_user_id: Optional[int] = None
    reason: str
    details: Optional[str] = None
    status: str
    moderation_notes: Optional[str] = None
    created_at: datetime
    reported_job: Optional[JobOut] = None
    reporter: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

class ReportResolutionRequest(BaseModel):
    status: str  # investigated, action_taken, dismissed
    moderation_notes: str
    take_down_job: Optional[bool] = False

class CompanyVerificationAction(BaseModel):
    status: str  # verified, rejected
    verification_notes: Optional[str] = None

class AdminDashboardMetrics(BaseModel):
    total_users: int
    total_applicants: int
    total_recruiters: int
    total_companies: int
    verified_companies: int
    active_jobs: int
    total_applications: int
    pending_reports: int
    pending_verifications: int
    recent_users: List[UserOut]

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PlatformFeedbackCreate(BaseModel):
    category: str
    message: str
    rating: int = Field(5, ge=1, le=5)

class PlatformFeedbackOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    category: str
    message: str
    rating: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
