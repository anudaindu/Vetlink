export const API_BASE_URL = "http://localhost:8000";

const TOKEN_KEY = "vetlink_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors; // { field_name: "message" }, from 422 responses
  }
}

function friendlyMessage(error, field) {
  switch (error.type) {
    case "missing":
      return "This field is required.";
    case "string_too_short":
      return error.ctx?.min_length === 1
        ? "This field is required."
        : `Must be at least ${error.ctx?.min_length} characters.`;
    case "string_too_long":
      return `Must be ${error.ctx?.max_length} characters or fewer.`;
    case "string_pattern_mismatch":
      return field === "phone_number"
        ? "Enter a 10-digit phone number starting with 0, like 0712345678."
        : "This value isn't in the right format.";
    default:
      return error.msg
        .replace(/^Value error, /, "")
        .replace(/^value is not a valid email address: /, "");
  }
}

function parseValidationErrors(errors) {
  const fieldErrors = {};
  const general = [];
  for (const error of errors) {
    const [source, field] = error.loc;
    if (source === "body" && field !== undefined) {
      fieldErrors[field] ??= friendlyMessage(error, field);
    } else {
      general.push(error.msg);
    }
  }
  return { fieldErrors, general };
}

function toApiError(status, data) {
  if (status === 422 && Array.isArray(data?.detail)) {
    const { fieldErrors, general } = parseValidationErrors(data.detail);
    return new ApiError(status, general.join(" ") || "Please check the highlighted fields.", fieldErrors);
  }
  if (status >= 500) {
    return new ApiError(status, "Something went wrong on the server. Please try again.");
  }
  const detail = typeof data?.detail === "string" ? data.detail : "The request could not be completed.";
  return new ApiError(status, detail);
}

// Pass auth: false for login and register. Their 401s are form errors, not expired sessions.
export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Can't reach the VetLink server. Check that the backend is running and allows this site (CORS).");
  }

  if (response.status === 401 && auth) {
    clearToken();
    location.replace(token ? "login.html?expired=1" : "login.html");
    return new Promise(() => {}); // The page is leaving, so callers never see an error
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) throw toApiError(response.status, data);
  return data;
}

// For records that may not exist yet, like a profile the user hasn't created.
export async function apiOrNull(path) {
  try {
    return await api(path);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}
