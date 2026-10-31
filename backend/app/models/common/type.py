from typing import Annotated
from pydantic import AfterValidator, Field


def _check_password_bytes(password: str) -> str:
    # bcrypt rejects passwords longer than 72 bytes (non-ASCII chars take several bytes)
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password is too long")
    return password


Password = Annotated[
    str,
    Field(min_length=8, max_length=72, description="The password for the user account"),
    AfterValidator(_check_password_bytes),
]
