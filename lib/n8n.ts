/**
 * n8n Instance Integration Client for Beta Digest
 * Connected to instance: https://n8n.srv1650803.hstgr.cloud
 */

export const N8N_BASE_URL =
  process.env.N8N_BASE_URL ||
  process.env.NEXT_PUBLIC_N8N_BASE_URL ||
  "https://n8n.srv1650803.hstgr.cloud";

export const N8N_ENDPOINTS = {
  get signup(): string {
    return (
      process.env["AUTH/SIGNUP_URL"] ||
      process.env.AUTH_SIGNUP_URL ||
      process.env.NEXT_PUBLIC_AUTH_SIGNUP_URL ||
      `${N8N_BASE_URL}/webhook/auth/signup`
    );
  },
  get verify(): string {
    return (
      process.env["AUTH/VERIFY_URL"] ||
      process.env.AUTH_VERIFY_URL ||
      process.env.NEXT_PUBLIC_AUTH_VERIFY_URL ||
      `${N8N_BASE_URL}/webhook/auth/verify`
    );
  },
  get preferences(): string {
    return (
      process.env["USER/PREFERENCES_URL"] ||
      process.env.USER_PREFERENCES_URL ||
      process.env.NEXT_PUBLIC_USER_PREFERENCES_URL ||
      `${N8N_BASE_URL}/webhook/user/preferences`
    );
  },
  get dashboard(): string {
    return (
      process.env.DASHBOARD_URL ||
      process.env.NEXT_PUBLIC_DASHBOARD_URL ||
      `${N8N_BASE_URL}/webhook/digest/dashboard`
    );
  },
};

export interface N8nSignupPayload {
  email: string;
  name?: string;
  city?: string;
  country_code?: string;
  frontend_url?: string;
}

export interface N8nSignupResult {
  status: "success" | "error";
  message: string;
  token?: string;
  verification_url?: string;
}

export interface N8nVerifyResult {
  status: "success" | "error";
  verified?: boolean;
  userId?: string;
  message: string;
}

export interface N8nPreferencesPayload {
  email?: string;
  userId?: string;
  city: string;
  country_code: string;
  categories: string[];
}

export interface N8nPreferencesResult {
  status: "success" | "error";
  message: string;
}

export interface N8nDashboardResult {
  weather?: {
    city?: string;
    temp?: number;
    feels_like?: number;
    condition?: string;
    humidity?: number;
  };
  weekly_digest?: string;
  generated_at?: string;
}

/**
 * Trigger account creation & verification email dispatch via n8n
 */
export async function signupViaN8n(payload: N8nSignupPayload): Promise<N8nSignupResult> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Signup failed with status ${res.status}`);
  }
  return data;
}

/**
 * Verify user token against n8n workflow
 */
export async function verifyViaN8n(token: string): Promise<N8nVerifyResult> {
  const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Verification failed with status ${res.status}`);
  }
  return data;
}

/**
 * Sync topics and location to n8n user profile
 */
export async function savePreferencesViaN8n(
  payload: N8nPreferencesPayload
): Promise<N8nPreferencesResult> {
  const res = await fetch("/api/user/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Preferences update failed with status ${res.status}`);
  }
  return data;
}

/**
 * Fetch live generated digest from n8n
 */
export async function fetchDashboardViaN8n(): Promise<N8nDashboardResult> {
  const res = await fetch("/api/digest/dashboard");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Dashboard fetch failed with status ${res.status}`);
  }
  return data;
}
