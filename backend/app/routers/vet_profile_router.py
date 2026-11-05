from fastapi import APIRouter

from app.services.vet_profile_service import VetProfileService

from app.models.schemas.vet_profile import VetProfileCreate,VetProfileUpdate

from app.dependencies.auth import CurrentUserVet
from app.dependencies.type import DBSession

router = APIRouter(prefix="/vet-profile", tags=["Vet Profile"])

@router.get('/', status_code=200)
def get_own_vet_profile(current_user: CurrentUserVet, db: DBSession):
    return VetProfileService.get_own_vet_profile(current_user, db)


@router.get('/pet-owner/{user_id}', status_code=200)
def get_pet_owner_profile_by_user_id(current_user:CurrentUserVet,user_id: int, db: DBSession):
    return VetProfileService.get_pet_owner_profile_by_user_id(user_id, db)


@router.post('/', status_code=201)
def create_vet_profile(current_user: CurrentUserVet, db: DBSession,data : VetProfileCreate):
    return VetProfileService.create_vet_profile(current_user, db, data)

@router.patch('/', status_code=200)
def update_own_vet_profile(current_user: CurrentUserVet, db: DBSession,data : VetProfileUpdate):
    return VetProfileService.update_own_profile(current_user, db, data)