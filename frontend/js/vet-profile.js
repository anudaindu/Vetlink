import { ApiError, api, apiOrNull } from "./api.js";
import { hideStatus, initPage, showPageError } from "./nav.js";
import { fillForm, onSubmit, readTrimmed, show, showMessage } from "./ui.js";

const PROFILE_URL = "/vet-profile/";

const form = document.querySelector("#profile-form");
const title = document.querySelector("#title");
const intro = document.querySelector("#intro");
const license = form.elements.license_number;
const licenseHint = document.querySelector("#license-hint");
const verification = document.querySelector("#verification");

function renderProfile(profile) {
  const hasProfile = profile !== null;
  title.textContent = hasProfile ? "My vet profile" : "Create your vet profile";
  show(intro, !hasProfile);
  // The API has no way to change a license number once it's saved
  license.disabled = hasProfile;
  show(licenseHint, hasProfile);
  show(verification, hasProfile);

  if (hasProfile) {
    fillForm(form, profile);
    verification.textContent = profile.is_verified ? "Verified" : "Not verified yet";
    verification.className = `badge ${profile.is_verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`;
  }
}

// Vet routes have no phone number check of their own, so a taken number comes back as this generic 409
function rethrowFriendly(error) {
  if (error.status === 409 && error.message === "Resource already exists") {
    throw new ApiError(409, "This phone number is already in use.");
  }
  throw error;
}

async function main() {
  if (!(await initPage("vet"))) return;

  let profile;
  try {
    profile = await apiOrNull(PROFILE_URL);
  } catch (error) {
    showPageError(error.message);
    return;
  }

  hideStatus();
  renderProfile(profile);
  show(form.closest(".card"));

  onSubmit(form, async () => {
    const body = readTrimmed(form, "name", "specialization", "phone_number");
    if (profile) {
      profile = await api(PROFILE_URL, { method: "PATCH", body }).catch(rethrowFriendly);
    } else {
      body.license_number = license.value.trim();
      profile = await api(PROFILE_URL, { method: "POST", body }).catch(rethrowFriendly);
    }
    renderProfile(profile);
    showMessage(form, "Profile saved.", "success");
  });
}

main();
