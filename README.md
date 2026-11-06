# HireNest — Full-Stack Job Portal & Talent Acquisition Platform

[![CI Pipeline](https://github.com/sneh8989/hirenest-job-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/sneh8989/hirenest-job-portal/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x--6.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.14-3776AB.svg?logo=python&logoColor=white)](https://www.python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **"Your next opportunity starts here."**

HireNest is a full-stack recruitment and talent acquisition platform designed with an editorial, human-centred interface. It connects job seekers, employers, and platform administrators through explainable AI matching, role-based workflows, and recruitment lifecycle management.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Key Features](#4-key-features)
5. [Role-Based Workspaces & Modules](#5-role-based-workspaces--modules)
6. [Technology Stack](#6-technology-stack)
7. [System Architecture](#7-system-architecture)
8. [Folder Structure](#8-folder-structure)
9. [Screenshots](#9-screenshots)
10. [Installation & Windows Setup](#10-installation--windows-setup)
11. [Backend Execution Instructions](#11-backend-execution-instructions)
12. [Frontend Execution Instructions](#12-frontend-execution-instructions)
13. [Environment Variable Configuration](#13-environment-variable-configuration)
14. [Database Initialization & Seeding](#14-database-initialization--seeding)
15. [Demo Accounts](#15-demo-accounts)
16. [API Documentation](#16-api-documentation)
17. [Automated Testing & QA](#17-automated-testing--qa)
18. [Security & Privacy](#18-security--privacy)
19. [Future Enhancements](#19-future-enhancements)
20. [Contribution Guidelines](#20-contribution-guidelines)
21. [License](#21-license)
22. [Author Information](#22-author-information)

---

## 1. Project Overview

**HireNest** is a full-stack job portal and recruitment platform. Its main capabilities include:

- **Editorial UI Design System:** A custom interface using Forest Green (`#075E54`), Deep Teal (`#123B36`), and Warm Ivory (`#FAF8F2`).
- **Explainable AI Matching Engine:** A skill-based matching system that evaluates candidates against job requirements using a 70% required-skills and 30% preferred-skills weighting approach.
- **Role-Based Access Control (RBAC):** Separate workspaces for Applicants, Recruiters, and Platform Administrators.
- **Relational Database:** SQLAlchemy-based database management with SQLite for local development and PostgreSQL support where configured.

---

## 2. Problem Statement

Modern job portals can create several challenges:

1. **Opaque Candidate Filtering:** Applicants may not understand why their profiles match or do not match a job.
2. **Generic User Interfaces:** Poorly organised interfaces can make job discovery and recruitment management difficult.
3. **Disconnected Workflows:** Recruiters often manage job postings, applications, and interviews through separate tools.
4. **Platform Security Risks:** Weak access controls and unsafe file uploads can compromise user information.

HireNest aims to provide a unified platform that makes job discovery, candidate evaluation, and recruitment management more transparent and organised.

---

## 3. Project Objectives

- **Explainable Talent Matching:** Provide understandable candidate match scores and skill-gap information.
- **Simplified Development:** Provide PowerShell scripts for Windows setup, execution, and testing.
- **Structured Data Management:** Use relational data models and organised backend services.
- **Secure User Management:** Apply authentication, role-based access, and file-upload validation.
- **End-to-End Recruitment:** Support the workflow from job discovery to application tracking and candidate selection.

---

## 4. Key Features

- **Job Discovery:** Search and filter jobs by keyword, location, work arrangement, employment type, experience, and salary.
- **Job Applications:** Apply for jobs, upload resumes, add cover letters, and track application progress.
- **Recruitment Pipeline:** Manage candidates through stages such as:
  `Applied` → `Under Review` → `Shortlisted` → `Interview Scheduled` → `Selected` / `Rejected`.
- **Interview Scheduling:** Manage interview invitations and meeting details.
- **AI Skill Matching:** Compare candidate skills with job requirements.
- **Skill Gap Analysis:** Identify missing skills and areas for improvement.
- **Administration:** Manage users, company verification, job moderation, and platform activity.

---

## 5. Role-Based Workspaces & Modules

### Applicant Workspace

- **Dashboard:** View applications, interviews, saved jobs, and profile information.
- **Profile & Resume Center:** Manage personal details, education, experience, and resume uploads.
- **Application Tracker:** Monitor application status and recruitment progress.
- **Saved Jobs:** Bookmark interesting opportunities.
- **Skill Gap Analyzer:** Compare personal skills with job requirements.

### Recruiter Workspace

- **Recruiter Dashboard:** View job vacancies, applicant numbers, and interview activity.
- **Job Management:** Create, edit, publish, and manage job listings.
- **Candidate Pipeline:** Review candidates and manage application stages.
- **Interview Coordination:** Schedule and manage interviews.
- **Company Profile:** Maintain company information and branding details.

### Administrator Governance Workspace

- **System Metrics:** Monitor platform users, companies, jobs, and applications.
- **User Management:** Search, activate, and suspend accounts.
- **Job Moderation:** Review and moderate reported job listings.
- **Company Verification:** Review employer verification requests.
- **Audit Trails:** Review administrative and authentication events.

---

## 6. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 | User interface |
| Language | TypeScript | Type safety |
| Build Tool | Vite | Development and production builds |
| Styling | Tailwind CSS | UI styling |
| Routing | React Router DOM | Frontend navigation |
| HTTP Client | Axios | API communication |
| Icons & Charts | Lucide React, Recharts | Icons and visualisations |
| Backend | FastAPI | REST API |
| Language | Python | Backend development |
| ORM | SQLAlchemy 2.0 | Database operations |
| Database | SQLite / PostgreSQL | Data storage |
| Validation | Pydantic v2 | Data validation |
| Authentication | JWT | Authentication and authorisation |
| Testing | Pytest | Backend testing |

---

## 7. System Architecture

```mermaid
flowchart LR
    subgraph Client["Frontend Client"]
        SPA["React + TypeScript"]
        Auth["Authentication Context"]
        Axios["Axios API Client"]
    end

    subgraph Server["FastAPI Backend"]
        API["FastAPI Router Engine"]
        RBAC["RBAC Dependencies"]
        AI["AI Matching Service"]
        Storage["File Storage Service"]
    end

    subgraph Database["Persistence"]
        DB[("SQLite / PostgreSQL")]
        Uploads[("Resume Storage")]
    end

    SPA --> Auth
    Auth --> Axios
    Axios -->|"JWT / JSON"| API
    API --> RBAC
    RBAC --> AI
    API --> DB
    API --> Storage
    Storage --> Uploads
```

For more details, refer to [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 8. Folder Structure

```text
HireNest/
│
├── backend/
│   ├── app/
│   │   ├── core/              # Configuration, database and security
│   │   ├── data/              # Database seed data
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routers/           # API routes
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic and services
│   │
│   ├── tests/                 # Backend tests
│   ├── uploads/               # Local resume storage
│   ├── pytest.ini
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Application contexts
│   │   ├── pages/             # Application pages
│   │   ├── services/          # API services
│   │   └── types/             # TypeScript types
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── scripts/
│   ├── setup-windows.ps1
│   ├── run-backend.ps1
│   ├── run-frontend.ps1
│   ├── run-tests.ps1
│   └── seed-data.ps1
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY.md
│   └── TESTING.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── .env.example
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 9. Screenshots

Add genuine screenshots of your application inside `docs/screenshots/` and use the following references:

| Landing & Job Discovery | AI Match Score |
|---|---|
| ![Landing Page](docs/screenshots/landing_page.png) | ![AI Match Score](docs/screenshots/ai_match_score.png) |

| Recruiter Pipeline | Admin Dashboard |
|---|---|
| ![Recruiter Pipeline](docs/screenshots/recruiter_pipeline.png) | ![Admin Dashboard](docs/screenshots/admin_dashboard.png) |

*These images will appear once the corresponding screenshot files have been added to the repository.*

---

## 10. Installation & Windows Setup

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm
- Windows 10 or 11
- PowerShell

### Automated Setup

Open PowerShell in the project root:

```powershell
.\scripts\setup-windows.ps1
```

The setup script is intended to:

1. Check Python, Node.js, and npm.
2. Create the backend environment configuration.
3. Create a Python virtual environment.
4. Install backend dependencies.
5. Install frontend dependencies.
6. Initialise and seed the database, if configured by the script.

---

## 11. Backend Execution Instructions

### Using PowerShell Script

From the project root:

```powershell
.\scripts\run-backend.ps1
```

### Manual Execution

```powershell
cd backend

.\venv\Scripts\Activate.ps1

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

## 12. Frontend Execution Instructions

### Using PowerShell Script

From the project root:

```powershell
.\scripts\run-frontend.ps1
```

### Manual Execution

```powershell
cd frontend

npm install

npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend URL:

```text
http://127.0.0.1:5173
```

---

## 13. Environment Variable Configuration

Create your backend `.env` file using the example configuration.

```powershell
Copy-Item .env.example backend/.env
```

Example configuration:

```ini
# Application
ENVIRONMENT=development
DEBUG=True

# Authentication
SECRET_KEY=CHANGE_THIS_TO_A_SECURE_RANDOM_SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database
DATABASE_URL=sqlite:///./hirenest.db

# PostgreSQL example
# DATABASE_URL=postgresql://user:password@localhost:5432/hirenest

# Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10

# AI Provider
AI_PROVIDER=deterministic
```

Generate a secure random secret key using:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Important:** Never commit your real `.env` file or production secrets to GitHub.

---

## 14. Database Initialization & Seeding

To initialise the database and populate it with demo data, use:

```powershell
.\scripts\seed-data.ps1
```

Alternatively, if the backend seed module is available:

```powershell
cd backend

.\venv\Scripts\python.exe -m app.data.seed_data
```

**Note:** Check the seed script before running it. It may reset or replace existing local demo data.

---

## 15. Demo Accounts

The following accounts were listed in the original project documentation. Confirm that they are actually created by your seed script before relying on them.

| Role | Name | Email | Password |
|---|---|---|---|
| Admin | Eleanor Vance | `admin@hirenest.com` | `Admin@123` |
| Recruiter | Sarah Jenkins | `sarah.recruiter@techpulse.io` | `Recruiter@123` |
| Recruiter | David Miller | `david.hiring@greenwave.co` | `Recruiter@123` |
| Applicant | Alex Rivera | `alex.dev@gmail.com` | `Applicant@123` |
| Applicant | Maya Chen | `maya.ux@gmail.com` | `Applicant@123` |
| Applicant | Liam O'Connor | `liam.data@gmail.com` | `Applicant@123` |

> **Demo only:** These are example development credentials, not production credentials. Never reuse them for real accounts.

---

## 16. API Documentation

HireNest uses FastAPI and its OpenAPI documentation.

- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`
- **Health Check:** `GET /api/health`

For the endpoint catalogue, refer to [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

---

## 17. Automated Testing & QA

Run the test script from the project root:

```powershell
.\scripts\run-tests.ps1
```

The original project documentation listed the following backend test cases:

1. `test_health_check`
2. `test_auth_login_applicant`
3. `test_auth_login_recruiter`
4. `test_auth_login_admin`
5. `test_auth_invalid_credentials`
6. `test_job_search_and_filters`
7. `test_ai_match_score`
8. `test_prevent_duplicate_application`
9. `test_applicant_cannot_access_admin_endpoints`
10. `test_recruiter_cannot_access_admin_endpoints`
11. `test_unauthenticated_cannot_access_protected`
12. `test_admin_metrics_and_user_moderation`
13. `test_get_job_categories`
14. `test_applicant_profile_retrieval`
15. `test_public_feedback_submission`

For complete testing instructions, refer to [docs/TESTING.md](docs/TESTING.md).

*Run the tests in your environment and update this section if the actual test suite differs.*

---

## 18. Security & Privacy

The project documentation describes the following security measures:

- **Password Protection:** Password hashing using PBKDF2-HMAC-SHA256.
- **JWT Authentication:** Signed authentication tokens with expiration.
- **File Upload Validation:** Resume file type and size restrictions.
- **Role-Based Access:** Protected routes and role-based permissions.
- **Environment Protection:** Secrets and local environment files excluded from source control.
- **Database Management:** Structured database access through SQLAlchemy.

For further details, refer to [docs/SECURITY.md](docs/SECURITY.md).

---

## 19. Future Enhancements

Potential improvements for future versions:

- [ ] Real-time messaging between recruiters and applicants.
- [ ] Google Calendar and Outlook interview integration.
- [ ] Multi-tenant organisation support.
- [ ] Automated video assessments.
- [ ] Advanced AI-based candidate recommendations.
- [ ] Email and notification automation.
- [ ] More detailed analytics dashboards.

---

## 20. Contribution Guidelines

Contributions and suggestions are welcome.

Please review [CONTRIBUTING.md](CONTRIBUTING.md) for coding standards, branch conventions, and pull request guidelines.

---

## 21. License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 22. Author Information

**Sneh Kheni**

Full-Stack Developer | MCA Student

- GitHub: [@sneh8989](https://github.com/sneh8989)
- Project Repository: [HireNest – Job Portal](https://github.com/sneh8989/hirenest-job-portal)

---

**HireNest — Your next opportunity starts here.**

*Built as a full-stack software development project.*
