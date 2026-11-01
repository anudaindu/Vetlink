from pydantic import BaseModel, ConfigDict

from app.models.common.type import SLPhoneNumber, OwnerName

class PetOwnerProfileCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: OwnerName
    phone_number: SLPhoneNumber

class PetOwnerProfileResponseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    phone_number: str

class PetOwnerProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: OwnerName | None = None
    phone_number: SLPhoneNumber | None = None
