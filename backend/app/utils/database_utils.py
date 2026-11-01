from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from app.exceptions.exceptions import AlreadyExistsException
from app.models.entity.user import Users

class DBUtils:
    
    @staticmethod
    def commit(user: Users, db: Session) -> None:
        db.add(user)
        try:
            db.commit()
        except IntegrityError:
            # Unique email constraint hit by a concurrent request
            db.rollback()
            raise AlreadyExistsException("User with this email already exists")
        db.refresh(user)