import test from "node:test";
import assert from "node:assert/strict";
import { N8N_ENDPOINTS, N8N_BASE_URL } from "../lib/n8n";

test("N8N_BASE_URL defaults correctly", () => {
  assert.ok(N8N_BASE_URL.includes("https://n8n.srv1650803.hstgr.cloud"));
});

test("N8N_ENDPOINTS provides valid URLs for all workflows", () => {
  assert.ok(N8N_ENDPOINTS.signup.endsWith("/webhook/auth/signup"));
  assert.ok(N8N_ENDPOINTS.verify.endsWith("/webhook/auth/verify"));
  assert.ok(N8N_ENDPOINTS.preferences.endsWith("/webhook/user/preferences"));
  assert.ok(N8N_ENDPOINTS.dashboard.endsWith("/webhook/digest/dashboard"));
});

test("N8N_ENDPOINTS respects environment variables dynamically", () => {
  const originalSignup = process.env["AUTH_SIGNUP_URL"];
  const originalSlashSignup = process.env["AUTH/SIGNUP_URL"];
  const originalVerify = process.env["AUTH_VERIFY_URL"];
  const originalPref = process.env["USER_PREFERENCES_URL"];
  const originalDashboard = process.env["DASHBOARD_URL"];

  try {
    process.env["AUTH_SIGNUP_URL"] = "https://custom-n8n.domain/webhook/custom-signup";
    process.env["AUTH/VERIFY_URL"] = "https://custom-n8n.domain/webhook/custom-verify";
    process.env["USER/PREFERENCES_URL"] = "https://custom-n8n.domain/webhook/custom-pref";
    process.env["DASHBOARD_URL"] = "https://custom-n8n.domain/webhook/custom-dashboard";

    assert.equal(N8N_ENDPOINTS.signup, "https://custom-n8n.domain/webhook/custom-signup");
    assert.equal(N8N_ENDPOINTS.verify, "https://custom-n8n.domain/webhook/custom-verify");
    assert.equal(N8N_ENDPOINTS.preferences, "https://custom-n8n.domain/webhook/custom-pref");
    assert.equal(N8N_ENDPOINTS.dashboard, "https://custom-n8n.domain/webhook/custom-dashboard");

    // Test slash-notation precedence if present
    process.env["AUTH/SIGNUP_URL"] = "https://custom-slash.domain/webhook/auth/signup";
    assert.equal(N8N_ENDPOINTS.signup, "https://custom-slash.domain/webhook/auth/signup");
  } finally {
    if (originalSignup !== undefined) process.env["AUTH_SIGNUP_URL"] = originalSignup;
    else delete process.env["AUTH_SIGNUP_URL"];

    if (originalSlashSignup !== undefined) process.env["AUTH/SIGNUP_URL"] = originalSlashSignup;
    else delete process.env["AUTH/SIGNUP_URL"];

    if (originalVerify !== undefined) process.env["AUTH_VERIFY_URL"] = originalVerify;
    else delete process.env["AUTH_VERIFY_URL"];

    if (originalPref !== undefined) process.env["USER_PREFERENCES_URL"] = originalPref;
    else delete process.env["USER_PREFERENCES_URL"];

    if (originalDashboard !== undefined) process.env["DASHBOARD_URL"] = originalDashboard;
    else delete process.env["DASHBOARD_URL"];
  }
});
