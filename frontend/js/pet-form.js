import { ApiError, api, apiOrNull } from "./api.js";
import { hideStatus, initPage, showPageError } from "./nav.js";
import { ageFromDob, breedsFor, estimateDob, label, todayISO } from "./pet-utils.js";
import { el, fillForm, onSubmit, readTrimmed, show, showFieldErrors } from "./ui.js";

const MAX_AGE_YEARS = 40;
const MAX_AGE_MONTHS = 11;

const form = document.querySelector("#pet-form");
const title = document.querySelector("#title");
const submit = form.querySelector('[type="submit"]');
const { species, breed, dob, years, months } = form.elements;
const datePane = document.querySelector("#date-pane");
const agePane = document.querySelector("#age-pane");

const petId = new URLSearchParams(location.search).get("id");

// The pet as loaded, plus what the age fields started with. Null when adding a new pet.
let original = null;

const dobMode = () => form.elements.dob_mode.value;

function renderBreeds() {
  const selected = breed.value;
  const options = breedsFor(species.value);
  breed.replaceChildren(
    el("option", { value: "", text: species.value ? "Select a breed" : "Select a species first" }),
    ...(species.value ? options.map((value) => el("option", { value, text: label(value) })) : []),
  );
  breed.value = options.includes(selected) ? selected : "";
  breed.disabled = !species.value;
}

function renderDobMode() {
  show(datePane, dobMode() === "date");
  show(agePane, dobMode() === "age");
}

// Unchanged ages send nothing: recalculating from today would move the saved dob on every edit.
function ageChanged() {
  return (
    !original?.dob_is_estimated ||
    years.value !== original.ageYears ||
    months.value !== original.ageMonths
  );
}

function readAge(errors) {
  if (!ageChanged()) return {};

  const yearsText = years.value.trim();
  const monthsText = months.value.trim();
  if (!yearsText && !monthsText) {
    errors.years = "Enter your pet's age.";
    return {};
  }

  const yearCount = Number(yearsText || 0);
  const monthCount = Number(monthsText || 0);
  if (!Number.isInteger(yearCount) || yearCount < 0 || yearCount > MAX_AGE_YEARS) {
    errors.years = `Enter a whole number from 0 to ${MAX_AGE_YEARS}.`;
  }
  if (!Number.isInteger(monthCount) || monthCount < 0 || monthCount > MAX_AGE_MONTHS) {
    errors.months = `Enter a whole number from 0 to ${MAX_AGE_MONTHS}.`;
  }
  return errors.years || errors.months
    ? {}
    : { dob: estimateDob(yearCount, monthCount), dob_is_estimated: true };
}

function readBirthDate(errors) {
  if (!dob.value) {
    errors.dob = "Enter the birth date.";
    return {};
  }
  // The API accepts future dates, so this check only exists here
  if (dob.value > todayISO()) {
    errors.dob = "The birth date can't be in the future.";
    return {};
  }
  return { dob: dob.value, dob_is_estimated: false };
}

function readPet() {
  const errors = {};
  const values = {
    ...readTrimmed(form, "name"),
    species: species.value,
    breed: breed.value,
    gender: form.elements.gender.value,
  };
  for (const [field, value] of Object.entries(values)) {
    if (!value) errors[field] = "This field is required.";
  }
  const dobValues = dobMode() === "age" ? readAge(errors) : readBirthDate(errors);
  return { body: { ...values, ...dobValues }, errors };
}

function changedFields(body) {
  return Object.fromEntries(Object.entries(body).filter(([field, value]) => value !== original[field]));
}

function fillFromPet(pet) {
  const age = ageFromDob(pet.dob);
  original = {
    ...pet,
    ageYears: pet.dob_is_estimated ? String(age.years) : "",
    ageMonths: pet.dob_is_estimated ? String(age.months) : "",
  };

  fillForm(form, { name: pet.name, species: pet.species, gender: pet.gender });
  renderBreeds();
  breed.value = pet.breed;
  dob.value = pet.dob_is_estimated ? "" : pet.dob;
  years.value = original.ageYears;
  months.value = original.ageMonths;
  form.elements.dob_mode.value = pet.dob_is_estimated ? "age" : "date";
}

async function loadPet() {
  if (!/^\d+$/.test(petId)) throw new ApiError(404, "This pet doesn't exist.");
  fillFromPet(await api(`/pet/${petId}`));
  title.textContent = `Edit ${original.name}`;
  submit.textContent = "Save changes";
}

async function requireProfile() {
  if (await apiOrNull("/pet-owner-profile/")) return true;
  showPageError("Create your profile before adding pets.", { href: "owner-profile.html", text: "Create profile" });
  return false;
}

async function main() {
  if (!(await initPage("pet_owner"))) return;

  dob.max = todayISO();
  renderBreeds();

  try {
    if (petId !== null) await loadPet();
    else if (!(await requireProfile())) return;
  } catch (error) {
    showPageError(error.message, { href: "pets.html", text: "Back to my pets" });
    return;
  }

  hideStatus();
  renderDobMode();
  show(form.closest(".card"));

  species.addEventListener("change", renderBreeds);
  for (const radio of form.elements.dob_mode) radio.addEventListener("change", renderDobMode);

  onSubmit(form, async () => {
    const { body, errors } = readPet();
    if (Object.keys(errors).length > 0) {
      showFieldErrors(form, errors);
      return;
    }

    if (original) {
      const changes = changedFields(body);
      if (Object.keys(changes).length > 0) {
        await api(`/pet/${original.pet_id}`, { method: "PATCH", body: changes });
      }
    } else {
      await api("/pet/", { method: "POST", body });
    }
    location.assign("pets.html");
  });
}

main();
