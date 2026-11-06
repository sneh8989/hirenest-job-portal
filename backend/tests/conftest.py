import pytest
from app.core.database import SessionLocal, engine, Base
from app.models.models import User
from app.data.seed_data import seed

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Ensure the database tables exist and are populated with test data before running tests."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            seed()
    finally:
        db.close()
    yield

