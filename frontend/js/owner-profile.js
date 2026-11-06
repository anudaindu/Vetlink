import { api, apiOrNull } from "./api.js";
import { hideStatus, initPage, showPageError } from "./nav.js";
import { fillForm, onSubmit, readTrimmed, show, showMessage } from "./ui.js";

const PROFILE_URL = "/pet-owner-profile/";

const form = document.querySelector("#profile-form");
const title = document.querySelector("#title");
const intro = document.querySelector("#intro");

function setMode(hasProfile) {
  title.textContent = hasProfile ? "My profile" : "Create your profile";
  show(intro, !hasProfile);
}

async function main() {
  if (!(await initPage("pet_owner"))) return;

  let profile;
  try {
    profile = await apiOrNull(PROFILE_URL);
  } catch (error) {
    showPageError(error.message);
    return;
  }

  hideStatus();
  setMode(profile !== null);
  if (profile) fillForm(form, profile);
  show(form.closest(".card"));

  onSubmit(form, async () => {
    const body = readTrimmed(form, "name", "phone_number");
    if (profile) {
      profile = await api(PROFILE_URL, { method: "PATCH", body });
      fillForm(form, profile);
      showMessage(form, "Profile saved.", "success");
    } else {
      await api(PROFILE_URL, { method: "POST", body });
      location.assign("pets.html");
    }
  });
}

main();
