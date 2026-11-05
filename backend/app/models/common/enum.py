from enum import Enum

class UserRole(str, Enum):
    VET = "vet"
    PET_OWNER = "pet_owner"
    
class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    
class PetSpecies(str,Enum):
    DOG = "dog"
    CAT = "cat"
    
class Breed(str,Enum):
    LABRADOR_RETRIEVER = "labrador_retriever"
    GERMAN_SHEPHERD = "german_shepherd"
    GOLDEN_RETRIEVER = "golden_retriever"
    BEAGLE = "beagle"
    POODLE = "poodle"
    ROTTWEILER = "rottweiler"
    DACHSHUND = "dachshund"
    SHIH_TZU = "shih_tzu"
    POMERANIAN = "pomeranian"
    BULLDOG = "bulldog"
    MIXED_DOG = "mixed_dog" # waltation
    # Cats
    PERSIAN = "persian"
    SIAMESE = "siamese"
    MAINE_COON = "maine_coon"
    BRITISH_SHORTHAIR = "british_shorthair"
    BENGAL = "bengal"
    RAGDOLL = "ragdoll"
    MIXED_CAT = "mixed_cat"
    # Either
    OTHER = "other"