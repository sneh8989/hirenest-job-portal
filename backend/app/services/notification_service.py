from typing import Optional
from sqlalchemy.orm import Session
from app.models.models import Notification

def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    type: str = "system",
    link: Optional[str] = None
) -> Notification:
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        link=link,
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif
