"""rename client role to pet_owner

Revision ID: 7c1d2e4f9a10
Revises: 3e6b4ebbe8ca
Create Date: 2026-11-01 02:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c1d2e4f9a10'
down_revision: Union[str, Sequence[str], None] = '3e6b4ebbe8ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

OLD_ROLE_ENUM = sa.Enum('VET', 'CLIENT', name='user_role_enum', native_enum=False)
NEW_ROLE_ENUM = sa.Enum('VET', 'PET_OWNER', name='user_role_enum', native_enum=False)


def upgrade() -> None:
    """Upgrade schema."""
    # Widen the column first: the old enum was sized for 'CLIENT' (6 chars)
    op.alter_column('users', 'user_role', existing_type=OLD_ROLE_ENUM, type_=NEW_ROLE_ENUM, existing_nullable=False)
    op.execute("UPDATE users SET user_role = 'PET_OWNER' WHERE user_role = 'CLIENT'")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("UPDATE users SET user_role = 'CLIENT' WHERE user_role = 'PET_OWNER'")
    op.alter_column('users', 'user_role', existing_type=NEW_ROLE_ENUM, type_=OLD_ROLE_ENUM, existing_nullable=False)
