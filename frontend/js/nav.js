import { api, clearToken, getToken } from "./api.js";
import { icon } from "./icons.js";
import { el, show } from "./ui.js";

const LINKS = {
  pet_owner: [
    ["pets.html", "My pets", "dog"],
    ["pet-form.html", "Add a pet", "plus-circle"],
    ["owner-profile.html", "My profile", "user"],
  ],
  vet: [["vet-profile.html", "My profile", "user"]],
};

export const homeFor = (role) => (role === "vet" ? "vet-profile.html" : "pets.html");

function brand(href) {
  return el(
    "a",
    { href, className: "brand" },
    el("img", { src: "assets/logo-mark.png", alt: "", className: "h-10 w-10" }),
    "VetLink",
  );
}

function currentPage() {
  const page = location.pathname.split("/").pop();
  // Editing a pet belongs to "My pets", not "Add a pet".
  return page === "pet-form.html" && location.search ? "pets.html" : page;
}

function renderNav(user) {
  const current = currentPage();
  const links = LINKS[user.user_role].map(([href, text, iconName]) => {
    const active = href === current;
    return el(
      "a",
      {
        href,
        className: active ? "nav-link nav-link-active" : "nav-link",
        ...(active && { "aria-current": "page" }),
      },
      icon(iconName),
      text,
    );
  });

  const logout = el("button", { type: "button", className: "nav-link nav-link-danger" }, icon("log-out"), "Log out");
  logout.addEventListener("click", () => {
    clearToken();
    location.replace("login.html");
  });

  const sidebar = el(
    "aside",
    { id: "sidebar", className: "sidebar" },
    el("div", { className: "sidebar-header" }, brand(homeFor(user.user_role))),
    el("nav", { className: "sidebar-links", "aria-label": "Main" }, ...links, logout),
  );
  const backdrop = el("div", { className: "sidebar-backdrop hidden" });
  const menuButton = el(
    "button",
    { type: "button", className: "menu-button", "aria-label": "Menu", "aria-controls": "sidebar", "aria-expanded": "false" },
    icon("menu", 24),
  );

  function setMenuOpen(open) {
    sidebar.classList.toggle("sidebar-open", open);
    show(backdrop, open);
    menuButton.setAttribute("aria-expanded", String(open));
  }
  menuButton.addEventListener("click", () => setMenuOpen(!sidebar.classList.contains("sidebar-open")));
  backdrop.addEventListener("click", () => setMenuOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  document.querySelector("#nav").replaceChildren(
    sidebar,
    backdrop,
    el(
      "header",
      { className: "topbar" },
      menuButton,
      el(
        "div",
        { className: "user-info" },
        el("span", { text: user.email, className: "truncate text-sm text-slate-700" }),
        el("span", { text: user.email[0].toUpperCase(), className: "avatar" }),
      ),
    ),
  );
}

// Top bar for the logged-out pages.
export function renderPublicNav() {
  const current = location.pathname.split("/").pop();
  document.querySelector("#nav").replaceChildren(
    el(
      "nav",
      { className: "public-nav", "aria-label": "Main" },
      el(
        "div",
        { className: "public-nav-inner" },
        brand("login.html"),
        el(
          "div",
          { className: "flex items-center gap-4 sm:gap-8" },
          el("a", {
            href: "login.html",
            text: "Log in",
            className: current === "login.html" ? "public-link public-link-active" : "public-link",
          }),
          el("a", { href: "register.html", text: "Sign up", className: "btn" }),
        ),
      ),
    ),
  );
}

// Runs at the top of every signed-in page. Returns the user, or null if the page shouldn't load.
export async function initPage(role) {
  if (!getToken()) {
    location.replace("login.html");
    return null;
  }

  try {
    const user = await api("/me");
    if (user.user_role !== role) {
      location.replace(homeFor(user.user_role));
      return null;
    }
    renderNav(user);
    return user;
  } catch (error) {
    showPageError(error.message);
    return null;
  }
}

export function showPageError(text, link) {
  const status = document.querySelector("#status");
  status.className = "notice-error";
  status.replaceChildren(text);
  if (link) status.append(" ", el("a", { href: link.href, text: link.text, className: "text-link" }));
}

export function hideStatus() {
  show(document.querySelector("#status"), false);
}
