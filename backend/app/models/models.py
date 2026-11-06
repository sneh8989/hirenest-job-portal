from datetime import datetime, timezone
import json
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Enum, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="applicant")  # "applicant", "recruiter", "admin"
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    applicant_profile = relationship("ApplicantProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="applicant", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    job_alerts = relationship("JobAlert", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reports_submitted = relationship("UserReport", back_populates="reporter", foreign_keys="UserReport.reporter_id")
    jobs_posted = relationship("Job", back_populates="recruiter", foreign_keys="Job.recruiter_id")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    logo_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    industry = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    size = Column(String(50), nullable=True)  # "1-10", "11-50", "51-200", "201-500", "500+"
    headquarters = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_status = Column(String(50), default="unverified", nullable=False)  # "unverified", "pending", "verified", "rejected"
    verification_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    recruiters = relationship("RecruiterProfile", back_populates="company")
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")
    verification_requests = relationship("CompanyVerificationRequest", back_populates="company", cascade="all, delete-orphan")


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    job_title = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="recruiter_profile")
    company = relationship("Company", back_populates="recruiters")


class ApplicantProfile(Base):
    __tablename__ = "applicant_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    preferred_employment_type = Column(String(50), nullable=True)
    preferred_location = Column(String(255), nullable=True)
    expected_salary = Column(String(100), nullable=True)
    skills = Column(JSON, default=list, nullable=False)  # List of strings: ["React", "TypeScript", "Node.js"]
    education = Column(JSON, default=list, nullable=False)  # List of dicts
    experience = Column(JSON, default=list, nullable=False)  # List of dicts
    projects = Column(JSON, default=list, nullable=False)  # List of dicts
    certifications = Column(JSON, default=list, nullable=False)  # List of dicts
    profile_completion = Column(Integer, default=40, nullable=False)  # 0 to 100
    resume_url = Column(String(500), nullable=True)
    resume_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="applicant_profile")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), index=True, nullable=False)
    department = Column(String(100), nullable=True)
    category = Column(String(100), index=True, nullable=False)  # Engineering, Design, Product, etc.
    location = Column(String(255), index=True, nullable=False)
    work_arrangement = Column(String(50), nullable=False)  # "Remote", "Hybrid", "On-site"
    employment_type = Column(String(50), nullable=False)  # "Full-time", "Part-time", "Contract", "Internship"
    experience_level = Column(String(50), nullable=False)  # "Entry-level", "Mid-level", "Senior", "Lead", "Executive"
    min_salary = Column(Integer, nullable=True)
    max_salary = Column(Integer, nullable=True)
    currency = Column(String(10), default="USD", nullable=False)
    description = Column(Text, nullable=False)
    responsibilities = Column(JSON, default=list, nullable=False)  # List of strings
    requirements = Column(JSON, default=list, nullable=False)  # List of strings
    skills_required = Column(JSON, default=list, nullable=False)  # List of strings
    skills_preferred = Column(JSON, default=list, nullable=False)  # List of strings
    status = Column(String(50), default="published", index=True, nullable=False)  # "draft", "published", "closed", "archived"
    is_moderated = Column(Boolean, default=False, nullable=False)
    moderation_reason = Column(String(255), nullable=True)
    deadline = Column(DateTime, nullable=True)
    views_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, index=True, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="jobs")
    recruiter = relationship("User", back_populates="jobs_posted", foreign_keys=[recruiter_id])
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
    reports = relationship("UserReport", back_populates="reported_job", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), index=True, nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    status = Column(String(50), default="applied", index=True, nullable=False)  # applied, under_review, shortlisted, interview_scheduled, selected, rejected, withdrawn
    resume_url = Column(String(500), nullable=True)
    cover_letter = Column(Text, nullable=True)
    applicant_notes = Column(Text, nullable=True)
    recruiter_notes = Column(Text, nullable=True)
    ai_match_score = Column(Float, nullable=True)  # 0 to 100
    ai_match_details = Column(JSON, nullable=True)  # breakdown dict
    created_at = Column(DateTime, default=utc_now, index=True, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    job = relationship("Job", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
    timeline = relationship("ApplicationTimeline", back_populates="application", cascade="all, delete-orphan", order_by="ApplicationTimeline.created_at.asc()")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")


class ApplicationTimeline(Base):
    __tablename__ = "application_timelines"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    changed_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    application = relationship("Application", back_populates="timeline")
    changed_by = relationship("User", foreign_keys=[changed_by_user_id])


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")


class JobAlert(Base):
    __tablename__ = "job_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    keywords = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    job_type = Column(String(50), nullable=True)
    frequency = Column(String(50), default="weekly", nullable=False)  # daily, weekly
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="job_alerts")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recruiter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    interview_date = Column(String(50), nullable=False)  # YYYY-MM-DD
    start_time = Column(String(50), nullable=False)  # HH:MM
    duration_minutes = Column(Integer, default=45, nullable=False)
    timezone = Column(String(50), default="UTC", nullable=False)
    mode = Column(String(50), default="online", nullable=False)  # online, offline
    meeting_link = Column(String(500), nullable=True)
    location = Column(String(255), nullable=True)
    instructions = Column(Text, nullable=True)
    status = Column(String(50), default="scheduled", nullable=False)  # scheduled, accepted, declined, completed, cancelled
    recruiter_feedback = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1 to 5
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    application = relationship("Application", back_populates="interviews")
    job = relationship("Job")
    applicant = relationship("User", foreign_keys=[applicant_id])
    recruiter = relationship("User", foreign_keys=[recruiter_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system", nullable=False)  # application, interview, job_alert, moderation, system
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utc_now, index=True, nullable=False)

    user = relationship("User", back_populates="notifications")


class UserReport(Base):
    __tablename__ = "user_reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reported_job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True)
    reported_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    reason = Column(String(100), nullable=False)  # "misleading", "spam", "inappropriate", "fake_company", "other"
    details = Column(Text, nullable=True)
    status = Column(String(50), default="pending", nullable=False)  # pending, investigated, action_taken, dismissed
    moderation_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    reporter = relationship("User", back_populates="reports_submitted", foreign_keys=[reporter_id])
    reported_job = relationship("Job", back_populates="reports")
    reported_user = relationship("User", foreign_keys=[reported_user_id])


class CompanyVerificationRequest(Base):
    __tablename__ = "company_verification_requests"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_registration_no = Column(String(100), nullable=False)
    document_url = Column(String(500), nullable=True)
    official_website = Column(String(255), nullable=True)
    status = Column(String(50), default="pending", nullable=False)  # pending, approved, rejected
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    company = relationship("Company", back_populates="verification_requests")
    requester = relationship("User", foreign_keys=[requester_id])


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now, index=True, nullable=False)


class PlatformFeedback(Base):
    __tablename__ = "platform_feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_name = Column(String(255), nullable=True)
    category = Column(String(100), nullable=False)  # platform_usability, bug_report, feature_request, recruiter_tools
    message = Column(Text, nullable=False)
    rating = Column(Integer, default=5, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
