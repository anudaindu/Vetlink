import { api, getToken } from "./api.js";
import { homeFor } from "./nav.js";

async function main() {
  if (!getToken()) {
    location.replace("login.html");
    return;
  }
  try {
    const user = await api("/me");
    location.replace(homeFor(user.user_role));
  } catch {
    location.replace("login.html");
  }
}

main();
