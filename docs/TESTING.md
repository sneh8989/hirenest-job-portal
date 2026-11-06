# HireNest — Testing & Quality Assurance Guide

## 1. Testing Philosophy & Architecture

HireNest enforces rigorous automated testing across both backend and frontend layers:
- **Backend**: Asynchronous integration and unit tests using `pytest` and `httpx.AsyncClient` against the FastAPI application.
- **Frontend**: Strict TypeScript compilation (`tsc -b`), linting (`oxlint`), and production build verification (`vite build`).

---

## 2. Automated Test Execution

### Running All Tests (One-Click)
From the repository root in PowerShell:
```powershell
.\scripts\run-tests.ps1
```

This runs:
1. Backend pytest suite (`backend/tests/test_api.py`)
2. Frontend production build (`tsc -b && vite build`)

---

## 3. Backend Pytest Suite

### Running Pytest Directly:
```powershell
# From repository root
.\backend\venv\Scripts\python.exe -m pytest backend/tests -v

# Or from backend directory
cd backend
.\venv\Scripts\python.exe -m pytest tests -v
```

### Automated Backend Test Matrix:

| Test Case | Method & Route | Tested Functionality | Expected Result |
|---|---|---|---|
| `test_health_check` | `GET /api/health` | API operational status and engine configuration | `200 OK`, `status == "healthy"` |
| `test_auth_login_applicant` | `POST /api/auth/login` | Applicant authentication and JWT issuance | `200 OK`, valid JWT token and applicant user object |
| `test_auth_login_recruiter` | `POST /api/auth/login` | Recruiter authentication | `200 OK`, valid JWT token and recruiter user object |
| `test_auth_login_admin` | `POST /api/auth/login` | Administrator authentication | `200 OK`, valid JWT token and admin user object |
| `test_auth_invalid_credentials` | `POST /api/auth/login` | Password verification rejection | `401 Unauthorized` |
| `test_job_search_and_filters` | `GET /api/jobs` | Faceted search, query filtering, and category filters | `200 OK`, total >= 5, correct filtering |
| `test_ai_match_score` | `POST /api/ai/match-score` | Deterministic skill matching calculation | `200 OK`, match score 0-100, matching skills list |
| `test_prevent_duplicate_application` | `POST /api/applications` | Business rule: applicant cannot submit duplicate application | `400 Bad Request`, duplicate error message |
| `test_applicant_cannot_access_admin_endpoints` | `GET /api/admin/metrics` | RBAC: Applicant blocked from admin dashboard | `403 Forbidden` |
| `test_admin_metrics_and_user_moderation` | `GET /api/admin/metrics` | Admin authorized metrics access | `200 OK`, aggregate metrics returned |
| `test_recruiter_cannot_access_admin_endpoints` | `GET /api/admin/metrics` | RBAC: Recruiter blocked from admin dashboard | `403 Forbidden` |
| `test_unauthenticated_cannot_access_protected` | `GET /api/applicant/profile` | Unauthorized request rejection | `401 Unauthorized` |
| `test_get_job_categories` | `GET /api/jobs/categories` | Vacancy counts grouped by category | `200 OK`, list of categories |
| `test_applicant_profile_retrieval` | `GET /api/applicant/profile` | Applicant profile and skills fetch | `200 OK`, user profile data |
| `test_public_feedback_submission` | `POST /api/feedback` | Public user platform feedback submission | `201 Created` |

### Self-Contained Test Fixtures (`conftest.py`):
Tests do not require a pre-existing manual database. A session-scoped autouse fixture (`setup_test_environment`) automatically initializes tables and loads synthetic seed fixtures if the test database is empty, ensuring that tests pass deterministically in CI environments.

---

## 4. Frontend Type Checking & Production Build

### Running Frontend Validation:
```powershell
cd frontend

# TypeScript typecheck & production bundle
npm run build

# Code linting
npm run lint
```

- **TypeScript Engine**: Validates React components, prop contracts, and data models with zero type errors.
- **Vite Production Bundler**: Treeshakes and minifies JavaScript/CSS output into `frontend/dist/`.

