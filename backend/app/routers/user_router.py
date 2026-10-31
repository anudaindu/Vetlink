from fastapi import APIRouter,status

from app.dependencies.auth import CurrentUser
from app.dependencies.type import DBSession
from app.models.schemas.user import UserCreate,UserResponseDTO,UserUpdate
from app.services.user_service import UserService


router = APIRouter(tags=["users"])

@router.post('/register',status_code=status.HTTP_201_CREATED)
def register_user(user_create: UserCreate, db: DBSession) -> UserResponseDTO:
    return UserService.register_user(user_create, db)

@router.get('/me',status_code=status.HTTP_200_OK)
def get_me(current_user: CurrentUser) -> UserResponseDTO:
    return UserResponseDTO.model_validate(current_user)

@router.patch('/update',status_code=status.HTTP_200_OK)
def update_user(current_user: CurrentUser, user_update: UserUpdate, db: DBSession) -> UserResponseDTO:
    return UserService.update_user(current_user, user_update, db)
