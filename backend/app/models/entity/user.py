from datetime import datetime

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func,Enum as SAEnum

from app.models.common.enum import UserRole


class Users(SQLModel, table=True):
    __tablename__ = "users"

    user_id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    password_hash: str | None = Field(default=None, nullable=True)
    user_role: UserRole = Field(
        sa_column=Column(
            SAEnum(UserRole, name="user_role_enum", native_enum=False), 
            nullable=False
        )
    )
    is_active: bool = Field(default=True, nullable=False)
    created_at: datetime | None = Field(
        default=None,
        sa_column=Column(
            DateTime(timezone=True), 
            server_default=func.now(),
            nullable=False
        )
    )
