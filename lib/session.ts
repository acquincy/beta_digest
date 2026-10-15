import crypto from "crypto";
import { cookies } from "next/headers";
import { n8nResolveSession } from "./n8n";

export const BD_SESSION_COOKIE = "bd_session";
export const BD_SESSION_MAX_AGE = 400 * 24 * 60 * 60; // 400 days in seconds

/**
 * Generate a 32-byte secure session token in base64url encoding (server-only).
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * SHA-256 hash helper for session and verification tokens.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export type SessionResolutionResult =
  | { status: "unauthenticated"; session: null }
  | { status: "invalid"; session: null }
  | {
      status: "authenticated";
      session: {
        rawToken: string;
        tokenHash: string;
        onboardingCompleted: boolean;
      };
    }
  | {
      status: "error";
      session: {
        rawToken: string;
        tokenHash: string;
      };
      error: string;
    };

/**
 * Server-only helper to read and validate the session cookie against n8n.
 * 401 means invalid session.
 * 5xx, timeout, or network error means n8n is unavailable: do NOT clear the cookie.
 */
export async function getSession(): Promise<SessionResolutionResult> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(BD_SESSION_COOKIE)?.value;

  if (!sessionCookie || typeof sessionCookie !== "string" || sessionCookie.trim().length === 0) {
    return { status: "unauthenticated", session: null };
  }

  const rawToken = sessionCookie.trim();
  const tokenHash = hashToken(rawToken);

  try {
    const res = await n8nResolveSession(tokenHash);
    if (!res.ok) {
      if (res.status === 401) {
        return { status: "invalid", session: null };
      }
      return {
        status: "error",
        session: { rawToken, tokenHash },
        error: `n8n responded with status ${res.status}`,
      };
    }

    const data = await res.json().catch(() => ({}));
    if (data && data.valid === true) {
      return {
        status: "authenticated",
        session: {
          rawToken,
          tokenHash,
          onboardingCompleted: Boolean(data.onboarding_completed),
        },
      };
    }

    return { status: "invalid", session: null };
  } catch (err: unknown) {
    // Network error or timeout: do not invalidate the cookie
    return {
      status: "error",
      session: { rawToken, tokenHash },
      error: err instanceof Error ? err.message : "n8n_unavailable",
    };
  }
}
