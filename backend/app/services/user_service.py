from sqlmodel import Session

from app.dependencies.user import find_user_by_email
from app.exceptions.exceptions import AlreadyExistsException
from app.models.entity.user import Users
from app.models.schemas.user import UserCreate, UserResponseDTO, UserUpdate
from app.auth.password import hash_password
from app.utils.database_utils import DBUtils


class UserService:


    @staticmethod
    def register_user(user_create: UserCreate, db: Session) -> UserResponseDTO:
        if find_user_by_email(user_create.email, db):
            raise AlreadyExistsException("User with this email already exists")

        new_user = Users(
            **user_create.model_dump(exclude={"password"}),
            password_hash=hash_password(user_create.password),
        )
        DBUtils.commit(new_user, db)
        return UserResponseDTO.model_validate(new_user)

    @staticmethod
    def update_user(target_user: Users, user_update: UserUpdate, db: Session) -> UserResponseDTO:
        changes = user_update.model_dump(exclude_unset=True, exclude_none=True)

        if "email" in changes and changes["email"] != target_user.email:
            if find_user_by_email(changes["email"], db):
                raise AlreadyExistsException("User with this email already exists")

        target_user.sqlmodel_update(changes)
        DBUtils.commit(target_user, db)
        return UserResponseDTO.model_validate(target_user)
