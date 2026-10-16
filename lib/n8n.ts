/**
 * Server and Client Communication Layer for Beta Digest
 * - Server: calls n8n v2 webhooks with header-auth secret and 3-second timeout.
 * - Client: calls the site's own /api routes only.
 */

// Server-only environment variables (never exposed to client)
export const N8N_BASE_URL = (
  process.env.N8N_BASE_URL ||
  "https://n8n.srv1650803.hstgr.cloud"
).replace(/\/+$/, "");

export const N8N_SHARED_SECRET = process.env.N8N_SHARED_SECRET || "";

export const N8N_TIMEOUT_MS = 3000;

export const N8N_ENDPOINTS = {
  get signup(): string {
    return (
      process.env["AUTH/SIGNUP_URL"] ||
      process.env["AUTH_SIGNUP_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/auth/signup`
    );
  },
  get verify(): string {
    return (
      process.env["AUTH/VERIFY_URL"] ||
      process.env["AUTH_VERIFY_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/auth/verify`
    );
  },
  get sessionResolve(): string {
    return (
      process.env["SESSION_RESOLVE_URL"] ||
      process.env["SESSION/RESOLVE_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/session/resolve`
    );
  },
  get preferences(): string {
    return (
      process.env["USER/PREFERENCES_URL"] ||
      process.env["USER_PREFERENCES_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/user/preferences`
    );
  },
  get dashboard(): string {
    return (
      process.env["DASHBOARD_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/digest/dashboard`
    );
  },
  get sendLink(): string {
    return (
      process.env["AUTH_SEND_LINK_URL"] ||
      process.env["AUTH/SEND_LINK_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/auth/send-link`
    );
  },
  get logout(): string {
    return (
      process.env["AUTH_LOGOUT_URL"] ||
      process.env["AUTH/LOGOUT_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/auth/logout`
    );
  },
  get sendHourly(): string {
    return (
      process.env["DIGEST_SEND_HOURLY_URL"] ||
      process.env["DIGEST/SEND_HOURLY_URL"] ||
      `${N8N_BASE_URL}/webhook/v2/digest/send-hourly`
    );
  },
};

function getN8nHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (N8N_SHARED_SECRET) {
    headers["Authorization"] = N8N_SHARED_SECRET;
    headers["X-N8N-Shared-Secret"] = N8N_SHARED_SECRET;
    headers["x-n8n-shared-secret"] = N8N_SHARED_SECRET;
  }
  return headers;
}

// -----------------------------------------------------------------------------
// SERVER-TO-N8N CALLS (Must only be called from server route handlers / server actions)
// -----------------------------------------------------------------------------

export async function n8nSignup(payload: {
  email: string;
  name?: string;
  city?: string;
  country_code?: string;
  news_categories?: string[];
  weather_categories?: string[];
  send_time?: string;
}): Promise<Response> {
  return fetch(N8N_ENDPOINTS.signup, {
    method: "POST",
    headers: getN8nHeaders(),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
}

export async function n8nVerify(payload: {
  token: string;
  session_token_hash: string;
  user_agent?: string;
}): Promise<Response> {
  return fetch(N8N_ENDPOINTS.verify, {
    method: "POST",
    headers: getN8nHeaders(),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
}

export async function n8nResolveSession(sessionTokenHash: string): Promise<Response> {
  return fetch(N8N_ENDPOINTS.sessionResolve, {
    method: "POST",
    headers: getN8nHeaders(),
    body: JSON.stringify({ session_token_hash: sessionTokenHash }),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
}

export async function n8nUpdatePreferences(payload: {
  session_token_hash: string;
  city?: string;
  country_code?: string;
  news_categories?: string[];
  weather_categories?: string[];
  send_time?: string;
}): Promise<Response> {
  return fetch(N8N_ENDPOINTS.preferences, {
    method: "POST",
    headers: getN8nHeaders(),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
}

export async function n8nFetchDashboard(sessionTokenHash: string): Promise<Response> {
  return fetch(N8N_ENDPOINTS.dashboard, {
    method: "POST",
    headers: getN8nHeaders(),
    body: JSON.stringify({ session_token_hash: sessionTokenHash }),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
}

export async function n8nSendLink(email: string): Promise<Response> {
  return fetch(N8N_ENDPOINTS.sendLink, {
    method: "POST",
    headers: getN8nHeaders(),
    body: JSON.stringify({ email }),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
}

export async function n8nLogout(sessionTokenHash: string): Promise<Response> {
  return fetch(N8N_ENDPOINTS.logout, {
    method: "POST",
    headers: getN8nHeaders(),
    body: JSON.stringify({ session_token_hash: sessionTokenHash }),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
}

// -----------------------------------------------------------------------------
// CLIENT-TO-INTERNAL-API CALLS (Called from browser UI components)
// -----------------------------------------------------------------------------

export interface SignupInput {
  email: string;
  name?: string;
  city?: string;
  country_code?: string;
  news_categories?: string[];
  weather_categories?: string[];
  send_time?: string;
  delivery_hour?: number;
}

export interface GenericApiResult {
  status: "success" | "error";
  message: string;
  destination?: string;
}

export async function signupViaApi(payload: SignupInput): Promise<GenericApiResult> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Signup failed with HTTP ${res.status}`);
  }
  return data;
}

export async function verifyViaApi(token: string): Promise<{
  success: boolean;
  onboarding_completed?: boolean;
  destination?: string;
  error?: string;
}> {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Verification failed with HTTP ${res.status}`);
  }
  return data;
}

export async function sendSignInLinkViaApi(email: string): Promise<GenericApiResult> {
  const res = await fetch("/api/auth/send-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Sign-in link dispatch failed with HTTP ${res.status}`);
  }
  return data;
}

export async function savePreferencesViaApi(payload: {
  city: string;
  country_code: string;
  news_categories?: string[];
  weather_categories?: string[];
  send_time?: string;
  delivery_hour?: number;
  email?: string;
  categories?: string[];
}): Promise<GenericApiResult> {
  const res = await fetch("/api/user/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Preferences update failed with HTTP ${res.status}`);
  }
  return data;
}

export async function logoutViaApi(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  }).catch(() => {});
  window.location.href = "/";
}

export interface N8nDashboardArticle {
  category?: string;
  title?: string;
  summary?: string;
  source?: string;
  published_at?: string;
  url?: string;
}

export interface N8nDashboardResult {
  weather?: {
    summary?: string;
    temperature?: number;
    high?: number;
    low?: number;
    rain_chance?: number;
    uv_index?: number;
    air_quality?: number;
  };
  weekly_digest?:
    | string
    | {
        summary?: string;
        articles?: N8nDashboardArticle[];
      };
  [key: string]: unknown;
}

export async function fetchDashboardViaApi(): Promise<N8nDashboardResult | null> {
  const res = await fetch("/api/digest/dashboard");
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

// Backwards-compatibility aliases for existing component imports
export const signupViaN8n = signupViaApi;
export const verifyViaN8n = verifyViaApi;
export const savePreferencesViaN8n = savePreferencesViaApi;
export const fetchDashboardViaN8n = fetchDashboardViaApi;
