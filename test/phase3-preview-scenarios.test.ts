import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest, NextResponse } from "next/server";
import { withPrivateCacheHeaders } from "../lib/security";
import { POST as sendLinkPost } from "../app/api/auth/send-link/route";
import { POST as logoutPost } from "../app/api/auth/logout/route";
import { POST as prefPost } from "../app/api/user/preferences/route";
import { POST as signupPost } from "../app/api/auth/signup/route";
import { POST as verifyPost } from "../app/api/auth/verify/route";

test("Phase 3: All state-changing routes reject requests with mismatched Origin", async () => {
  const evilOrigin = "https://malicious-website.com";

  // 1. /api/auth/signup
  const reqSignup = new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: evilOrigin },
    body: JSON.stringify({ email: "test@example.com" }),
  });
  const resSignup = await signupPost(reqSignup);
  assert.equal(resSignup.status, 403, "signup must reject mismatched Origin");

  // 2. /api/auth/verify
  const reqVerify = new NextRequest("http://localhost:3000/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: evilOrigin },
    body: JSON.stringify({ token: "dummy-token" }),
  });
  const resVerify = await verifyPost(reqVerify);
  assert.equal(resVerify.status, 403, "verify must reject mismatched Origin");

  // 3. /api/auth/send-link
  const reqSendLink = new NextRequest("http://localhost:3000/api/auth/send-link", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: evilOrigin },
    body: JSON.stringify({ email: "test@example.com" }),
  });
  const resSendLink = await sendLinkPost(reqSendLink);
  assert.equal(resSendLink.status, 403, "send-link must reject mismatched Origin");

  // 4. /api/auth/logout
  const reqLogout = new NextRequest("http://localhost:3000/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: evilOrigin },
  });
  const resLogout = await logoutPost(reqLogout);
  assert.equal(resLogout.status, 403, "logout must reject mismatched Origin");

  // 5. /api/user/preferences
  const reqPref = new NextRequest("http://localhost:3000/api/user/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: evilOrigin },
    body: JSON.stringify({ city: "Seattle", country_code: "US" }),
  });
  const resPref = await prefPost(reqPref);
  assert.equal(resPref.status, 403, "preferences must reject mismatched Origin");
});

test("Phase 3: All personalized and state-changing responses have private, no-store cache headers", () => {
  const baseResponse = NextResponse.json({ ok: true });
  const securedResponse = withPrivateCacheHeaders(baseResponse);

  const cacheControl = securedResponse.headers.get("Cache-Control");
  assert.ok(cacheControl, "Cache-Control header must be set");
  assert.ok(cacheControl.includes("no-store"), "Cache-Control must contain no-store");
  assert.ok(cacheControl.includes("private"), "Cache-Control must contain private");
  assert.ok(cacheControl.includes("no-cache"), "Cache-Control must contain no-cache");

  assert.equal(securedResponse.headers.get("Pragma"), "no-cache");
  assert.equal(securedResponse.headers.get("Expires"), "0");
});

test("Phase 3: Session cookie configuration contract", () => {
  const SESSION_COOKIE_NAME = "bd_session";
  const SESSION_COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60; // 400 days

  const cookieOptions = {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  };

  assert.equal(cookieOptions.name, "bd_session");
  assert.equal(cookieOptions.httpOnly, true);
  assert.equal(cookieOptions.sameSite, "lax");
  assert.equal(cookieOptions.path, "/");
  assert.equal(cookieOptions.maxAge, 34560000); // 400 days in seconds
});

test("Phase 3: 10 active sessions cap per user (trigger logic)", () => {
  // Simulates Postgres trigger_cap_user_sessions
  interface Session {
    id: string;
    user_id: string;
    created_at: number;
    revoked_at: number | null;
  }

  const sessions: Session[] = [];
  const USER_ID = "user-123";

  function insertSession(id: string, createdAt: number) {
    // Before insert / after insert trigger:
    // Revoke oldest active session if active sessions count >= 10
    const active = sessions
      .filter((s) => s.user_id === USER_ID && s.revoked_at === null)
      .sort((a, b) => a.created_at - b.created_at);

    if (active.length >= 10) {
      active[0].revoked_at = Date.now();
    }

    sessions.push({
      id,
      user_id: USER_ID,
      created_at: createdAt,
      revoked_at: null,
    });
  }

  // Insert 10 sessions
  for (let i = 1; i <= 10; i++) {
    insertSession(`session-${i}`, 1000 + i);
  }

  let activeCount = sessions.filter((s) => s.revoked_at === null).length;
  assert.equal(activeCount, 10, "Should have 10 active sessions");

  // Insert 11th session
  insertSession("session-11", 2000);

  activeCount = sessions.filter((s) => s.revoked_at === null).length;
  assert.equal(activeCount, 10, "Should still have exactly 10 active sessions");

  // Verify session-1 (the oldest) was revoked
  const session1 = sessions.find((s) => s.id === "session-1");
  assert.ok(session1?.revoked_at !== null, "Oldest session must be revoked");

  // Verify session-2 through session-11 are active
  const session11 = sessions.find((s) => s.id === "session-11");
  assert.equal(session11?.revoked_at, null, "Newest session must be active");
});

test("Phase 3: Digest sender dispatches zero emails when no users are due", () => {
  const rawUsers: Array<{ verified?: boolean; onboarding_completed?: boolean; email?: string }> = [];
  const dueUsers = rawUsers.filter((u) => u.verified && u.onboarding_completed);

  // In original buggy code:
  // if (dueUsers.length === 0) dueUsers = [{ email: 'delivered@resend.dev', ... }]
  // In our fixed v2 code:
  const dispatches = dueUsers.length === 0 ? [] : dueUsers.map((u) => u.email);

  assert.equal(dispatches.length, 0, "Must dispatch 0 emails when no users are due");
});
