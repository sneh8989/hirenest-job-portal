import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import (
    auth,
    jobs,
    applications,
    applicants,
    recruiters,
    companies,
    interviews,
    notifications,
    ai,
    admin,
    feedback
)

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="HireNest Commercial SaaS Job Portal API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during development for seamless Vite dev server connectivity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads folder exists and mount static files
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(applicants.router)
app.include_router(recruiters.router)
app.include_router(companies.router)
app.include_router(interviews.router)
app.include_router(notifications.router)
app.include_router(ai.router)
app.include_router(admin.router)
app.include_router(feedback.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "HireNest API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "ai_engine": settings.AI_PROVIDER
    }

@app.get("/api", tags=["General"])
def root():
    return {
        "name": "HireNest API",
        "tagline": "Your next opportunity starts here.",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )
