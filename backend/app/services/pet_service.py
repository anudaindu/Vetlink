from sqlmodel import Session, select

from app.models.common.enum import UserRole
from app.models.entity.user import Users
from app.models.entity.pet import Pet
from app.models.entity.pet_owner_profile import PetOwnerProfile

from app.models.schemas.pet import PetCreate, PetResponseDTO, PetUpdate

from app.exceptions.exceptions import NotFoundException, AlreadyExistsException
from app.utils.database_utils import DBUtils


def _is_already_added_pet(name, species, owner_id, db: Session, exclude_id=None) -> bool:
    query = select(Pet).where(
        (Pet.name == name) & (Pet.species == species) & (Pet.owner_id == owner_id)
    )
    if exclude_id is not None:
        query = query.where(Pet.pet_id != exclude_id)
    return db.exec(query).first() is not None


def _duplicate_msg(name, species) -> str:
    return f"You already have a {species.value} named {name}"


class PetService:

    @staticmethod
    def get_pet_by_id(current_user: Users, db: Session, pet_id: int) -> PetResponseDTO:
        pet = db.get(Pet, pet_id)
        if pet is None or (pet.owner_id != current_user.user_id and current_user.user_role != UserRole.VET):
            raise NotFoundException(f"Pet profile with id {pet_id} not found")
        return PetResponseDTO.model_validate(pet)

    @staticmethod
    def create_new_pet_profile(current_user: Users, db: Session, data: PetCreate) -> PetResponseDTO:
        if db.get(PetOwnerProfile,current_user.user_id) is None:
            raise NotFoundException("Pet owner profile not found. Create a pet owner profile first.")
        msg = _duplicate_msg(data.name, data.species)
        if _is_already_added_pet(data.name, data.species, current_user.user_id, db):
            raise AlreadyExistsException(msg)
        pet = Pet(owner_id=current_user.user_id, **data.model_dump())
        DBUtils.commit_and_refresh(pet, db, msg)
        return PetResponseDTO.model_validate(pet)

    @staticmethod
    def update_pet_profile(current_user: Users, db: Session, pet_id: int, data: PetUpdate) -> PetResponseDTO:
        pet = db.get(Pet, pet_id)
        if pet is None or pet.owner_id != current_user.user_id:
            raise NotFoundException(f"Pet profile with id {pet_id} not found")

        changes = data.model_dump(exclude_none=True, exclude_unset=True)
        name = changes.get("name", pet.name)
        species = changes.get("species", pet.species)
        msg = _duplicate_msg(name, species)

        if ("name" in changes or "species" in changes) and _is_already_added_pet(name, species, current_user.user_id, db, exclude_id=pet_id):
            raise AlreadyExistsException(msg)

        pet.sqlmodel_update(changes)
        DBUtils.commit_and_refresh(pet, db, msg)
        return PetResponseDTO.model_validate(pet)