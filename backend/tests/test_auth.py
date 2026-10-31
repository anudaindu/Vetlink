from datetime import datetime, timedelta, timezone

import jwt
import pytest

from app.auth.jwt import create_access_token, decode_access_token
from app.auth.password import hash_password, verify_password
from app.config import Config


def make_token(payload: dict, key: str | None = None) -> str:
    return jwt.encode(payload, key or Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)


def future(minutes: int = 30) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes)


# ---------- password hashing ----------

def test_hash_password_does_not_store_plain_text():
    hashed = hash_password("password123")
    assert hashed != "password123"
    assert verify_password("password123", hashed)


def test_verify_password_rejects_wrong_password():
    assert not verify_password("wrong-password", hash_password("password123"))


def test_hash_password_uses_random_salt():
    assert hash_password("password123") != hash_password("password123")


# ---------- JWT helpers ----------

def test_token_round_trip_returns_user_id():
    assert decode_access_token(create_access_token(42)) == 42


def test_decode_rejects_expired_token():
    token = make_token({"sub": "1", "exp": datetime.now(timezone.utc) - timedelta(seconds=1)})
    assert decode_access_token(token) is None


def test_decode_rejects_token_signed_with_other_key():
    token = make_token({"sub": "1", "exp": future()}, key="another-secret-key-that-is-long-enough")
    assert decode_access_token(token) is None


@pytest.mark.parametrize("payload", [
    {"exp": "future"},                 # missing sub
    {"sub": "1"},                      # missing exp
    {"sub": "not-a-number", "exp": "future"},
])
def test_decode_rejects_malformed_claims(payload):
    if payload.get("exp") == "future":
        payload["exp"] = future()
    assert decode_access_token(make_token(payload)) is None


def test_decode_rejects_garbage():
    assert decode_access_token("not.a.jwt") is None


# ---------- POST /auth/login ----------

def test_login_success_returns_bearer_token(client, create_user):
    user = create_user()
    response = client.post("/auth/login", json={"email": "client@example.com", "password": "password123"})

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert decode_access_token(body["access_token"]) == user.user_id


def test_login_email_is_case_insensitive(client, create_user):
    create_user()
    response = client.post("/auth/login", json={"email": "Client@Example.COM", "password": "password123"})
    assert response.status_code == 200


def test_login_wrong_password(client, create_user):
    create_user()
    response = client.post("/auth/login", json={"email": "client@example.com", "password": "wrong-password"})

    assert response.status_code == 401
    assert response.json() == {"success": False, "detail": "Invalid email or password"}


def test_login_unknown_email_gives_same_error_as_wrong_password(client, create_user):
    create_user()
    unknown = client.post("/auth/login", json={"email": "nobody@example.com", "password": "password123"})
    wrong = client.post("/auth/login", json={"email": "client@example.com", "password": "wrong-password"})

    assert unknown.status_code == wrong.status_code == 401
    assert unknown.json() == wrong.json()


def test_login_inactive_user_rejected(client, create_user):
    create_user(is_active=False)
    response = client.post("/auth/login", json={"email": "client@example.com", "password": "password123"})
    assert response.status_code == 401


def test_login_user_without_password_rejected(client, create_user):
    # e.g. a future Google-only account
    create_user(password=None)
    response = client.post("/auth/login", json={"email": "client@example.com", "password": "password123"})
    assert response.status_code == 401


@pytest.mark.parametrize("body", [
    {"email": "client@example.com"},
    {"password": "password123"},
    {"email": "not-an-email", "password": "password123"},
])
def test_login_invalid_body(client, body):
    assert client.post("/auth/login", json=body).status_code == 422


# ---------- protected endpoint access (CurrentUser) ----------

def test_protected_endpoint_without_token(client):
    response = client.get("/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


@pytest.mark.parametrize("header", [
    "Bearer not.a.jwt",
    "Bearer ",
    "Basic dXNlcjpwYXNz",
])
def test_protected_endpoint_with_bad_authorization_header(client, header):
    assert client.get("/me", headers={"Authorization": header}).status_code == 401


def test_protected_endpoint_with_expired_token(client, create_user):
    user = create_user()
    token = make_token({"sub": str(user.user_id), "exp": datetime.now(timezone.utc) - timedelta(seconds=1)})

    response = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired token"


def test_protected_endpoint_with_forged_token(client, create_user):
    user = create_user()
    token = make_token({"sub": str(user.user_id), "exp": future()}, key="attacker-secret-key-that-is-long-enough")
    assert client.get("/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


def test_protected_endpoint_with_token_for_missing_user(client):
    token = create_access_token(9999)
    assert client.get("/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


def test_token_rejected_after_user_deactivated(client, create_user, auth_headers, session):
    user = create_user()
    headers = auth_headers()
    assert client.get("/me", headers=headers).status_code == 200

    user.is_active = False
    session.add(user)
    session.commit()

    assert client.get("/me", headers=headers).status_code == 401


# ---------- POST /auth/token (OAuth2 password flow, form data) ----------

def test_token_endpoint_success(client, create_user):
    user = create_user()
    response = client.post("/auth/token", data={"username": "client@example.com", "password": "password123"})

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert decode_access_token(body["access_token"]) == user.user_id


def test_token_endpoint_email_is_case_insensitive(client, create_user):
    create_user()
    response = client.post("/auth/token", data={"username": "CLIENT@example.com", "password": "password123"})
    assert response.status_code == 200


def test_token_endpoint_wrong_password(client, create_user):
    create_user()
    response = client.post("/auth/token", data={"username": "client@example.com", "password": "wrong-password"})

    assert response.status_code == 401
    assert response.headers["WWW-Authenticate"] == "Bearer"


def test_token_endpoint_requires_form_data(client, create_user):
    create_user()
    response = client.post("/auth/token", json={"username": "client@example.com", "password": "password123"})
    assert response.status_code == 422


def test_token_from_token_endpoint_works_on_protected_route(client, create_user):
    create_user()
    token = client.post("/auth/token", data={"username": "client@example.com", "password": "password123"}).json()["access_token"]

    response = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200


def test_unauthorized_response_has_www_authenticate_header(client):
    response = client.get("/me")
    assert response.status_code == 401
    assert response.headers["WWW-Authenticate"] == "Bearer"


def test_openapi_uses_oauth2_password_flow(client):
    schemes = client.get("/openapi.json").json()["components"]["securitySchemes"]
    assert schemes["OAuth2PasswordBearer"]["type"] == "oauth2"
    assert schemes["OAuth2PasswordBearer"]["flows"]["password"]["tokenUrl"] == "/auth/token"
