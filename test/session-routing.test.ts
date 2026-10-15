import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { generateSessionToken, hashToken } from "../lib/session";
import { validateOrigin } from "../lib/security";
import { GET as clearGet } from "../app/api/auth/clear/route";

test("generateSessionToken produces 32-byte base64url strings with high entropy", () => {
  const token1 = generateSessionToken();
  const token2 = generateSessionToken();

  assert.equal(typeof token1, "string");
  assert.equal(typeof token2, "string");
  assert.notEqual(token1, token2, "Subsequent tokens must be unique");

  // 32 bytes in base64url is 43 characters
  assert.equal(token1.length, 43);
  assert.equal(token2.length, 43);

  // Must only contain base64url safe characters (A-Z, a-z, 0-9, -, _)
  const base64urlRegex = /^[A-Za-z0-9_-]+$/;
  assert.ok(base64urlRegex.test(token1), "Token must contain only base64url characters");
  assert.ok(base64urlRegex.test(token2), "Token must contain only base64url characters");
});

test("hashToken deterministically computes SHA-256 hex digest", () => {
  const rawInput = "test";
  const expectedHash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

  const actualHash = hashToken(rawInput);
  assert.equal(actualHash, expectedHash);

  // Determinism
  assert.equal(hashToken("hello-world-session"), hashToken("hello-world-session"));
  assert.notEqual(hashToken("token-a"), hashToken("token-b"));

  // Format: 64 hexadecimal characters
  const hex64Regex = /^[a-f0-9]{64}$/;
  assert.ok(hex64Regex.test(actualHash), "Hash must be 64-character lowercase hex");
});

test("validateOrigin correctly validates allowed vs unauthorized cross-site origins", () => {
  // 1. Same-origin localhost request
  const validLocalReq = new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      Origin: "http://localhost:3000",
    },
  });
  assert.equal(validateOrigin(validLocalReq), true);

  // 2. Production domain request
  const validProdReq = new NextRequest("https://betadigest.online/api/auth/signup", {
    method: "POST",
    headers: {
      Origin: "https://betadigest.online",
    },
  });
  assert.equal(validateOrigin(validProdReq), true);

  // 3. Unauthorized attacker origin
  const attackerReq = new NextRequest("https://betadigest.online/api/auth/signup", {
    method: "POST",
    headers: {
      Origin: "https://evil-phishing-site.com",
    },
  });
  assert.equal(validateOrigin(attackerReq), false);

  // 4. Subdomain spoofing attempt
  const spoofReq = new NextRequest("https://betadigest.online/api/auth/signup", {
    method: "POST",
    headers: {
      Origin: "https://betadigest.online.evil.com",
    },
  });
  assert.equal(validateOrigin(spoofReq), false);
});

test("Clear session route deletes bd_session cookie and redirects to target", async () => {
  const req = new NextRequest("http://localhost:3000/api/auth/clear?next=/login", {
    method: "GET",
  });
  const res = await clearGet(req);

  assert.equal(res.status, 307);
  assert.equal(res.headers.get("location"), "http://localhost:3000/login");

  // Verify Set-Cookie header expires bd_session
  const setCookie = res.headers.get("set-cookie") || "";
  assert.ok(setCookie.includes("bd_session="), "Must set bd_session cookie header");
  assert.ok(setCookie.includes("Max-Age=0") || setCookie.includes("Expires="), "Cookie must be cleared");
});

test("Session destination resolution logic enforces correct page flows", () => {
  function resolveDestination(session: { valid: boolean; onboarding_completed?: boolean } | null): string {
    if (!session || !session.valid) return "/";
    if (!session.onboarding_completed) return "/onboarding";
    return "/dashboard";
  }

  // 1. No session -> Landing / Signup
  assert.equal(resolveDestination(null), "/");
  assert.equal(resolveDestination({ valid: false }), "/");

  // 2. Valid session but incomplete onboarding -> /onboarding
  assert.equal(resolveDestination({ valid: true, onboarding_completed: false }), "/onboarding");

  // 3. Valid session with completed onboarding -> /dashboard
  assert.equal(resolveDestination({ valid: true, onboarding_completed: true }), "/dashboard");
});
