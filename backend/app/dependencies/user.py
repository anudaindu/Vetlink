from sqlmodel import Session, select

from app.models.entity.user import Users


def find_user_by_email(email: str, db: Session) -> Users | None:
    return db.exec(
        select(Users)
        .where(Users.email == email.lower())
    ).first()
