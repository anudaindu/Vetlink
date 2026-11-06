// Builds elements with textContent, so names typed by users can never run as HTML.
export function el(tag, { text, className, ...attributes } = {}, ...children) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children);
  return element;
}

export const show = (element, visible = true) => element.classList.toggle("hidden", !visible);

function formMessage(form) {
  return form.querySelector("[data-form-message]");
}

export function clearErrors(form) {
  for (const error of form.querySelectorAll("[data-error-for]")) {
    error.textContent = "";
    show(error, false);
  }
  for (const input of form.querySelectorAll("[aria-invalid]")) input.removeAttribute("aria-invalid");
  const message = formMessage(form);
  message.textContent = "";
  message.className = "hidden";
}

export function showMessage(form, text, type = "error") {
  const message = formMessage(form);
  message.textContent = text;
  message.className = type === "error" ? "notice-error" : "notice-success";
}

export function showFieldErrors(form, fieldErrors) {
  const unmatched = [];
  for (const [field, text] of Object.entries(fieldErrors)) {
    const error = form.querySelector(`[data-error-for="${field}"]`);
    if (!error) {
      unmatched.push(text);
      continue;
    }
    error.textContent = text;
    show(error);
    form.elements[field]?.setAttribute?.("aria-invalid", "true");
  }
  return unmatched;
}

export function showError(form, error) {
  const unmatched = showFieldErrors(form, error.fieldErrors ?? {});
  const hasFieldErrors = Object.keys(error.fieldErrors ?? {}).length > unmatched.length;
  if (unmatched.length > 0) showMessage(form, unmatched.join(" "));
  else if (!hasFieldErrors) showMessage(form, error.message);
}

// Disables the submit button while the request runs, then clears errors from the last try.
export function onSubmit(form, handler) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    clearErrors(form);
    button.disabled = true;
    try {
      await handler();
    } catch (error) {
      showError(form, error);
    } finally {
      button.disabled = false;
    }
  });
}

export function fillForm(form, values) {
  for (const [name, value] of Object.entries(values)) {
    if (form.elements[name]) form.elements[name].value = value ?? "";
  }
}

export function readTrimmed(form, ...names) {
  return Object.fromEntries(names.map((name) => [name, form.elements[name].value.trim()]));
}
