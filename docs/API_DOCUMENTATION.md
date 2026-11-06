# HireNest — REST API Documentation

The HireNest backend exposes a clean, modular RESTful API built on **FastAPI** with automatic OpenAPI/Swagger interactive documentation.

- **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`
- **Base API URL**: `http://127.0.0.1:8000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

All secured endpoints expect an `Authorization: Bearer <JWT_ACCESS_TOKEN>` header.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/applicant` | Register a new job seeker account | Public |
| `POST` | `/api/auth/register/recruiter` | Register a new employer recruiter account & company | Public |
| `POST` | `/api/auth/login` | Authenticate user with email and password | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user identity | Authenticated |
| `POST` | `/api/auth/forgot-password` | Request password reset verification link | Public |
| `POST` | `/api/auth/reset-password` | Submit reset token and new password | Public |
| `POST` | `/api/auth/change-password` | Change password for active user session | Authenticated |

### Example: Login Request
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "alex.dev@gmail.com",
  "password": "Applicant@123"
}
```

### Example: Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 5,
    "email": "alex.dev@gmail.com",
    "full_name": "Alex Rivera",
    "role": "applicant",
    "is_active": true,
    "is_verified": true
  }
}
```

---

## 2. Job Vacancy Discovery (`/api/jobs`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/jobs` | Paginated search with query, filter facets, and sorting | Public |
| `GET` | `/api/jobs/categories` | Count of published vacancies grouped by category | Public |
| `GET` | `/api/jobs/{job_id}` | Retrieve comprehensive job vacancy details | Public |
| `POST` | `/api/jobs` | Publish a new job vacancy | Recruiter, Admin |
| `PUT` | `/api/jobs/{job_id}` | Update existing job vacancy | Recruiter (Owner), Admin |
| `DELETE` | `/api/jobs/{job_id}` | Archive or remove job vacancy | Recruiter (Owner), Admin |

### Query Parameters for `/api/jobs`:
- `q`: Search keyword (matches title, description, skills, category).
- `location`: Free-text location filter.
- `work_arrangement`: `Remote`, `Hybrid`, `On-site`.
- `employment_type`: `Full-time`, `Part-time`, `Contract`, `Internship`.
- `experience_level`: `Entry-level`, `Mid-level`, `Senior`, `Lead`, `Executive`.
- `category`: Functional category (e.g. `Engineering`, `Design`, `Product`).
- `min_salary`: Minimum integer salary threshold.
- `sort_by`: `latest`, `salary_desc`, `views`.
- `page`: Page index (1-based, default 1).
- `size`: Results per page (default 10, max 50).

---

## 3. Applications Pipeline (`/api/applications`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/applications` | Submit application to a vacancy (enforces single application) | Applicant |
| `GET` | `/api/applications/{application_id}` | Get application status and timeline | Applicant (Owner), Recruiter, Admin |
| `PATCH` | `/api/applications/{application_id}/status` | Transition stage (`applied` -> `under_review` -> `shortlisted` -> `interview_scheduled` -> `selected` / `rejected`) | Recruiter, Admin |

---

## 4. Applicant Workspace (`/api/applicant`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/applicant/profile` | Retrieve applicant profile, skills, education, and resume | Applicant |
| `PUT` | `/api/applicant/profile` | Update profile information | Applicant |
| `POST` | `/api/applicant/resume` | Upload PDF/DOCX resume file (sanitized & size-validated) | Applicant |
| `GET` | `/api/applicant/applications` | List all applications submitted by applicant | Applicant |
| `GET` | `/api/applicant/saved-jobs` | List bookmarked job vacancies | Applicant |
| `POST` | `/api/applicant/saved-jobs/{job_id}` | Bookmark vacancy | Applicant |
| `DELETE` | `/api/applicant/saved-jobs/{job_id}` | Remove bookmark | Applicant |
| `GET` | `/api/applicant/job-alerts` | List configured automated search alerts | Applicant |
| `POST` | `/api/applicant/job-alerts` | Create automated search alert | Applicant |

---

## 5. Recruiter Workspace (`/api/recruiter`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/recruiter/dashboard-metrics` | Aggregated hiring funnel metrics and vacancy stats | Recruiter, Admin |
| `GET` | `/api/recruiter/jobs` | Retrieve all jobs created by recruiter | Recruiter, Admin |
| `GET` | `/api/recruiter/applicants` | Review candidate pipeline across vacancies | Recruiter, Admin |
| `GET` | `/api/recruiter/company-profile` | Company profile details for employer branding | Recruiter, Admin |
| `PUT` | `/api/recruiter/company-profile` | Update company information | Recruiter, Admin |

---

## 6. AI Matching & Skill Gap Analysis (`/api/ai`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/match-score` | Calculate deterministic/AI match score for a job | Applicant |
| `POST` | `/api/ai/skill-gap-analysis` | Detailed delta between applicant skills and job stack | Applicant |

---

## 7. Platform Governance & Moderation (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/metrics` | System-wide platform metrics and growth counts | Admin |
| `GET` | `/api/admin/users` | User management list with role/status filters | Admin |
| `PATCH` | `/api/admin/users/{user_id}/status` | Activate or suspend user accounts | Admin |
| `GET` | `/api/admin/audit-logs` | Immutable audit log trail of security actions | Admin |
| `GET` | `/api/admin/verifications` | Company verification queue | Admin |
| `POST` | `/api/admin/verifications/{request_id}/review` | Approve or reject employer verification | Admin |
| `GET` | `/api/admin/reports` | Moderation queue of flagged listings or users | Admin |
| `POST` | `/api/admin/reports/{report_id}/resolve` | Resolve moderation case | Admin |

---

## 8. Health & System Status (`/api/health`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status, version, and AI engine mode | Public |
| `GET` | `/api` | Root API descriptor and OpenAPI documentation link | Public |

