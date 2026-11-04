from sqlmodel import Session, select

from app.models.entity.vet_profile import VetProfile
from app.models.entity.pet_owner_profile import PetOwnerProfile
from app.models.entity.user import Users

from app.models.schemas.pet_owner_profile import PetOwnerProfileAdminResponseDTO
from app.models.schemas.vet_profile import VetProfileResponseDTO,VetProfileCreate,VetProfileUpdate

from app.utils.database_utils import DBUtils
from app.exceptions.exceptions import NotFoundException,AlreadyExistsException

def _license_number_taken(license_number: str, db: Session) -> bool:
    return db.exec(
        select(VetProfile)
        .where(VetProfile.license_number == license_number)
    ).first() is not None

class VetProfileService:
    
    @staticmethod
    def get_pet_owner_profile_by_user_id(user_id: int, db: Session) -> PetOwnerProfileAdminResponseDTO:
        profile = db.get(PetOwnerProfile, user_id)
        if profile is None:
            raise NotFoundException("Pet owner profile not found")
        return PetOwnerProfileAdminResponseDTO.model_validate(profile)
    
    @staticmethod
    def get_own_vet_profile(current_user: Users,db: Session) -> VetProfileResponseDTO:
        profile = db.get(VetProfile,current_user.user_id)
        if profile is None:
            raise NotFoundException("Vet owner Profile Not Found")
        return VetProfileResponseDTO.model_validate(profile)
    
    @staticmethod
    def create_vet_profile(current_user:Users ,db: Session, data : VetProfileCreate) -> VetProfileResponseDTO:
        if db.get(VetProfile,current_user.user_id):
            raise AlreadyExistsException("Vet Owner Profile Already exists for this user")
        if _license_number_taken(data.license_number, db):
            raise AlreadyExistsException(f"Vet Owner Profile Already exists Under ({data.license_number}) License Number")
        new_profile = VetProfile(user_id=current_user.user_id,**data.model_dump())
        DBUtils.commit_and_refresh(new_profile,db)
        return VetProfileResponseDTO.model_validate(new_profile)
    
    @staticmethod
    def update_own_profile(current_user:Users,db : Session,data :VetProfileUpdate) -> VetProfileResponseDTO:
        target_profile = db.get(VetProfile,current_user.user_id)
        if target_profile is None:
            raise NotFoundException("Vet owner Profile Not Found")
        changes = data.model_dump(exclude_unset=True,exclude_none=True)
        target_profile.sqlmodel_update(changes)
        DBUtils.commit_and_refresh(target_profile,db)
        return VetProfileResponseDTO.model_validate(target_profile)
        