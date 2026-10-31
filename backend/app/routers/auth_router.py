from typing import Annotated
from fastapi import APIRouter,Depends,status
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies.type import DBSession
from app.models.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post('/login',status_code=status.HTTP_200_OK)
def login(login_request: LoginRequest, db: DBSession) -> TokenResponse:
    """JSON login for the frontend."""
    return AuthService.login(login_request.email, login_request.password, db)

@router.post('/token',status_code=status.HTTP_200_OK)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DBSession) -> TokenResponse:
    """OAuth2 password flow (form data). Used by the Swagger "Authorize" button; `username` is the email."""
    return AuthService.login(form_data.username, form_data.password, db)
