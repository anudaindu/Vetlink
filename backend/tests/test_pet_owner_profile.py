import pytest

from app.models.common.enum import UserRole
from app.models.entity.pet_owner_profile import PetOwnerProfile

PROFILE_URL = "/pet-owner-profile/"
VALID_PROFILE = {"name": "Nimal Perera", "phone_number": "0712345678"}


@pytest.fixture
def owner_headers(create_user, auth_headers):
    create_user()
    return auth_headers()


@pytest.fixture
def owner_with_profile(client, owner_headers):
    response = client.post(PROFILE_URL, json=VALID_PROFILE, headers=owner_headers)
    assert response.status_code == 201, response.json()
    return owner_headers


# ---------- auth / role ----------

@pytest.mark.parametrize("method", ["get", "post", "patch"])
def test_profile_requires_auth(client, method):
    response = client.request(method, PROFILE_URL, json=VALID_PROFILE)

    assert response.status_code == 401


@pytest.mark.parametrize("method", ["get", "post", "patch"])
def test_vet_cannot_use_pet_owner_profile(client, create_user, auth_headers, method):
    create_user(email="vet@example.com", role=UserRole.VET)
    headers = auth_headers(email="vet@example.com")

    response = client.request(method, PROFILE_URL, json=VALID_PROFILE, headers=headers)

    assert response.status_code == 403
    assert "WWW-Authenticate" not in response.headers


# ---------- POST ----------

def test_create_profile(client, session, owner_headers):
    response = client.post(PROFILE_URL, json=VALID_PROFILE, headers=owner_headers)

    assert response.status_code == 201
    assert response.json() == VALID_PROFILE
    assert session.get(PetOwnerProfile, 1).phone_number == VALID_PROFILE["phone_number"]


def test_create_profile_twice(client, owner_with_profile):
    response = client.post(PROFILE_URL, json={**VALID_PROFILE, "phone_number": "0771234567"}, headers=owner_with_profile)

    assert response.status_code == 409
    assert response.json()["detail"] == "Pet owner profile already exists"


def test_create_profile_with_phone_number_taken(client, create_user, auth_headers, owner_with_profile):
    create_user(email="other@example.com")
    headers = auth_headers(email="other@example.com")

    response = client.post(PROFILE_URL, json=VALID_PROFILE, headers=headers)

    assert response.status_code == 409
    assert response.json()["detail"] == "Phone number is already in use"


@pytest.mark.parametrize("body", [
    {"name": "Nimal"},
    {"phone_number": "0712345678"},
    {**VALID_PROFILE, "phone_number": "712345678"},
    {**VALID_PROFILE, "phone_number": "0012345678"},
    {**VALID_PROFILE, "phone_number": "07123456789"},
    {**VALID_PROFILE, "name": ""},
    {**VALID_PROFILE, "name": "x" * 51},
    {**VALID_PROFILE, "user_id": 99},
])
def test_create_profile_invalid_body(client, owner_headers, body):
    response = client.post(PROFILE_URL, json=body, headers=owner_headers)

    assert response.status_code == 422


# ---------- GET ----------

def test_get_profile(client, owner_with_profile):
    response = client.get(PROFILE_URL, headers=owner_with_profile)

    assert response.status_code == 200
    assert response.json() == VALID_PROFILE


def test_get_profile_not_created_yet(client, owner_headers):
    response = client.get(PROFILE_URL, headers=owner_headers)

    assert response.status_code == 404


# ---------- PATCH ----------

def test_update_profile_name(client, owner_with_profile):
    response = client.patch(PROFILE_URL, json={"name": "Kamal"}, headers=owner_with_profile)

    assert response.status_code == 200
    assert response.json() == {**VALID_PROFILE, "name": "Kamal"}


def test_update_profile_to_same_phone_number(client, owner_with_profile):
    response = client.patch(PROFILE_URL, json={"phone_number": VALID_PROFILE["phone_number"]}, headers=owner_with_profile)

    assert response.status_code == 200


def test_update_profile_to_phone_number_taken(client, create_user, auth_headers, owner_with_profile):
    create_user(email="other@example.com")
    other_headers = auth_headers(email="other@example.com")
    client.post(PROFILE_URL, json={**VALID_PROFILE, "phone_number": "0771234567"}, headers=other_headers)

    response = client.patch(PROFILE_URL, json={"phone_number": VALID_PROFILE["phone_number"]}, headers=other_headers)

    assert response.status_code == 409
    assert response.json()["detail"] == "Phone number is already in use"


def test_update_profile_not_created_yet(client, owner_headers):
    response = client.patch(PROFILE_URL, json={"name": "Kamal"}, headers=owner_headers)

    assert response.status_code == 404


@pytest.mark.parametrize("body", [
    {"phone_number": "123"},
    {"name": ""},
    {"user_id": 99},
])
def test_update_profile_invalid_body(client, owner_with_profile, body):
    response = client.patch(PROFILE_URL, json=body, headers=owner_with_profile)

    assert response.status_code == 422
