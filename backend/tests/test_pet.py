import pytest

from app.models.common.enum import UserRole
from app.models.entity.pet import Pet

PET_URL = "/pet/"
OWNER_PROFILE_URL = "/pet-owner-profile/"
OWNER_EMAIL = "owner@example.com"
OTHER_OWNER_EMAIL = "other@example.com"
VET_EMAIL = "vet@example.com"
VALID_PET = {
    "name": "Rex",
    "species": "dog",
    "breed": "beagle",
    "dob": "2022-03-15",
    "dob_is_estimated": False,
    "gender": "male",
}


@pytest.fixture
def owner(create_user):
    return create_user(email=OWNER_EMAIL)


@pytest.fixture
def owner_headers(client, owner, auth_headers):
    headers = auth_headers(email=OWNER_EMAIL)
    response = client.post(
        OWNER_PROFILE_URL,
        json={"name": "Nimal Perera", "phone_number": "0712345678"},
        headers=headers,
    )
    assert response.status_code == 201, response.json()
    return headers


@pytest.fixture
def other_owner_headers(client, create_user, auth_headers):
    create_user(email=OTHER_OWNER_EMAIL)
    headers = auth_headers(email=OTHER_OWNER_EMAIL)
    response = client.post(
        OWNER_PROFILE_URL,
        json={"name": "Kamal Silva", "phone_number": "0771234567"},
        headers=headers,
    )
    assert response.status_code == 201, response.json()
    return headers


@pytest.fixture
def vet_headers(create_user, auth_headers):
    create_user(email=VET_EMAIL, role=UserRole.VET)
    return auth_headers(email=VET_EMAIL)


@pytest.fixture
def pet(client, owner_headers):
    response = client.post(PET_URL, json=VALID_PET, headers=owner_headers)
    assert response.status_code == 201, response.json()
    return response.json()


# ---------- auth / role ----------

@pytest.mark.parametrize("method,url", [
    ("get", f"{PET_URL}1"),
    ("post", PET_URL),
    ("patch", f"{PET_URL}1"),
])
def test_routes_require_auth(client, method, url):
    response = client.request(method, url, json=VALID_PET)

    assert response.status_code == 401


def test_vet_cannot_create_pet(client, session, vet_headers):
    response = client.post(PET_URL, json=VALID_PET, headers=vet_headers)

    assert response.status_code == 403
    assert "WWW-Authenticate" not in response.headers
    assert session.get(Pet, 1) is None


def test_vet_cannot_update_pet(client, session, pet, vet_headers):
    response = client.patch(f"{PET_URL}{pet['pet_id']}", json={"name": "Max"}, headers=vet_headers)

    assert response.status_code == 403
    assert session.get(Pet, pet["pet_id"]).name == VALID_PET["name"]


# ---------- POST ----------

def test_create_pet(client, session, owner, owner_headers):
    response = client.post(PET_URL, json=VALID_PET, headers=owner_headers)

    assert response.status_code == 201
    body = response.json()
    assert body == {**VALID_PET, "pet_id": body["pet_id"], "owner_id": owner.user_id}
    assert session.get(Pet, body["pet_id"]).owner_id == owner.user_id


def test_create_pet_dob_is_estimated_defaults_to_false(client, owner_headers):
    body = {key: value for key, value in VALID_PET.items() if key != "dob_is_estimated"}

    response = client.post(PET_URL, json=body, headers=owner_headers)

    assert response.status_code == 201
    assert response.json()["dob_is_estimated"] is False


def test_create_pet_strips_name_whitespace(client, owner_headers):
    response = client.post(PET_URL, json={**VALID_PET, "name": "  Rex  "}, headers=owner_headers)

    assert response.status_code == 201
    assert response.json()["name"] == "Rex"


def test_create_pet_with_duplicate_name_and_species(client, pet, owner_headers):
    response = client.post(PET_URL, json={**VALID_PET, "breed": "poodle"}, headers=owner_headers)

    assert response.status_code == 409
    assert response.json()["detail"] == "You already have a dog named Rex"


def test_create_pet_same_name_different_species(client, pet, owner_headers):
    response = client.post(PET_URL, json={**VALID_PET, "species": "cat", "breed": "persian"}, headers=owner_headers)

    assert response.status_code == 201


def test_create_pet_same_name_different_owner(client, pet, other_owner_headers):
    response = client.post(PET_URL, json=VALID_PET, headers=other_owner_headers)

    assert response.status_code == 201


@pytest.mark.parametrize("body", [
    {"name": "Rex"},
    {**VALID_PET, "name": ""},
    {**VALID_PET, "name": "   "},
    {**VALID_PET, "name": "x" * 51},
    {**VALID_PET, "species": "bird"},
    {**VALID_PET, "breed": "unicorn"},
    {**VALID_PET, "gender": "unknown"},
    {**VALID_PET, "dob": "not-a-date"},
    {**VALID_PET, "pet_id": 99},
    {**VALID_PET, "owner_id": 99},
])
def test_create_pet_invalid_body(client, owner_headers, body):
    response = client.post(PET_URL, json=body, headers=owner_headers)

    assert response.status_code == 422


def test_create_pet_without_owner_profile(client, owner, auth_headers):
    response = client.post(PET_URL, json=VALID_PET, headers=auth_headers(email=OWNER_EMAIL))

    assert response.status_code == 404
    assert response.json()["detail"] == "Pet owner profile not found. Create a pet owner profile first."


@pytest.mark.xfail(strict=True, reason="breed is not checked against species")
def test_create_pet_breed_must_match_species(client, owner_headers):
    response = client.post(PET_URL, json={**VALID_PET, "breed": "persian"}, headers=owner_headers)

    assert response.status_code == 422


# ---------- GET ----------

def test_owner_gets_own_pet(client, pet, owner_headers):
    response = client.get(f"{PET_URL}{pet['pet_id']}", headers=owner_headers)

    assert response.status_code == 200
    assert response.json() == pet


def test_vet_gets_pet(client, pet, vet_headers):
    response = client.get(f"{PET_URL}{pet['pet_id']}", headers=vet_headers)

    assert response.status_code == 200
    assert response.json() == pet


def test_get_pet_not_found(client, owner_headers):
    response = client.get(f"{PET_URL}999", headers=owner_headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Pet profile with id 999 not found"


def test_get_pet_invalid_id(client, owner_headers):
    response = client.get(f"{PET_URL}abc", headers=owner_headers)

    assert response.status_code == 422


def test_other_owner_cannot_get_pet(client, pet, other_owner_headers):
    response = client.get(f"{PET_URL}{pet['pet_id']}", headers=other_owner_headers)

    assert response.status_code == 404


# ---------- PATCH ----------

@pytest.mark.parametrize("changes", [
    {"name": "Max"},
    {"breed": "poodle"},
    {"dob": "2021-01-01"},
    {"dob_is_estimated": True},
    {"gender": "female"},
    {"species": "cat", "breed": "persian"},
])
def test_update_pet(client, pet, owner_headers, changes):
    response = client.patch(f"{PET_URL}{pet['pet_id']}", json=changes, headers=owner_headers)

    assert response.status_code == 200
    assert response.json() == {**pet, **changes}


def test_update_pet_dob_is_estimated_back_to_false(client, owner_headers):
    created = client.post(PET_URL, json={**VALID_PET, "dob_is_estimated": True}, headers=owner_headers).json()

    response = client.patch(f"{PET_URL}{created['pet_id']}", json={"dob_is_estimated": False}, headers=owner_headers)

    assert response.status_code == 200
    assert response.json()["dob_is_estimated"] is False


def test_update_pet_ignores_null_and_empty_body(client, pet, owner_headers):
    url = f"{PET_URL}{pet['pet_id']}"

    assert client.patch(url, json={}, headers=owner_headers).json() == pet
    assert client.patch(url, json={"name": None}, headers=owner_headers).json() == pet


def test_update_pet_to_own_current_name(client, pet, owner_headers):
    response = client.patch(f"{PET_URL}{pet['pet_id']}", json={"name": VALID_PET["name"]}, headers=owner_headers)

    assert response.status_code == 200


def test_update_pet_name_to_duplicate(client, pet, owner_headers):
    second = client.post(PET_URL, json={**VALID_PET, "name": "Max"}, headers=owner_headers).json()

    response = client.patch(f"{PET_URL}{second['pet_id']}", json={"name": "Rex"}, headers=owner_headers)

    assert response.status_code == 409
    assert response.json()["detail"] == "You already have a dog named Rex"


def test_update_pet_species_to_duplicate(client, pet, owner_headers):
    cat = {**VALID_PET, "species": "cat", "breed": "persian"}
    second = client.post(PET_URL, json=cat, headers=owner_headers).json()

    response = client.patch(f"{PET_URL}{second['pet_id']}", json={"species": "dog"}, headers=owner_headers)

    assert response.status_code == 409
    assert response.json()["detail"] == "You already have a dog named Rex"


def test_update_pet_name_used_by_other_owner(client, pet, owner_headers, other_owner_headers):
    client.post(PET_URL, json={**VALID_PET, "name": "Max"}, headers=other_owner_headers)

    response = client.patch(f"{PET_URL}{pet['pet_id']}", json={"name": "Max"}, headers=owner_headers)

    assert response.status_code == 200


def test_other_owner_cannot_update_pet(client, session, pet, other_owner_headers):
    response = client.patch(f"{PET_URL}{pet['pet_id']}", json={"name": "Max"}, headers=other_owner_headers)

    assert response.status_code == 404
    assert session.get(Pet, pet["pet_id"]).name == VALID_PET["name"]


def test_update_pet_not_found(client, owner_headers):
    response = client.patch(f"{PET_URL}999", json={"name": "Max"}, headers=owner_headers)

    assert response.status_code == 404


@pytest.mark.parametrize("body", [
    {"name": ""},
    {"name": "   "},
    {"name": "x" * 51},
    {"species": "bird"},
    {"breed": "unicorn"},
    {"gender": "unknown"},
    {"dob": "not-a-date"},
    {"pet_id": 99},
    {"owner_id": 99},
])
def test_update_pet_invalid_body(client, pet, owner_headers, body):
    response = client.patch(f"{PET_URL}{pet['pet_id']}", json=body, headers=owner_headers)

    assert response.status_code == 422


@pytest.mark.xfail(strict=True, reason="breed is not checked against species")
def test_update_pet_breed_must_match_species(client, pet, owner_headers):
    response = client.patch(f"{PET_URL}{pet['pet_id']}", json={"species": "cat"}, headers=owner_headers)

    assert response.status_code == 422
