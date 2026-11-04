"""create vet_profiles table

Revision ID: c5a1e7d3f2b4
Revises: b84f0c2d5e61
Create Date: 2026-11-05 01:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'c5a1e7d3f2b4'
down_revision: Union[str, Sequence[str], None] = 'b84f0c2d5e61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('vet_profiles',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
    sa.Column('license_number', sqlmodel.sql.sqltypes.AutoString(length=20), nullable=False),
    sa.Column('specialization', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=True),
    sa.Column('phone_number', sqlmodel.sql.sqltypes.AutoString(length=10), nullable=False),
    sa.Column('is_verified', sa.Boolean(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('phone_number')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('vet_profiles')
