export type UserRole = "applicant" | "recruiter" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  logo_url?: string;
  description?: string;
  industry?: string;
  website?: string;
  size?: string;
  headquarters?: string;
  contact_email?: string;
  is_verified: boolean;
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  verification_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  link?: string;
}

export interface CertificationItem {
  name: string;
  year: string;
}

export interface ApplicantProfile {
  id: number;
  user_id: number;
  headline?: string;
  bio?: string;
  location?: string;
  preferred_employment_type?: string;
  preferred_location?: string;
  expected_salary?: string;
  skills: string[];
  education: EducationItem[];
  experience: WorkExperience[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  profile_completion: number;
  resume_url?: string;
  resume_filename?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface RecruiterProfile {
  id: number;
  user_id: number;
  company_id?: number;
  job_title?: string;
  department?: string;
  company?: Company;
  created_at: string;
}

export type WorkArrangement = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type ExperienceLevel = "Entry-level" | "Mid-level" | "Senior" | "Lead" | "Executive";
export type JobStatus = "draft" | "published" | "closed" | "archived";

export interface Job {
  id: number;
  recruiter_id?: number;
  company_id: number;
  title: string;
  department?: string;
  category: string;
  location: string;
  work_arrangement: WorkArrangement;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  min_salary?: number;
  max_salary?: number;
  currency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills_required: string[];
  skills_preferred: string[];
  status: JobStatus;
  is_moderated: boolean;
  moderation_reason?: string;
  deadline?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview_scheduled"
  | "selected"
  | "rejected"
  | "withdrawn";

export interface ApplicationTimeline {
  id: number;
  application_id: number;
  status: ApplicationStatus;
  notes?: string;
  changed_by_user_id?: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  applicant_id: number;
  status: ApplicationStatus;
  resume_url?: string;
  cover_letter?: string;
  applicant_notes?: string;
  recruiter_notes?: string;
  ai_match_score?: number;
  ai_match_details?: any;
  created_at: string;
  updated_at: string;
  job?: Job;
  applicant?: User;
  timeline?: ApplicationTimeline[];
}

export interface Interview {
  id: number;
  application_id: number;
  job_id: number;
  applicant_id: number;
  recruiter_id: number;
  title: string;
  interview_date: string;
  start_time: string;
  duration_minutes: number;
  timezone: string;
  mode: "online" | "offline";
  meeting_link?: string;
  location?: string;
  instructions?: string;
  status: "scheduled" | "accepted" | "declined" | "completed" | "cancelled";
  recruiter_feedback?: string;
  rating?: number;
  created_at: string;
  job?: Job;
  applicant?: User;
  recruiter?: User;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "application" | "interview" | "job_alert" | "moderation" | "system";
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface SavedJob {
  id: number;
  user_id: number;
  job_id: number;
  created_at: string;
  job?: Job;
}

export interface JobAlert {
  id: number;
  user_id: number;
  title: string;
  keywords?: string;
  location?: string;
  category?: string;
  job_type?: string;
  frequency: "daily" | "weekly";
  is_active: boolean;
  created_at: string;
}

export interface AIMatchResult {
  job_id: number;
  match_score: number;
  rating_category: string;
  matching_skills: string[];
  missing_required_skills: string[];
  missing_preferred_skills: string[];
  experience_fit: string;
  explanation: string;
  suggested_next_steps: string[];
  is_ai_generated: boolean;
  provider: string;
}

export interface LearningTask {
  skill: string;
  priority: "High" | "Medium" | "Low";
  learning_resources: string[];
  recommended_project: string;
}

export interface SkillGapResult {
  job_title: string;
  company_name: string;
  overall_match_percentage: number;
  skills_possessed: string[];
  skills_to_acquire: string[];
  learning_roadmap: LearningTask[];
  estimated_time_to_ready: string;
  provider: string;
}

export interface AdminMetrics {
  total_users: number;
  total_applicants: number;
  total_recruiters: number;
  total_companies: number;
  verified_companies: number;
  active_jobs: number;
  total_applications: number;
  pending_reports: number;
  pending_verifications: number;
  recent_users: User[];
}

export interface UserReport {
  id: number;
  reporter_id?: number;
  reported_job_id?: number;
  reported_user_id?: number;
  reason: string;
  details?: string;
  status: "pending" | "investigated" | "action_taken" | "dismissed";
  moderation_notes?: string;
  created_at: string;
  reported_job?: Job;
  reporter?: User;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface PlatformFeedback {
  id: number;
  user_id?: number;
  user_name?: string;
  category: string;
  message: string;
  rating: number;
  created_at: string;
}
