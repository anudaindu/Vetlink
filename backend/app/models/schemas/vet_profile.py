from pydantic import BaseModel, ConfigDict,Field
from typing import Annotated

from app.models.common.type import SLPhoneNumber

VetName = Annotated[str,Field(min_length=1,max_length=50)]
LicenseNumber= Annotated[str,Field(min_length=5,max_length=20,description="Veterinarian's license number")]
Specialization= Annotated[str, Field(min_length=1,max_length=100,description="Veterinarian's specialization")]

class VetProfileCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: VetName
    license_number: LicenseNumber
    specialization: Specialization
    phone_number: SLPhoneNumber

class VetProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: VetName | None = None
    specialization: Specialization | None = None    
    phone_number: SLPhoneNumber | None = None
    
class VetProfileResponseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: VetName
    license_number : LicenseNumber
    specialization: Specialization
    phone_number: SLPhoneNumber
    is_verified: bool
    rating: float | None = None
    
class VetProfileClientResponseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: int
    name: VetName
    specialization: Specialization
    phone_number: SLPhoneNumber
    is_verified: bool
    rating: float | None = None
    