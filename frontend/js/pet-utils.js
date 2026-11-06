// Mirrors the Breed enum in backend/app/models/common/enum.py. The API has no endpoint for it.
const BREEDS = {
  dog: [
    "labrador_retriever",
    "german_shepherd",
    "golden_retriever",
    "beagle",
    "poodle",
    "rottweiler",
    "dachshund",
    "shih_tzu",
    "pomeranian",
    "bulldog",
    "mixed_dog",
  ],
  cat: ["persian", "siamese", "maine_coon", "british_shorthair", "bengal", "ragdoll", "mixed_cat"],
};

export const breedsFor = (species) => [...(BREEDS[species] ?? []), "other"];

export const label = (value) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

// Dates stay in local time. toISOString() is UTC, which is the previous day in Sri Lanka before 05:30.
export function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseISODate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export const todayISO = () => toISODate(new Date());

export function estimateDob(years, months, today = new Date()) {
  const totalMonths = today.getFullYear() * 12 + today.getMonth() - (years * 12 + months);
  const year = Math.floor(totalMonths / 12);
  const month = totalMonths - year * 12;
  // 31 March minus one month is the last day of February, not 3 March
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  return toISODate(new Date(year, month, Math.min(today.getDate(), lastDayOfMonth)));
}

export function ageFromDob(iso, today = new Date()) {
  const dob = parseISODate(iso);
  let totalMonths = (today.getFullYear() - dob.getFullYear()) * 12 + today.getMonth() - dob.getMonth();
  if (today.getDate() < dob.getDate()) totalMonths -= 1;
  return { years: Math.floor(totalMonths / 12), months: totalMonths - Math.floor(totalMonths / 12) * 12 };
}

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

export function describeAge(pet, today = new Date()) {
  if (!pet.dob_is_estimated) {
    const date = parseISODate(pet.dob);
    return `Born ${date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  const { years, months } = ageFromDob(pet.dob, today);
  if (years < 0) return "Age unknown";
  if (years > 0) return `about ${plural(years, "year")} old`;
  return months > 0 ? `about ${plural(months, "month")} old` : "less than a month old";
}
