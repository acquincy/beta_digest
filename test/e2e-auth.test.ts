import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST as signupPost } from "../app/api/auth/signup/route";
import { GET as verifyGet } from "../app/api/auth/verify/route";

test("Signup and Verify flow end-to-end", async () => {
  const email = `test-${Date.now()}@example.com`;
  const signupReq = new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  assert.ok(signupData.token);
  assert.ok(signupData.verification_url);

  // Now verify with the returned token
  const verifyUrl = `http://localhost:3000/api/auth/verify?token=${signupData.token}`;
  const verifyReq = new NextRequest(verifyUrl, { method: "GET" });
  const verifyRes = await verifyGet(verifyReq);
  assert.equal(verifyRes.status, 200);
  const verifyData = await verifyRes.json();
  assert.equal(verifyData.status, "success");
  assert.equal(verifyData.verified, true);
});

test("Re-signing up with duplicate email still verifies successfully", async () => {
  const existingEmail = "duplicate-test@example.com";

  // First signup
  const req1 = new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: existingEmail, name: "First" }),
  });
  const res1 = await signupPost(req1);
  const data1 = await res1.json();

  // Second signup with same email
  const req2 = new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: existingEmail, name: "Second" }),
  });
  const res2 = await signupPost(req2);
  assert.equal(res2.status, 200);
  const data2 = await res2.json();
  assert.ok(data2.token);

  // Verifying with token2 MUST succeed (not fail with 400!)
  const verifyReq2 = new NextRequest(`http://localhost:3000/api/auth/verify?token=${data2.token}`, {
    method: "GET",
  });
  const verifyRes2 = await verifyGet(verifyReq2);
  assert.equal(verifyRes2.status, 200);
  const verifyData2 = await verifyRes2.json();
  assert.equal(verifyData2.status, "success");
  assert.equal(verifyData2.verified, true);
});
