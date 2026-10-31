from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.auth.jwt import decode_access_token
from app.dependencies.type import DBSession
from app.exceptions.exceptions import UnauthorizedException
from app.models.entity.user import Users

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)


def get_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    db: DBSession,
) -> Users:
    if token is None:
        raise UnauthorizedException("Not authenticated")

    user_id = decode_access_token(token)
    if user_id is None:
        raise UnauthorizedException("Invalid or expired token")

    user = db.get(Users, user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("Invalid or expired token")
    return user


CurrentUser = Annotated[Users, Depends(get_current_user)]
