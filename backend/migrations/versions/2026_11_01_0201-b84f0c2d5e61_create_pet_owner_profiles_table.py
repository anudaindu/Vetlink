"""create pet_owner_profiles table

Revision ID: b84f0c2d5e61
Revises: 7c1d2e4f9a10
Create Date: 2026-11-01 02:01:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'b84f0c2d5e61'
down_revision: Union[str, Sequence[str], None] = '7c1d2e4f9a10'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('pet_owner_profiles',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
    sa.Column('phone_number', sqlmodel.sql.sqltypes.AutoString(length=10), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('phone_number')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('pet_owner_profiles')
