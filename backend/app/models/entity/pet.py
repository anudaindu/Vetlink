from sqlmodel import SQLModel,Field
from sqlalchemy import Enum as SAEnum,Column

from datetime import date

from app.models.common.enum import PetSpecies,Breed,Gender

class Pet(SQLModel,table=True):
    __tablename__="pets"
    pet_id: int | None = Field(default=None,primary_key=True)
    
    name: str = Field(nullable=False,max_length=50)
    
    gender: Gender = Field(
            sa_column=Column(
                SAEnum(Gender,name="pet_gender_enum",native_enum=False),
                nullable=False
            )
        )
    
    dob : date = Field(nullable=False)
        
    dob_is_estimated: bool = Field(default=False,nullable=False)
    
    species: PetSpecies = Field(
        sa_column=Column(
            SAEnum(PetSpecies,name="pet_specie_enum",native_enum=False),
            nullable=False
        )
    )
    
    breed: Breed = Field(
        sa_column=Column(
            SAEnum(Breed,name="pet_breed_enum",native_enum=False),
            nullable=False
        )
    )
    
    owner_id: int = Field(foreign_key="pet_owner_profiles.user_id",nullable=False,index=True)