from sqlmodel import SQLModel, Field


class VetProfile(SQLModel, table=True):
    __tablename__ = "vet_profiles"
    
    user_id: int = Field(primary_key=True, foreign_key="users.user_id")
    name: str = Field(nullable=False, max_length=50)
    license_number : str = Field(nullable=False,min_length=5,max_length=20)
    specialization : str =Field(nullable=True,min_length=1,max_length=100)
    phone_number: str = Field(unique=True, nullable=False, max_length=10)
    is_verified : bool = Field(nullable=False,default=False)
    rating: float = Field(nullable=True,le=5,ge=0)