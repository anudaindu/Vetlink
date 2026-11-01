from enum import Enum

class UserRole(str, Enum):
    VET = "vet"
    PET_OWNER = "pet_owner"