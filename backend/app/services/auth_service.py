from sqlmodel import Session

from app.auth.jwt import create_access_token
from app.auth.password import hash_password, verify_password
from app.dependencies.user import find_user_by_email
from app.exceptions.exceptions import UnauthorizedException
from app.models.schemas.auth import TokenResponse

# Checked when the email is unknown so failed logins take the same time either way
_DUMMY_HASH = hash_password("dummy-password")


class AuthService:

    @staticmethod
    def login(email: str, password: str, db: Session) -> TokenResponse:
        user = find_user_by_email(email, db)

        password_ok = verify_password(
            password,
            user.password_hash if user and user.password_hash else _DUMMY_HASH,
        )
        if not user or not user.password_hash or not password_ok or not user.is_active:
            raise UnauthorizedException("Invalid email or password")

        return TokenResponse(access_token=create_access_token(user.user_id))
