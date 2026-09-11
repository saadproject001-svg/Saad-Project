import { supabase } from "./supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const ACTIVE_ORG_KEY = "activeOrgId";

// Endpoints that resolve org membership itself (or run before any org context
// exists) never need X-Organization-Id — sending it would be meaningless, and for
// /organizations it would be actively wrong (that header names the org you're
// ALREADY a member of, not the one you're about to create/list).
const ORG_HEADER_EXEMPT = ["/organizations", "/organizations/me", "/users/me", "/auth/session-touch", "/auth/accept-invite"];

function needsOrgHeader(path) {
  const [bare] = path.split("?");
  return !ORG_HEADER_EXEMPT.includes(bare);
}

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let signingOut = false;

async function request(path, { method = "GET", body } = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = { "Content-Type": "application/json" };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  if (needsOrgHeader(path)) {
    const activeOrgId = localStorage.getItem(ACTIVE_ORG_KEY);
    if (activeOrgId) headers["X-Organization-Id"] = activeOrgId;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    // A 401 here means Supabase's token is stale/invalid from the backend's point
    // of view (expired, or the user was deleted) — not a normal "not logged in"
    // state, which RequireAuth already handles before any fetch happens. Force a
    // clean sign-out rather than leaving the app stuck retrying with a dead token.
    if (response.status === 401 && !signingOut) {
      signingOut = true;
      await supabase.auth.signOut();
      window.location.assign("/login");
    }
    const err = payload?.error;
    throw new ApiError(response.status, err?.code ?? "UnknownError", err?.message ?? response.statusText, err?.details);
  }

  return payload;
}

export const apiClient = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export function getActiveOrgId() {
  return localStorage.getItem(ACTIVE_ORG_KEY);
}

export function setActiveOrgId(orgId) {
  if (orgId) localStorage.setItem(ACTIVE_ORG_KEY, orgId);
  else localStorage.removeItem(ACTIVE_ORG_KEY);
}
