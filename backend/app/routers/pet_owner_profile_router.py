from fastapi import APIRouter, status

from app.dependencies.auth import CurrentUserPetOwner
from app.dependencies.type import DBSession
from app.models.schemas.pet_owner_profile import (
    PetOwnerProfileCreate,
    PetOwnerProfileResponseDTO,
    PetOwnerProfileUpdate,
)
from app.services.pet_owner_profile_service import PetOwnerProfileService


router = APIRouter(prefix="/pet-owner-profile", tags=["Pet Owner Profile"])

@router.post('/me', status_code=status.HTTP_201_CREATED)
def create_pet_owner_profile(current_user: CurrentUserPetOwner, data: PetOwnerProfileCreate, db: DBSession) -> PetOwnerProfileResponseDTO:
    return PetOwnerProfileService.create_pet_owner_profile(current_user, data, db)

@router.get('/me', status_code=status.HTTP_200_OK)
def get_pet_owner_profile(current_user: CurrentUserPetOwner, db: DBSession) -> PetOwnerProfileResponseDTO:
    return PetOwnerProfileService.get_own_pet_owner_profile(current_user, db)

@router.patch('/me', status_code=status.HTTP_200_OK)
def update_pet_owner_profile(current_user: CurrentUserPetOwner, data: PetOwnerProfileUpdate, db: DBSession) -> PetOwnerProfileResponseDTO:
    return PetOwnerProfileService.update_pet_owner_profile(current_user, data, db)
