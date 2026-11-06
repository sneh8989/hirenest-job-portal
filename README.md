<<<<<<< HEAD
# HireNest — Enterprise Full-Stack Job Portal & Talent Acquisition Platform

[![CI Pipeline](https://github.com/snehkheni/HireNest/actions/workflows/ci.yml/badge.svg)](https://github.com/snehkheni/HireNest/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x--6.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.11_|_3.12_|_3.14-3776AB.svg?logo=python&logoColor=white)](https://www.python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **"Your next opportunity starts here."**  
> HireNest is a commercial-grade, full-stack recruitment and talent acquisition platform designed with an editorial, human-centred aesthetic. It bridges the gap between ambitious job seekers, high-growth employers, and platform administrators through explainable AI matching, role-based workflows, and end-to-end recruitment lifecycle management.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Key Features](#4-key-features)
5. [Role-Based Workspaces & Modules](#5-role-based-workspaces--modules)
   - [Applicant Workspace](#applicant-workspace)
   - [Recruiter Workspace](#recruiter-workspace)
   - [Administrator Governance Workspace](#administrator-governance-workspace)
6. [Technology Stack](#6-technology-stack)
7. [System Architecture](#7-system-architecture)
8. [Folder Structure](#8-folder-structure)
9. [Screenshots](#9-screenshots)
10. [Installation & Windows Setup](#10-installation--windows-setup)
11. [Backend Execution Instructions](#11-backend-execution-instructions)
12. [Frontend Execution Instructions](#12-frontend-execution-instructions)
13. [Environment Variable Configuration](#13-environment-variable-configuration)
14. [Database Initialization & Seeding](#14-database-initialization--seeding)
15. [Verified Demo Accounts](#15-verified-demo-accounts)
16. [API Documentation](#16-api-documentation)
17. [Automated Testing & QA](#17-automated-testing--qa)
18. [Security & Privacy Governance](#18-security--privacy-governance)
19. [Future Enhancements](#19-future-enhancements)
20. [Contribution Guidelines](#20-contribution-guidelines)
21. [License](#21-license)
22. [Author Information](#22-author-information)

---

## 1. Project Overview

**HireNest** is a full-stack, enterprise-grade job board and recruitment SaaS platform. Unlike generic portfolio projects built with stock templates, HireNest is crafted with:
- A custom **Editorial UI Design System** using bespoke typography and earthy, trust-inducing tones (Forest Green `#075E54`, Deep Teal `#123B36`, Warm Ivory `#FAF8F2`).
- A **Deterministic, Explainable AI Matching Engine** (70% required skills / 30% preferred skills) that transparently reveals why a candidate matches a vacancy and recommends precise upskilling steps.
- **Strict Role-Based Access Control (RBAC)** separating Applicants, Recruiters, and Platform Administrators across dedicated interfaces.
- 15 relational tables managed via **SQLAlchemy 2.0** ORM supporting zero-setup SQLite locally and PostgreSQL in production.

---

## 2. Problem Statement

Modern job boards frequently suffer from:
1. **Opaque "Black-Box" Filtering**: Algorithmic Applicant Tracking Systems (ATS) discard qualified candidates without explaining why or providing constructive feedback.
2. **Generic, Fatiguing UI Patterns**: Neon gradients, cookie-cutter component libraries, and inconsistent spacing harm candidate focus and recruiter productivity.
3. **Disconnected Workflows**: Employers juggle disparate spreadsheets, email threads, and interview scheduling tools rather than a cohesive hiring pipeline.
4. **Platform Security Gaps**: Weak access controls, unvalidated file uploads, and unmoderated spam compromise trust and data privacy.

---

## 3. Project Objectives

- **Explainable Talent Matching**: Demystify AI candidate screening by providing actionable match breakdowns and gap analyses.
- **Frictionless Windows Development**: Provide zero-dependency PowerShell automation scripts for one-click setup, execution, and testing.
- **Production-Grade Data Modeling**: Implement normalized relational schema with cascading constraints, audit logging, and reporting mechanisms.
- **Uncompromised Security**: Protect candidate resumes with MIME validation, randomized UUID hashing, size boundaries, and PBKDF2-HMAC password encryption.

---

## 4. Key Features

- **Faceted Job Discovery**: Real-time filtering by keyword, location, work arrangement (Remote, Hybrid, On-site), employment type, experience tier, and salary threshold.
- **One-Click Application System**: Upload validated PDF/DOCX resumes, attach cover letters, and track application progression in real time.
- **Kanban-Style Recruitment Pipeline**: Transition candidates through distinct hiring stages: `Applied` &rarr; `Under Review` &rarr; `Shortlisted` &rarr; `Interview Scheduled` &rarr; `Selected` / `Rejected`.
- **Integrated Interview Scheduling**: Schedule video and in-person interviews with automatic candidate calendar notifications and timezone alignment.
- **Skill Gap & Learning Pathways**: Interactive candidate diagnostics comparing individual skill profiles against job requirements to recommend specific focus areas.
- **Comprehensive Administration Suite**: Platform growth metrics, recruiter verification review, content moderation queues, and immutable audit logs.

---

## 5. Role-Based Workspaces & Modules

### Applicant Workspace
- **Dashboard**: High-level overview of active applications, interview invites, saved jobs, and profile completion health score.
- **Profile & Resume Center**: Manage rich work experience, education, portfolio links, and upload sanitized resumes.
- **Application Tracker**: Detailed timeline cards tracking status updates and recruiter feedback.
- **Saved Jobs & Search Alerts**: Bookmark opportunities and configure search criteria for recurring matches.
- **Skill Gap Analyzer**: Visual radar of acquired competencies versus market demands for target roles.

### Recruiter Workspace
- **Recruiter Dashboard**: Aggregate metrics on active job vacancies, total applicant volume, shortlists, and scheduled interviews.
- **Job Posting Management**: Multi-step wizard to create, edit, publish, or pause job listings with granular skill requirements.
- **Candidate Pipeline**: Filter and inspect applicants by AI match score, download resumes, and log recruitment notes.
- **Interview Coordination**: Create, update, and manage candidate interview invitations with meeting URLs.
- **Employer Branding Profile**: Manage company profile, verified badge requests, culture descriptions, and company logo.

### Administrator Governance Workspace
- **System Metrics**: Real-time platform census: total registered users, applicants, verified companies, active listings, and application volume.
- **User Management**: Search, inspect, activate, or suspend accounts across all roles.
- **Listing Moderation**: Review reported job postings and take corrective moderation actions.
- **Employer Verification**: Review company registration documents and grant verified badges.
- **Audit Trails**: Immutable event ledger tracking administrative and authentication events.

---

## 6. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | 19.2+ | Modern reactive component hierarchy |
| **Language (Client)** | TypeScript | 5.x / 6.x | Strict type contracts and interface definitions |
| **Build Tooling** | Vite | 8.x | High-performance bundling and HMR dev server |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first editorial design system tokens |
| **Routing** | React Router DOM | 7.x | Declarative nested routing & protected route guards |
| **HTTP Client** | Axios | 1.x | Typed REST API requests with JWT interceptor |
| **Icons & Charts** | Lucide React & Recharts | Latest | Cohesive icons and analytical SVG visualizations |
| **Backend Framework** | FastAPI | 0.115+ | High-throughput asynchronous REST API |
| **Language (Server)** | Python | 3.11–3.14+ | Core backend runtime (verified on 3.14.4) |
| **ORM & Database** | SQLAlchemy | 2.0+ | Relational mapping across 15 entities |
| **Data Validation** | Pydantic | v2.8+ | Fast schema validation and serialization contracts |
| **Auth & Encryption** | PyJWT & PBKDF2-HMAC | Latest | Cryptographically salted password hashing & tokens |
| **Testing** | Pytest & AnyIO / HTTPX | 8.2+ | Asynchronous end-to-end endpoint test coverage |

---

## 7. System Architecture

```mermaid
flowchart LR
    subgraph Client["Frontend Client (React 19 + TypeScript)"]
        SPA["Vite SPA"]
        AuthContext["Auth Context"]
        Axios["Axios Interceptor"]
    end

    subgraph Server["FastAPI Application"]
        FastAPIApp["FastAPI Router Engine"]
        Deps["RBAC Dependencies"]
        AISvc["AI Service"]
        StorageSvc["Storage Service"]
    end

    subgraph Storage["Persistence & Media"]
        DB[("hirenest.db (SQLite / Postgres)")]
        Uploads[("backend/uploads/resumes")]
    end

    SPA --> AuthContext --> Axios
    Axios -->|"Bearer JWT / JSON"| FastAPIApp
    FastAPIApp --> Deps
    Deps --> AISvc & StorageSvc
    FastAPIApp --> DB
    StorageSvc --> Uploads
```

For full architectural diagrams and entity-relationship models, refer to [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 8. Folder Structure

```
HireNest/
├── backend/
│   ├── app/
│   │   ├── core/             # Database session, config, security & dependencies
│   │   ├── data/             # Realistic database seed fixtures
│   │   ├── models/           # SQLAlchemy 2.0 relational models (15 tables)
│   │   ├── routers/          # Modular API controllers (auth, jobs, apps, admin, ai)
│   │   ├── schemas/          # Pydantic v2 schemas and validation models
│   │   └── services/         # AI matching, storage, notification & audit services
│   ├── tests/                # Automated pytest suite (15 integration test cases)
│   ├── uploads/              # Isolated local file storage for resumes (.gitkeep)
│   ├── pytest.ini            # Pytest test execution settings
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Backend environment template
│
├── frontend/
│   ├── public/               # Public assets and branding
│   ├── src/
│   │   ├── components/       # Common design system atoms (Button, Badge, Modal, etc.)
│   │   ├── context/          # Authentication & Notification state providers
│   │   ├── pages/            # Role-scoped pages (Public, Applicant, Recruiter, Admin)
│   │   ├── services/         # Typed Axios API client bindings
│   │   └── types/            # TypeScript data model definitions
│   ├── package.json          # Frontend packages and scripts
│   ├── tailwind.config.js    # Editorial color theme configuration
│   └── vite.config.ts        # Vite build tool configuration
│
├── scripts/
│   ├── setup-windows.ps1     # One-click Windows setup script
│   ├── run-backend.ps1       # Launch FastAPI backend on port 8000
│   ├── run-frontend.ps1      # Launch React dev server on port 5173
│   ├── run-tests.ps1         # Full test suite & build runner
│   └── seed-data.ps1         # Reseed database with realistic demo accounts
│
├── docs/
│   ├── ARCHITECTURE.md       # Comprehensive architectural blueprints
│   ├── API_DOCUMENTATION.md  # Detailed REST API endpoint specification
│   ├── SECURITY.md           # Security controls and cryptography policy
│   └── TESTING.md            # Testing matrix and QA procedures
│
├── .github/
│   └── workflows/
│       └── ci.yml            # Automated CI pipeline for GitHub Actions
│
├── .gitignore                # Comprehensive exclusions (venv, node_modules, .db, uploads)
├── .env.example              # Root environment template
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # Open-source MIT License
└── README.md                 # Primary documentation
```

---

## 9. Screenshots

> *Screenshots capture authentic workflows from the live HireNest application.*

| Landing & Job Discovery | AI Match Score & Explanation |
|:---:|:---:|
| ![Landing Page Preview](docs/screenshots/landing_page.png) *Editorial Landing Page & Search* | ![AI Match Preview](docs/screenshots/ai_match_score.png) *Explainable 70/30 Skill Match Breakdown* |

| Recruiter Hiring Pipeline | Administrator Governance Dashboard |
|:---:|:---:|
| ![Recruiter Pipeline Preview](docs/screenshots/recruiter_pipeline.png) *Candidate Funnel Management* | ![Admin Dashboard Preview](docs/screenshots/admin_dashboard.png) *Platform Growth & Moderation* |

*(Note: Place your genuine application screenshots inside `docs/screenshots/` to display them here).*

---

## 10. Installation & Windows Setup

### Prerequisites
- **Python**: Version 3.11 or higher (Tested on Python 3.14.4).
- **Node.js**: Version 18 or higher (Tested on Node.js v24 / npm 11).
- **PowerShell**: Windows 10 or 11 with script execution enabled.

### Automated Setup (Recommended)
From the repository root, run the setup automation script in PowerShell:
```powershell
.\scripts\setup-windows.ps1
```
This script will:
1. Verify Python, Node.js, and npm installations.
2. Create `backend/.env` from `.env.example` with an automatically generated, unique 32-byte cryptographic secret key.
3. Create a Python virtual environment in `backend/venv` and install `requirements.txt`.
4. Install all frontend npm dependencies in `frontend/`.
5. Initialize the SQLite database and seed it with realistic demo users, jobs, applications, and logs.

---

## 11. Backend Execution Instructions

### Via PowerShell Automation Script:
```powershell
.\scripts\run-backend.ps1
```

### Via Manual Commands:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

---

## 12. Frontend Execution Instructions

### Via PowerShell Automation Script:
```powershell
.\scripts\run-frontend.ps1
```

### Via Manual Commands:
```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
- **Application URL**: `http://127.0.0.1:5173`

---

## 13. Environment Variable Configuration

Copy `.env.example` to `backend/.env`:
```powershell
cp .env.example backend/.env
```

Key configuration variables:
```ini
# Application Core
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=CHANGE_THIS_TO_A_SECURE_RANDOM_SECRET_KEY_MIN_32_BYTES
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database (Default: zero-setup local SQLite)
DATABASE_URL=sqlite:///./hirenest.db
# PostgreSQL for production:
# DATABASE_URL=postgresql://user:pass@localhost:5432/hirenest

# Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10

# AI Provider ("deterministic", "openai", "gemini")
AI_PROVIDER=deterministic
```

To generate a cryptographically strong secret key for production:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 14. Database Initialization & Seeding

To reset and populate the database with realistic demo accounts, published vacancies, sample applications, and audit logs:
```powershell
.\scripts\seed-data.ps1
```
*Or manually:*
```powershell
cd backend
.\venv\Scripts\python.exe -m app.data.seed_data
```

---

## 15. Verified Demo Accounts

All credentials below have been verified against the test suite and database seed data:

| Role | Name | Email | Password | Primary Capabilities |
|---|---|---|---|---|
| **Admin** | Eleanor Vance | `admin@hirenest.com` | `Admin@123` | Platform metrics, user moderation, company verifications, audit logs |
| **Recruiter** | Sarah Jenkins | `sarah.recruiter@techpulse.io` | `Recruiter@123` | Post jobs, candidate stage management, interview scheduling |
| **Recruiter** | David Miller | `david.hiring@greenwave.co` | `Recruiter@123` | Employer branding, applicant evaluation |
| **Applicant** | Alex Rivera | `alex.dev@gmail.com` | `Applicant@123` | Senior Frontend Dev profile, AI match analysis, application tracking |
| **Applicant** | Maya Chen | `maya.ux@gmail.com` | `Applicant@123` | Product Designer profile, portfolio showcase |
| **Applicant** | Liam O'Connor | `liam.data@gmail.com` | `Applicant@123` | ML Engineer profile, skill gap diagnostics |

> [!NOTE]
> The login page includes quick-fill demo buttons to allow instant, one-click evaluation without typing credentials manually.

---

## 16. API Documentation

HireNest provides a fully documented RESTful API with OpenAPI v3 standards:
- **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc Technical Reference**: `http://127.0.0.1:8000/redoc`
- **Health Check Endpoint**: `GET /api/health`

For the complete endpoint catalogue, refer to [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

---

## 17. Automated Testing & QA

Run the complete test suite (backend pytest + frontend type check & production build):
```powershell
.\scripts\run-tests.ps1
```

### Pytest Backend Test Matrix (15 Automated Tests):
- `test_health_check`: Validates system status and engine configuration.
- `test_auth_login_applicant`: Verifies applicant login and token issue.
- `test_auth_login_recruiter`: Verifies recruiter authentication.
- `test_auth_login_admin`: Verifies administrative authentication.
- `test_auth_invalid_credentials`: Verifies password validation rejection.
- `test_job_search_and_filters`: Tests faceted query, location, and category filtering.
- `test_ai_match_score`: Validates deterministic skill matching arithmetic.
- `test_prevent_duplicate_application`: Enforces business logic preventing duplicate job submissions.
- `test_applicant_cannot_access_admin_endpoints`: Validates RBAC boundary for applicants.
- `test_recruiter_cannot_access_admin_endpoints`: Validates RBAC boundary for recruiters.
- `test_unauthenticated_cannot_access_protected`: Enforces Bearer token presence on secure routes.
- `test_admin_metrics_and_user_moderation`: Tests administrator dashboard aggregation.
- `test_get_job_categories`: Tests category aggregation endpoint.
- `test_applicant_profile_retrieval`: Validates applicant profile data contract.
- `test_public_feedback_submission`: Validates public user feedback ingestion.

For complete testing details, refer to [docs/TESTING.md](docs/TESTING.md).

---

## 18. Security & Privacy Governance

HireNest adheres to strict security best practices:
- **Zero Plaintext Passwords**: PBKDF2-HMAC-SHA256 with 100,000 rounds and random salt.
- **Signed Tokens**: HS256 JWT tokens with expiration verification.
- **Upload Hardening**: Sanitized filenames, UUID namespace protection, strict MIME extensions (`.pdf`, `.docx`), and 10MB file boundaries.
- **Git Hygiene**: Local database files (`*.db`), `.env` files, and user resume files are strictly excluded from source control via `.gitignore`.
- **RBAC Enforcement**: All privileged actions are verified using FastAPI route dependencies.

For complete security controls, refer to [docs/SECURITY.md](docs/SECURITY.md).

---

## 19. Future Enhancements

- [ ] **Real-Time WebSockets**: Instant recruiter-applicant chat and notification toasts.
- [ ] **Calendar Integration**: Synchronize scheduled interviews with Google Calendar and Outlook via iCal / OAuth2.
- [ ] **Multi-Tenant Organizations**: Support recruitment agencies managing hiring pipelines for multiple client companies.
- [ ] **Automated Video Assessments**: Async candidate video screen submission and transcribing.

---

## 20. Contribution Guidelines

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for details on code standards, branch conventions, and pull request submissions.

---

## 21. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 22. Author Information

**Sneh Kheni**  
*Senior Full-Stack Software Engineer*  
- GitHub: [@snehkheni](https://github.com/snehkheni)  
- Portfolio / Contact: Available upon request

---

*(Crafted with care for professional software engineering portfolios).*
=======
# hirenest-job-portal
A full-stack job portal built with React, TypeScript, FastAPI and SQLite, featuring applicant and recruiter dashboards, job management, application tracking, admin controls and AI-powered job matching.
>>>>>>> e4293cbd5b70119641c5d0b2f55ba3548dd768a6
