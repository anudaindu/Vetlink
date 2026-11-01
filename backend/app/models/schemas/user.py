from pydantic import BeforeValidator, BaseModel, EmailStr, Field, ConfigDict
from typing import Annotated

from app.models.common.type import Password
from app.models.common.enum import UserRole

Email = Annotated[EmailStr, BeforeValidator(str.lower), Field(description="The email address of the user account")]
Role = Annotated[UserRole, BeforeValidator(str.lower), Field(description="The role of the user account")]


class UserCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    user_role: Role
    email: Email
    password: Password

class UserResponseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email: Email
    user_role: Role
    
class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: Email | None = None
