from fastapi import APIRouter,status

from app.dependencies.auth import CurrentUser,CurrentUserPetOwner
from app.dependencies.type import DBSession

from app.models.schemas.pet import PetResponseDTO,PetCreate,PetUpdate

from app.services.pet_service import PetService

router = APIRouter(prefix="/pet",tags=["Pet Management"])

@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_pet_by_id(current_user:CurrentUser,db:DBSession,id:int) -> PetResponseDTO:
    return PetService.get_pet_by_id(current_user,db,id)

@router.post('/',status_code=status.HTTP_201_CREATED)
def create_new_pet_profile(current_user:CurrentUserPetOwner,db:DBSession,data:PetCreate) -> PetResponseDTO:
    return PetService.create_new_pet_profile(current_user,db,data)

@router.patch('/{id}',status_code=status.HTTP_200_OK)
def update_own_pet_profile(current_user:CurrentUserPetOwner,db:DBSession,id:int,data:PetUpdate)-> PetResponseDTO:
    return PetService.update_pet_profile(current_user,db,id,data)