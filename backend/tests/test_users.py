import pytest
from sqlmodel import select

from app.auth.password import verify_password
from app.models.common.enum import UserRole
from app.models.entity.user import Users


def register(client, **overrides):
    body = {"user_role": "client", "email": "new@example.com", "password": "password123"}
    body.update(overrides)
    return client.post("/register", json=body)


def get_db_user(session, email: str) -> Users | None:
    session.expire_all()
    return session.exec(select(Users).where(Users.email == email)).first()


# ---------- POST /register ----------

def test_register_success(client, session):
    response = register(client)

    assert response.status_code == 201
    assert response.json() == {"email": "new@example.com", "user_role": "client"}

    user = get_db_user(session, "new@example.com")
    assert user is not None
    assert user.is_active
    assert user.created_at is not None


def test_register_vet(client):
    response = register(client, user_role="vet")
    assert response.status_code == 201
    assert response.json()["user_role"] == "vet"


def test_register_stores_hashed_password(client, session):
    register(client)
    user = get_db_user(session, "new@example.com")

    assert user.password_hash != "password123"
    assert verify_password("password123", user.password_hash)


def test_register_response_does_not_leak_password(client):
    body = register(client).json()
    assert "password" not in body
    assert "password_hash" not in body


def test_register_lowercases_email(client, session):
    response = register(client, email="New.User@Example.COM")

    assert response.json()["email"] == "new.user@example.com"
    assert get_db_user(session, "new.user@example.com") is not None


def test_register_duplicate_email(client, create_user):
    create_user(email="new@example.com")
    response = register(client)

    assert response.status_code == 409
    assert response.json() == {"success": False, "detail": "User with this email already exists"}


def test_register_duplicate_email_different_case(client, create_user):
    create_user(email="new@example.com")
    assert register(client, email="NEW@example.com").status_code == 409


def test_register_race_condition_returns_409(client, create_user, monkeypatch):
    # Simulate two requests passing the "already exists" check at the same time:
    # the database unique constraint must still turn it into a 409, not a 500.
    create_user(email="new@example.com")
    monkeypatch.setattr("app.services.user_service.find_user_by_email", lambda email, db: None)

    assert register(client).status_code == 409


@pytest.mark.parametrize("password", [
    "x" * 8,     # minimum
    "x" * 72,    # maximum
    "MyLongPassword123!",
])
def test_register_valid_password_lengths(client, password):
    assert register(client, password=password).status_code == 201


@pytest.mark.parametrize("password, reason", [
    ("short", "too short"),
    ("x" * 73, "too many characters"),
    ("é" * 40, "over bcrypt's 72-byte limit"),
])
def test_register_invalid_password(client, password, reason):
    response = register(client, password=password)
    assert response.status_code == 422, reason
    assert response.json()["detail"][0]["loc"] == ["body", "password"]


@pytest.mark.parametrize("overrides, field", [
    ({"email": "not-an-email"}, "email"),
    ({"user_role": "admin"}, "user_role"),
    ({"user_role": "CLIENT"}, "user_role"),
    ({"username": "bob"}, "username"),
])
def test_register_invalid_fields(client, overrides, field):
    response = register(client, **overrides)
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == field


@pytest.mark.parametrize("missing", ["email", "password", "user_role"])
def test_register_missing_field(client, missing):
    body = {"user_role": "client", "email": "new@example.com", "password": "password123"}
    del body[missing]
    assert client.post("/register", json=body).status_code == 422


def test_register_invalid_json(client):
    response = client.post(
        "/register",
        content='{"user_role": "client", "email": "new@example.com", "password": "12345678\n"}',
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 422


# ---------- GET /me ----------

def test_me_returns_current_user(client, create_user, auth_headers):
    create_user(email="vet@example.com", role=UserRole.VET)
    response = client.get("/me", headers=auth_headers(email="vet@example.com"))

    assert response.status_code == 200
    assert response.json() == {"email": "vet@example.com", "user_role": "vet"}


def test_me_returns_the_token_owner_not_another_user(client, create_user, auth_headers):
    create_user(email="first@example.com")
    create_user(email="second@example.com")

    response = client.get("/me", headers=auth_headers(email="second@example.com"))
    assert response.json()["email"] == "second@example.com"


# ---------- PATCH /update ----------

def test_update_requires_auth(client):
    assert client.patch("/update", json={"email": "changed@example.com"}).status_code == 401


def test_update_own_email(client, create_user, auth_headers, session):
    create_user()
    response = client.patch("/update", headers=auth_headers(), json={"email": "Changed@Example.com"})

    assert response.status_code == 200
    assert response.json()["email"] == "changed@example.com"
    assert get_db_user(session, "changed@example.com") is not None
    assert get_db_user(session, "client@example.com") is None


def test_update_only_changes_the_logged_in_user(client, create_user, auth_headers, session):
    create_user(email="client@example.com")
    create_user(email="other@example.com")

    client.patch("/update", headers=auth_headers(), json={"email": "changed@example.com"})

    assert get_db_user(session, "other@example.com") is not None


def test_token_still_valid_after_email_change(client, create_user, auth_headers):
    create_user()
    headers = auth_headers()
    client.patch("/update", headers=headers, json={"email": "changed@example.com"})

    response = client.get("/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "changed@example.com"


def test_login_with_new_email_after_update(client, create_user, auth_headers):
    create_user()
    client.patch("/update", headers=auth_headers(), json={"email": "changed@example.com"})

    assert client.post("/auth/login", json={"email": "changed@example.com", "password": "password123"}).status_code == 200
    assert client.post("/auth/login", json={"email": "client@example.com", "password": "password123"}).status_code == 401


def test_update_to_email_taken_by_another_user(client, create_user, auth_headers, session):
    create_user(email="client@example.com")
    create_user(email="taken@example.com")

    response = client.patch("/update", headers=auth_headers(), json={"email": "TAKEN@example.com"})

    assert response.status_code == 409
    assert get_db_user(session, "client@example.com") is not None


def test_update_to_same_email_is_allowed(client, create_user, auth_headers):
    create_user()
    response = client.patch("/update", headers=auth_headers(), json={"email": "client@example.com"})
    assert response.status_code == 200


@pytest.mark.parametrize("body", [{}, {"email": None}])
def test_update_with_no_changes(client, create_user, auth_headers, body):
    create_user()
    response = client.patch("/update", headers=auth_headers(), json=body)

    assert response.status_code == 200
    assert response.json()["email"] == "client@example.com"


@pytest.mark.parametrize("body", [
    {"email": "not-an-email"},
    {"user_role": "vet"},        # role cannot be changed through update
    {"is_active": False},
    {"password_hash": "x"},
])
def test_update_rejects_invalid_or_forbidden_fields(client, create_user, auth_headers, session, body):
    create_user()
    response = client.patch("/update", headers=auth_headers(), json=body)

    assert response.status_code == 422
    user = get_db_user(session, "client@example.com")
    assert user.user_role == UserRole.CLIENT
    assert user.is_active
