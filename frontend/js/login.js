import { api, setToken } from "./api.js";
import { homeFor, renderPublicNav } from "./nav.js";
import { onSubmit, readTrimmed, showMessage } from "./ui.js";

renderPublicNav();

const form = document.querySelector("#login-form");

if (new URLSearchParams(location.search).has("expired")) {
  showMessage(form, "Your session has expired. Please log in again.");
}

onSubmit(form, async () => {
  const { email } = readTrimmed(form, "email");
  const { access_token } = await api("/auth/login", {
    method: "POST",
    body: { email, password: form.elements.password.value },
    auth: false,
  });
  setToken(access_token);
  const user = await api("/me");
  location.replace(homeFor(user.user_role));
});
