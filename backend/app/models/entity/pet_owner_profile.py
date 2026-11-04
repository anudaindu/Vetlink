from sqlmodel import SQLModel, Field

class PetOwnerProfile(SQLModel, table=True):
    __tablename__ = "pet_owner_profiles"

    user_id: int = Field(primary_key=True, foreign_key="users.user_id")
    name: str = Field(nullable=False, max_length=50)
    phone_number: str = Field(unique=True, nullable=False, max_length=10)
