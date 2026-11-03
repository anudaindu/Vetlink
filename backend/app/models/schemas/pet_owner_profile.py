from pydantic import BaseModel, ConfigDict, Field
from typing import Annotated

from app.models.common.type import SLPhoneNumber

OwnerName = Annotated[str,Field(min_length=1,max_length=50)]

class PetOwnerProfileCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: OwnerName
    phone_number: SLPhoneNumber

class PetOwnerProfileResponseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    phone_number: str

class PetOwnerProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: OwnerName | None = None
    phone_number: SLPhoneNumber | None = None
