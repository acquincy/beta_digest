import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST as signupPost } from "../app/api/auth/signup/route";
import { GET as verifyGet, POST as verifyPost } from "../app/api/auth/verify/route";

test("Signup endpoint returns generic success and NEVER leaks token or URL", async () => {
  const email = `test-${Date.now()}@example.com`;
  const signupReq = new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({
      email,
      name: "Verification Tester",
      city: "London",
      country_code: "GB",
    }),
  });

  const signupRes = await signupPost(signupReq);
  assert.equal(signupRes.status, 200);
  const signupData = await signupRes.json();
  assert.equal(signupData.status, "success");

  // CRITICAL SECURITY ASSERTIONS: Never leak tokens or URLs to the browser
  assert.equal(signupData.token, undefined, "Signup must not return raw or hashed token");
  assert.equal(signupData.verification_url, undefined, "Signup must not return verification URL");
});

test("Verification GET redirects to UI and never executes state-changing verification", async () => {
  // 1. Browser GET navigation to /api/auth/verify with token redirects (307) to /verify UI
  const testToken = "test-verification-token-xyz";
  const browserNavReq = new NextRequest(
    `http://localhost:3000/api/auth/verify?token=${testToken}`,
    {
      method: "GET",
      headers: { Accept: "text/html,application/xhtml+xml" },
    }
  );
  const browserNavRes = await verifyGet(browserNavReq);
  assert.equal(browserNavRes.status, 307);
  assert.ok(browserNavRes.headers.get("location")?.includes(`/verify?token=${testToken}`));

  // 2. Browser GET without token returns 405 Method Not Allowed
  const noTokenReq = new NextRequest("http://localhost:3000/api/auth/verify", {
    method: "GET",
  });
  const noTokenRes = await verifyGet(noTokenReq);
  assert.equal(noTokenRes.status, 405);
});

test("Verification POST rejects missing token or invalid origin", async () => {
  // 1. Missing token
  const badReq = new NextRequest("http://localhost:3000/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({}),
  });
  const badRes = await verifyPost(badReq);
  assert.equal(badRes.status, 400);

  // 2. Forbidden cross-site origin
  const forbiddenReq = new NextRequest("http://localhost:3000/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://evil-attacker.com",
    },
    body: JSON.stringify({ token: "some-token" }),
  });
  const forbiddenRes = await verifyPost(forbiddenReq);
  assert.equal(forbiddenRes.status, 403);
});
