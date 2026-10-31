from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from app.dependencies.user import find_user_by_email
from app.exceptions.exceptions import AlreadyExistsException
from app.models.entity.user import Users
from app.models.schemas.user import UserCreate, UserResponseDTO, UserUpdate
from app.auth.password import hash_password

class UserService:

    @staticmethod
    def _commit(user: Users, db: Session) -> None:
        db.add(user)
        try:
            db.commit()
        except IntegrityError:
            # Unique email constraint hit by a concurrent request
            db.rollback()
            raise AlreadyExistsException("User with this email already exists")
        db.refresh(user)

    @staticmethod
    def register_user(user_create: UserCreate, db: Session) -> UserResponseDTO:
        if find_user_by_email(user_create.email, db):
            raise AlreadyExistsException("User with this email already exists")

        new_user = Users(
            **user_create.model_dump(exclude={"password"}),
            password_hash=hash_password(user_create.password),
        )
        UserService._commit(new_user, db)
        return UserResponseDTO.model_validate(new_user)

    @staticmethod
    def update_user(target_user: Users, user_update: UserUpdate, db: Session) -> UserResponseDTO:
        changes = user_update.model_dump(exclude_unset=True, exclude_none=True)

        if "email" in changes and changes["email"] != target_user.email:
            if find_user_by_email(changes["email"], db):
                raise AlreadyExistsException("User with this email already exists")

        target_user.sqlmodel_update(changes)
        UserService._commit(target_user, db)
        return UserResponseDTO.model_validate(target_user)
