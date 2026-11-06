import sys
import os
import pytest
from httpx import ASGITransport, AsyncClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

@pytest.mark.anyio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert data["service"] == "HireNest API"

@pytest.mark.anyio
async def test_auth_login_applicant():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/auth/login", json={
            "email": "alex.dev@gmail.com",
            "password": "Applicant@123"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["role"] == "applicant"
        assert data["user"]["email"] == "alex.dev@gmail.com"

@pytest.mark.anyio
async def test_auth_login_recruiter():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/auth/login", json={
            "email": "sarah.recruiter@techpulse.io",
            "password": "Recruiter@123"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["role"] == "recruiter"

@pytest.mark.anyio
async def test_auth_login_admin():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/auth/login", json={
            "email": "admin@hirenest.com",
            "password": "Admin@123"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["role"] == "admin"

@pytest.mark.anyio
async def test_auth_invalid_credentials():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/auth/login", json={
            "email": "admin@hirenest.com",
            "password": "WrongPassword999!"
        })
        assert res.status_code == 401

@pytest.mark.anyio
async def test_job_search_and_filters():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Search all published
        res = await client.get("/api/jobs")
        assert res.status_code == 200
        data = res.json()
        assert data["total"] >= 5
        assert len(data["items"]) > 0

        # Query filter
        res_filter = await client.get("/api/jobs?q=Frontend")
        assert res_filter.status_code == 200
        filter_data = res_filter.json()
        assert any("Frontend" in item["title"] for item in filter_data["items"])

        # Category filter
        res_cat = await client.get("/api/jobs?category=Design")
        assert res_cat.status_code == 200
        assert all(item["category"] == "Design" for item in res_cat.json()["items"])

@pytest.mark.anyio
async def test_ai_match_score():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Login as applicant
        login_res = await client.post("/api/auth/login", json={
            "email": "alex.dev@gmail.com",
            "password": "Applicant@123"
        })
        token = login_res.json()["access_token"]

        # Call AI match score
        res = await client.post(
            "/api/ai/match-score",
            headers={"Authorization": f"Bearer {token}"},
            json={"job_id": 1}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["job_id"] == 1
        assert 0 <= data["match_score"] <= 100
        assert len(data["matching_skills"]) > 0
        assert "explanation" in data

@pytest.mark.anyio
async def test_prevent_duplicate_application():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_res = await client.post("/api/auth/login", json={
            "email": "alex.dev@gmail.com",
            "password": "Applicant@123"
        })
        token = login_res.json()["access_token"]

        # Alex has already applied to Job 1 in seed data
        res = await client.post(
            "/api/applications",
            headers={"Authorization": f"Bearer {token}"},
            json={"job_id": 1, "cover_letter": "Duplicate attempt"}
        )
        assert res.status_code == 400
        assert "already submitted an application" in res.json()["detail"]

@pytest.mark.anyio
async def test_applicant_cannot_access_admin_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_res = await client.post("/api/auth/login", json={
            "email": "alex.dev@gmail.com",
            "password": "Applicant@123"
        })
        token = login_res.json()["access_token"]

        res = await client.get(
            "/api/admin/metrics",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 403

@pytest.mark.anyio
async def test_admin_metrics_and_user_moderation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_res = await client.post("/api/auth/login", json={
            "email": "admin@hirenest.com",
            "password": "Admin@123"
        })
        token = login_res.json()["access_token"]

        res = await client.get(
            "/api/admin/metrics",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["total_users"] >= 7
        assert data["active_jobs"] >= 5

@pytest.mark.anyio
async def test_recruiter_cannot_access_admin_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_res = await client.post("/api/auth/login", json={
            "email": "sarah.recruiter@techpulse.io",
            "password": "Recruiter@123"
        })
        token = login_res.json()["access_token"]

        res = await client.get(
            "/api/admin/metrics",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 403

@pytest.mark.anyio
async def test_unauthenticated_cannot_access_protected():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/applicant/profile")
        assert res.status_code == 401

@pytest.mark.anyio
async def test_get_job_categories():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/jobs/categories")
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "category" in data[0]

@pytest.mark.anyio
async def test_applicant_profile_retrieval():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_res = await client.post("/api/auth/login", json={
            "email": "alex.dev@gmail.com",
            "password": "Applicant@123"
        })
        token = login_res.json()["access_token"]

        res = await client.get(
            "/api/applicant/profile",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["user_id"] is not None
        assert "skills" in data

@pytest.mark.anyio
async def test_public_feedback_submission():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/feedback", json={
            "category": "platform",
            "message": "Automated QA feedback validation message.",
            "rating": 5
        })
        assert res.status_code == 201
        data = res.json()
        assert data["category"] == "platform"
        assert data["rating"] == 5

