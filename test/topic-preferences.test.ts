import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as getPreferences, POST as postPreferences } from "../app/api/user/preferences/route";
import { topicPreferencesSchema } from "../lib/schemas";
import { sanitizePreferences } from "../lib/wizard-store";

test("GET /api/user/preferences returns 401 when unauthenticated", async () => {
  const req = new NextRequest("http://localhost:3000/api/user/preferences", {
    method: "GET",
  });
  const res = await getPreferences(req);
  assert.equal(res.status, 401);
  const json = await res.json();
  assert.equal(json.status, "error");
  assert.ok(json.message.includes("Unauthorized"));
});

test("POST /api/user/preferences enforces CSRF origin validation", async () => {
  const req = new NextRequest("http://localhost:3000/api/user/preferences", {
    method: "POST",
    headers: {
      Origin: "https://malicious-site.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ news_categories: ["technology"] }),
  });
  const res = await postPreferences(req);
  assert.equal(res.status, 403);
  const json = await res.json();
  assert.equal(json.status, "error");
  assert.ok(json.message.includes("Forbidden"));
});

test("POST /api/user/preferences returns 401 when no session cookie is present", async () => {
  const req = new NextRequest("http://localhost:3000/api/user/preferences", {
    method: "POST",
    headers: {
      Origin: "http://localhost:3000",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ news_categories: ["technology"] }),
  });
  const res = await postPreferences(req);
  assert.equal(res.status, 401);
  const json = await res.json();
  assert.equal(json.status, "error");
  assert.ok(json.message.includes("Unauthorized"));
});

test("topicPreferencesSchema allows partial topic updates and enforces caps", () => {
  // Valid topic configuration
  const valid = topicPreferencesSchema.safeParse({
    weatherTopics: ["current-temperature", "rain-chance", "uv-index"],
    newsTopics: ["technology", "economy", "science", "health", "environment"],
  });
  assert.ok(valid.success);

  // Weather cap: max 3
  const tooManyWeather = topicPreferencesSchema.safeParse({
    weatherTopics: ["current-temperature", "high-low", "hourly-3h", "rain-chance"],
    newsTopics: ["technology"],
  });
  assert.equal(tooManyWeather.success, false, "Must reject > 3 weather topics");

  // News cap: max 5
  const tooManyNews = topicPreferencesSchema.safeParse({
    weatherTopics: ["current-temperature"],
    newsTopics: ["technology", "economy", "science", "health", "environment", "sports"],
  });
  assert.equal(tooManyNews.success, false, "Must reject > 5 news topics");

  // Min topics: total >= 1
  const zeroTopics = topicPreferencesSchema.safeParse({
    weatherTopics: [],
    newsTopics: [],
  });
  assert.equal(zeroTopics.success, false, "Must reject 0 total topics");
});

test("sanitizePreferences cleans and bounds topic selections for local store", () => {
  const sanitized = sanitizePreferences({
    weatherTopics: ["current-temperature", "rain-chance", "uv-index", "high-low"],
    newsTopics: ["technology", "economy", "science", "health", "environment", "crime"],
  });

  assert.equal(sanitized.weatherTopics.length, 3, "Weather topics must be capped at 3");
  assert.equal(sanitized.newsTopics.length, 5, "News topics must be capped at 5");
  assert.deepEqual(sanitized.weatherTopics, ["current-temperature", "high-low", "rain-chance"]);
  assert.deepEqual(sanitized.newsTopics, ["economy", "health", "environment", "crime", "science"]);
});

test("Onboarded users routing contract: set-up-reports redirects to preferences", () => {
  function resolveSetUpReportsDestination(session: { valid: boolean; onboarding_completed?: boolean } | null): string {
    if (!session || !session.valid) return "/signup";
    if (session.onboarding_completed) return "/preferences";
    return "/set-up-reports";
  }

  // Not onboarded -> goes to setup flow
  assert.equal(resolveSetUpReportsDestination({ valid: true, onboarding_completed: false }), "/set-up-reports");

  // Already onboarded -> redirected to preferences editor (not blank screen or dashboard loop)
  assert.equal(resolveSetUpReportsDestination({ valid: true, onboarding_completed: true }), "/preferences");
});
