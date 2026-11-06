import { api, apiOrNull } from "./api.js";
import { icon } from "./icons.js";
import { hideStatus, initPage, showPageError } from "./nav.js";
import { describeAge, label } from "./pet-utils.js";
import { el, show } from "./ui.js";

const list = document.querySelector("#pet-list");
const empty = document.querySelector("#empty");
const addButton = document.querySelector("#add-pet");

function petCard(pet) {
  return el(
    "li",
    { className: "card pet-card" },
    el("span", { text: `PET-${pet.pet_id}`, className: "pet-id" }),
    el("span", { className: "pet-avatar" }, icon(pet.species === "cat" ? "cat" : "dog", 32)),
    el("h2", { text: pet.name, className: "w-full break-words text-xl font-bold text-slate-900" }),
    el("p", { text: `${label(pet.species)} · ${label(pet.breed)}`, className: "text-sm text-slate-700" }),
    el(
      "div",
      { className: "pet-details" },
      el("p", {}, el("span", { text: "Gender: ", className: "font-semibold text-slate-600" }), label(pet.gender)),
      el("p", { text: describeAge(pet), className: "first-letter:uppercase" }),
    ),
    el("a", { href: `pet-form.html?id=${pet.pet_id}`, text: "Edit", className: "btn-secondary mt-auto w-full" }),
  );
}

async function main() {
  if (!(await initPage("pet_owner"))) return;

  try {
    if (!(await apiOrNull("/pet-owner-profile/"))) {
      showPageError("Create your profile before adding pets.", { href: "owner-profile.html", text: "Create profile" });
      return;
    }
    const pets = await api("/pet-owner-profile/pets");
    hideStatus();
    list.replaceChildren(...pets.map(petCard));
    show(list, pets.length > 0);
    show(empty, pets.length === 0);
    show(addButton);
  } catch (error) {
    showPageError(error.message);
  }
}

main();
