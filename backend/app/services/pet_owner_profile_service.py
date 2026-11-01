from sqlmodel import Session, select

from app.models.entity.user import Users
from app.models.entity.pet_owner_profile import PetOwnerProfile
from app.models.schemas.pet_owner_profile import PetOwnerProfileResponseDTO, PetOwnerProfileCreate, PetOwnerProfileUpdate

from app.utils.database_utils import DBUtils
from app.exceptions.exceptions import AlreadyExistsException, NotFoundException


def _phone_number_taken(phone_number: str, db: Session) -> bool:
    return db.exec(
        select(PetOwnerProfile)
        .where(PetOwnerProfile.phone_number == phone_number)
    ).first() is not None


class PetOwnerProfileService:

    @staticmethod
    def create_pet_owner_profile(current_user: Users, data: PetOwnerProfileCreate, db: Session) -> PetOwnerProfileResponseDTO:
        if db.get(PetOwnerProfile, current_user.user_id):
            raise AlreadyExistsException("Pet owner profile already exists")
        if _phone_number_taken(data.phone_number, db):
            raise AlreadyExistsException("Phone number is already in use")

        new_profile = PetOwnerProfile(user_id=current_user.user_id, **data.model_dump())
        DBUtils.commit_and_refresh(new_profile, db, "Pet owner profile or phone number already exists")
        return PetOwnerProfileResponseDTO.model_validate(new_profile)

    @staticmethod
    def get_own_pet_owner_profile(current_user: Users, db: Session) -> PetOwnerProfileResponseDTO:
        profile = db.get(PetOwnerProfile, current_user.user_id)
        if profile is None:
            raise NotFoundException("Pet owner profile not found")
        return PetOwnerProfileResponseDTO.model_validate(profile)

    @staticmethod
    def update_pet_owner_profile(current_user: Users, data: PetOwnerProfileUpdate, db: Session) -> PetOwnerProfileResponseDTO:
        profile = db.get(PetOwnerProfile, current_user.user_id)
        if profile is None:
            raise NotFoundException("Pet owner profile not found")

        changes = data.model_dump(exclude_unset=True, exclude_none=True)
        if "phone_number" in changes and changes["phone_number"] != profile.phone_number:
            if _phone_number_taken(changes["phone_number"], db):
                raise AlreadyExistsException("Phone number is already in use")

        profile.sqlmodel_update(changes)
        DBUtils.commit_and_refresh(profile, db, "Phone number is already in use")
        return PetOwnerProfileResponseDTO.model_validate(profile)
