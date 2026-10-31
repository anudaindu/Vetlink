import os

# Must be set before app.config is imported
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-that-is-long-enough-for-hs256")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, Session, create_engine

import main
from app.auth.password import hash_password
from app.database.connection import get_session
from app.models.common.enum import UserRole
from app.models.entity.user import Users

DEFAULT_PASSWORD = "password123"


@pytest.fixture
def engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    engine.dispose()


@pytest.fixture
def session(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture
def client(engine):
    def override_get_session():
        with Session(engine) as session:
            yield session

    main.app.dependency_overrides[get_session] = override_get_session
    # Not used as a context manager, so the lifespan (which connects to Postgres) never runs
    yield TestClient(main.app)
    main.app.dependency_overrides.clear()


@pytest.fixture
def create_user(session):
    def _create_user(
        email: str = "client@example.com",
        password: str | None = DEFAULT_PASSWORD,
        role: UserRole = UserRole.CLIENT,
        is_active: bool = True,
    ) -> Users:
        user = Users(
            email=email,
            password_hash=hash_password(password) if password else None,
            user_role=role,
            is_active=is_active,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    return _create_user


@pytest.fixture
def auth_headers(client):
    def _auth_headers(email: str = "client@example.com", password: str = DEFAULT_PASSWORD) -> dict:
        response = client.post("/auth/login", json={"email": email, "password": password})
        assert response.status_code == 200, response.json()
        return {"Authorization": f"Bearer {response.json()['access_token']}"}

    return _auth_headers
