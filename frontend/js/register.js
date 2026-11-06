import { api, setToken } from "./api.js";
import { homeFor, renderPublicNav } from "./nav.js";
import { onSubmit, readTrimmed } from "./ui.js";

renderPublicNav();

const form = document.querySelector("#register-form");

onSubmit(form, async () => {
  const { email } = readTrimmed(form, "email");
  const password = form.elements.password.value;
  const user = await api("/register", {
    method: "POST",
    body: { email, password, user_role: form.elements.user_role.value },
    auth: false,
  });

  const { access_token } = await api("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  setToken(access_token);
  location.replace(homeFor(user.user_role));
});
