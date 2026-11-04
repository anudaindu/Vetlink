import pytest

from app.models.common.enum import UserRole
from app.models.entity.vet_profile import VetProfile

PROFILE_URL = "/vet-profile/"
PET_OWNER_URL = "/vet-profile/pet-owner"
VETS_URL = "/pet-owner-profile/vet/"
OWNER_PROFILE_URL = "/pet-owner-profile/"
VET_EMAIL = "vet@example.com"
OWNER_EMAIL = "owner@example.com"
VALID_PROFILE = {
    "name": "Dr Silva",
    "license_number": "SLVC-1234",
    "specialization": "Small animals",
    "phone_number": "0771234567",
}
OWN_PROFILE_RESPONSE = {**VALID_PROFILE, "is_verified": False, "rating": None}
VALID_OWNER_PROFILE = {"name": "Nimal Perera", "phone_number": "0712345678"}


def public_profile(user_id: int) -> dict:
    """What a pet owner sees of a vet: everything except the license number."""
    return {
        "user_id": user_id,
        "name": VALID_PROFILE["name"],
        "specialization": VALID_PROFILE["specialization"],
        "phone_number": VALID_PROFILE["phone_number"],
        "is_verified": False,
        "rating": None,
    }


@pytest.fixture
def vet(create_user):
    return create_user(email=VET_EMAIL, role=UserRole.VET)


@pytest.fixture
def vet_headers(vet, auth_headers):
    return auth_headers(email=VET_EMAIL)


@pytest.fixture
def vet_with_profile(client, vet_headers):
    response = client.post(PROFILE_URL, json=VALID_PROFILE, headers=vet_headers)
    assert response.status_code == 201, response.json()
    return vet_headers


@pytest.fixture
def owner(create_user):
    return create_user(email=OWNER_EMAIL)


@pytest.fixture
def owner_headers(owner, auth_headers):
    return auth_headers(email=OWNER_EMAIL)


@pytest.fixture
def owner_with_profile(client, owner_headers):
    response = client.post(OWNER_PROFILE_URL, json=VALID_OWNER_PROFILE, headers=owner_headers)
    assert response.status_code == 201, response.json()
    return owner_headers


# ---------- auth / role ----------

@pytest.mark.parametrize("method,url", [
    ("get", PROFILE_URL),
    ("post", PROFILE_URL),
    ("patch", PROFILE_URL),
    ("get", f"{PET_OWNER_URL}/1"),
    ("get", VETS_URL),
    ("get", f"{VETS_URL}1"),
])
def test_routes_require_auth(client, method, url):
    response = client.request(method, url, json=VALID_PROFILE)

    assert response.status_code == 401


@pytest.mark.parametrize("method,url", [
    ("get", PROFILE_URL),
    ("post", PROFILE_URL),
    ("patch", PROFILE_URL),
    ("get", f"{PET_OWNER_URL}/1"),
])
def test_pet_owner_cannot_use_vet_routes(client, session, owner_headers, method, url):
    response = client.request(method, url, json=VALID_PROFILE, headers=owner_headers)

    assert response.status_code == 403
    assert "WWW-Authenticate" not in response.headers
    assert session.get(VetProfile, 1) is None


@pytest.mark.parametrize("url", [VETS_URL, f"{VETS_URL}1"])
def test_vet_cannot_use_pet_owner_vet_routes(client, vet_with_profile, url):
    response = client.get(url, headers=vet_with_profile)

    assert response.status_code == 403
    assert "WWW-Authenticate" not in response.headers


# ---------- POST ----------

def test_create_profile(client, session, vet, vet_headers):
    response = client.post(PROFILE_URL, json=VALID_PROFILE, headers=vet_headers)

    assert response.status_code == 201
    assert response.json() == OWN_PROFILE_RESPONSE
    stored = session.get(VetProfile, vet.user_id)
    assert stored.name == VALID_PROFILE["name"]
    assert stored.is_verified is False


def test_create_profile_twice(client, vet_with_profile):
    response = client.post(
        PROFILE_URL,
        json={**VALID_PROFILE, "license_number": "SLVC-9999", "phone_number": "0711111111"},
        headers=vet_with_profile,
    )

    assert response.status_code == 409


def test_create_profile_with_license_number_taken(client, create_user, auth_headers, vet_with_profile):
    create_user(email="other@example.com", role=UserRole.VET)
    headers = auth_headers(email="other@example.com")

    response = client.post(PROFILE_URL, json={**VALID_PROFILE, "phone_number": "0711111111"}, headers=headers)

    assert response.status_code == 409


def test_create_profile_with_phone_number_taken(client, create_user, auth_headers, vet_with_profile):
    create_user(email="other@example.com", role=UserRole.VET)
    headers = auth_headers(email="other@example.com")

    response = client.post(PROFILE_URL, json={**VALID_PROFILE, "license_number": "SLVC-9999"}, headers=headers)

    assert response.status_code == 409


@pytest.mark.parametrize("body", [
    {"name": "Dr Silva"},
    {**VALID_PROFILE, "name": ""},
    {**VALID_PROFILE, "name": "x" * 51},
    {**VALID_PROFILE, "license_number": "1234"},
    {**VALID_PROFILE, "license_number": "x" * 21},
    {**VALID_PROFILE, "specialization": ""},
    {**VALID_PROFILE, "phone_number": "712345678"},
    {**VALID_PROFILE, "user_id": 99},
    {**VALID_PROFILE, "is_verified": True},
    {**VALID_PROFILE, "rating": 5},
])
def test_create_profile_invalid_body(client, vet_headers, body):
    response = client.post(PROFILE_URL, json=body, headers=vet_headers)

    assert response.status_code == 422


# ---------- GET ----------

def test_get_profile(client, vet_with_profile):
    response = client.get(PROFILE_URL, headers=vet_with_profile)

    assert response.status_code == 200
    assert response.json() == OWN_PROFILE_RESPONSE


def test_get_profile_not_created_yet(client, vet_headers):
    response = client.get(PROFILE_URL, headers=vet_headers)

    assert response.status_code == 404


# ---------- PATCH ----------

def test_update_profile(client, vet_with_profile):
    response = client.patch(PROFILE_URL, json={"specialization": "Exotic pets"}, headers=vet_with_profile)

    assert response.status_code == 200
    assert response.json() == {**OWN_PROFILE_RESPONSE, "specialization": "Exotic pets"}


def test_update_profile_only_changes_own_profile(client, session, create_user, auth_headers, vet, vet_with_profile):
    other = create_user(email="other@example.com", role=UserRole.VET)
    other_headers = auth_headers(email="other@example.com")
    other_profile = {**VALID_PROFILE, "license_number": "SLVC-9999", "phone_number": "0711111111"}
    client.post(PROFILE_URL, json=other_profile, headers=other_headers)

    client.patch(PROFILE_URL, json={"name": "Dr Fernando"}, headers=other_headers)

    assert session.get(VetProfile, vet.user_id).name == VALID_PROFILE["name"]
    assert session.get(VetProfile, other.user_id).name == "Dr Fernando"


def test_update_profile_to_phone_number_taken(client, create_user, auth_headers, vet_with_profile):
    create_user(email="other@example.com", role=UserRole.VET)
    other_headers = auth_headers(email="other@example.com")
    other_profile = {**VALID_PROFILE, "license_number": "SLVC-9999", "phone_number": "0711111111"}
    client.post(PROFILE_URL, json=other_profile, headers=other_headers)

    response = client.patch(PROFILE_URL, json={"phone_number": VALID_PROFILE["phone_number"]}, headers=other_headers)

    assert response.status_code == 409


def test_update_profile_not_created_yet(client, vet_headers):
    response = client.patch(PROFILE_URL, json={"name": "Dr Fernando"}, headers=vet_headers)

    assert response.status_code == 404


@pytest.mark.parametrize("body", [
    {"name": ""},
    {"phone_number": "123"},
    {"license_number": "SLVC-9999"},
    {"is_verified": True},
    {"rating": 5},
    {"user_id": 99},
])
def test_update_profile_invalid_body(client, vet_with_profile, body):
    response = client.patch(PROFILE_URL, json=body, headers=vet_with_profile)

    assert response.status_code == 422


# ---------- vet views a pet owner ----------

def test_vet_gets_pet_owner_profile(client, owner, owner_with_profile, vet_headers):
    response = client.get(f"{PET_OWNER_URL}/{owner.user_id}", headers=vet_headers)

    assert response.status_code == 200
    assert response.json() == {**VALID_OWNER_PROFILE, "user_id": owner.user_id}


def test_vet_gets_pet_owner_profile_not_found(client, vet_headers):
    response = client.get(f"{PET_OWNER_URL}/999", headers=vet_headers)

    assert response.status_code == 404


def test_vet_cannot_get_vet_through_pet_owner_route(client, vet, vet_with_profile):
    response = client.get(f"{PET_OWNER_URL}/{vet.user_id}", headers=vet_with_profile)

    assert response.status_code == 404


# ---------- pet owner views vets ----------

def test_pet_owner_lists_vets(client, vet, vet_with_profile, owner_headers):
    response = client.get(VETS_URL, headers=owner_headers)

    assert response.status_code == 200
    assert response.json() == [public_profile(vet.user_id)]


def test_pet_owner_lists_vets_when_there_are_none(client, owner_headers):
    response = client.get(VETS_URL, headers=owner_headers)

    assert response.status_code == 200
    assert response.json() == []


def test_pet_owner_gets_vet_by_id(client, vet, vet_with_profile, owner_headers):
    response = client.get(f"{VETS_URL}{vet.user_id}", headers=owner_headers)

    assert response.status_code == 200
    assert response.json() == public_profile(vet.user_id)


def test_pet_owner_gets_vet_not_found(client, owner_headers):
    response = client.get(f"{VETS_URL}999", headers=owner_headers)

    assert response.status_code == 404


def test_pet_owner_cannot_get_owner_through_vet_route(client, owner, owner_with_profile):
    response = client.get(f"{VETS_URL}{owner.user_id}", headers=owner_with_profile)

    assert response.status_code == 404
