import os
from pathlib import Path
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "HireNest API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Database - SQLite by default for zero-setup Windows execution, PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./hirenest.db"
    
    # Auth & JWT
    SECRET_KEY: str = "hirenest-super-secret-production-quality-signing-key-2026-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # AI Engine
    AI_PROVIDER: str = "deterministic"  # "deterministic", "openai", "gemini"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx", "doc", "png", "jpg", "jpeg"]
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    model_config = {
        "env_file": [str(BACKEND_DIR / ".env"), ".env"],
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore"
    }

    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def resolve_sqlite_path(cls, v: str) -> str:
        # If relative SQLite URL, anchor to BACKEND_DIR so running from repo root or backend works identically
        if v.startswith("sqlite:///./"):
            db_rel_path = v[len("sqlite:///./"):]
            db_abs_path = (BACKEND_DIR / db_rel_path).resolve()
            return f"sqlite:///{db_abs_path.as_posix()}"
        return v

    @field_validator("UPLOAD_DIR", mode="after")
    @classmethod
    def resolve_upload_dir(cls, v: str) -> str:
        # If relative upload dir, anchor to BACKEND_DIR
        upload_path = Path(v)
        if not upload_path.is_absolute():
            return str((BACKEND_DIR / upload_path).resolve())
        return v

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
