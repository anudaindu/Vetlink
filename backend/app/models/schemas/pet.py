from pydantic import BaseModel,ConfigDict,Field
from typing import Annotated

from app.models.common.enum import Breed,PetSpecies,Gender
from datetime import date

class PetCreate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: Annotated[str, Field(min_length=1, max_length=50, description="Pet's name")]
    species: Annotated[PetSpecies, Field(description="Dog or cat")]
    breed: Annotated[Breed, Field(description="Must match the species; use 'other' if unsure")]
    dob: Annotated[date, Field(description="Date of birth")]
    dob_is_estimated: Annotated[bool, Field(default=False,description="True if the date of birth is an estimate")]
    gender: Annotated[Gender, Field(description="Pet's gender")]
    
class PetResponseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    pet_id: int
    name: str
    gender: Gender
    dob: date
    dob_is_estimated: bool
    species: PetSpecies
    breed: Breed
    owner_id: int
    
class PetUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: Annotated[str | None, Field(min_length=1, max_length=50, description="Pet's name")] = None
    species: Annotated[PetSpecies | None, Field(description="Dog or cat")] = None
    breed: Annotated[Breed | None, Field(description="Must match the species; use 'other' if unsure")] = None
    dob: Annotated[date | None, Field(description="Date of birth")] = None
    dob_is_estimated: Annotated[bool | None, Field(description="True if the date of birth is an estimate")] = None
    gender: Annotated[Gender | None, Field(description="Pet's gender")] = None