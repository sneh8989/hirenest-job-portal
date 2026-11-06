from typing import Optional
from sqlalchemy.orm import Session
from app.models.models import AuditLog

def log_audit_event(
    db: Session,
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    user_id: Optional[int] = None,
    user_email: Optional[str] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None
) -> AuditLog:
    """Safely records administrative and critical user lifecycle events into the database."""
    log_entry = AuditLog(
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        user_id=user_id,
        user_email=user_email,
        details=details,
        ip_address=ip_address
    )
    db.add(log_entry)
    db.commit()
    return log_entry
