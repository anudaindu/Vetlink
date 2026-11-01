from typing import TypeVar

from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, SQLModel

from app.exceptions.exceptions import AlreadyExistsException

T = TypeVar("T", bound=SQLModel)


class DBUtils:

    @staticmethod
    def commit(db: Session, conflict_message: str = "Resource already exists") -> None:
        try:
            db.commit()
        except IntegrityError:
            # Unique/FK constraint hit (e.g. by a concurrent request)
            db.rollback()
            raise AlreadyExistsException(conflict_message)

    @staticmethod
    def commit_and_refresh(entity: T, db: Session, conflict_message: str = "Resource already exists") -> T:
        db.add(entity)
        DBUtils.commit(db, conflict_message)
        db.refresh(entity)
        return entity
