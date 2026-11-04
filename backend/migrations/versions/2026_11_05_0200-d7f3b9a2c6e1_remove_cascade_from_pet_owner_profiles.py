"""remove cascade from pet_owner_profiles

Revision ID: d7f3b9a2c6e1
Revises: c5a1e7d3f2b4
Create Date: 2026-11-05 02:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'd7f3b9a2c6e1'
down_revision: Union[str, Sequence[str], None] = 'c5a1e7d3f2b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

FK_NAME = 'pet_owner_profiles_user_id_fkey'


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint(FK_NAME, 'pet_owner_profiles', type_='foreignkey')
    op.create_foreign_key(FK_NAME, 'pet_owner_profiles', 'users', ['user_id'], ['user_id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(FK_NAME, 'pet_owner_profiles', type_='foreignkey')
    op.create_foreign_key(FK_NAME, 'pet_owner_profiles', 'users', ['user_id'], ['user_id'], ondelete='CASCADE')
