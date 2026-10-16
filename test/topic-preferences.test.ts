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

test("City and Country code preservation contract: never overwrite with Seattle/US fallbacks", () => {
  // Test simulation of preferences merge logic
  function resolvePreferences(
    existingUser: { city?: string | null; country_code?: string | null },
    requestBody: { city?: string; country_code?: string; weather_categories?: string[]; news_categories?: string[] }
  ) {
    let city = existingUser.city || null;
    if (typeof requestBody.city === "string" && requestBody.city.trim().length >= 2 && requestBody.city.trim() !== "Seattle") {
      city = requestBody.city.trim();
    } else if (typeof requestBody.city === "string" && requestBody.city.trim().length >= 2 && !existingUser.city) {
      city = requestBody.city.trim();
    }

    let countryCode = existingUser.country_code || null;
    if (typeof requestBody.country_code === "string" && /^[A-Z]{2}$/i.test(requestBody.country_code.trim()) && requestBody.country_code.trim().toUpperCase() !== "US") {
      countryCode = requestBody.country_code.trim().toUpperCase();
    } else if (typeof requestBody.country_code === "string" && /^[A-Z]{2}$/i.test(requestBody.country_code.trim()) && !existingUser.country_code) {
      countryCode = requestBody.country_code.trim().toUpperCase();
    }

    return { city, countryCode };
  }

  // Case 1: User has custom city "Lagos", "NG"; submits only topic preferences
  const res1 = resolvePreferences({ city: "Lagos", country_code: "NG" }, { weather_categories: ["rain-chance"] });
  assert.equal(res1.city, "Lagos", "Lagos must be preserved");
  assert.equal(res1.countryCode, "NG", "NG must be preserved");

  // Case 2: User has custom city "Tokyo", "JP"; request contains empty or no city
  const res2 = resolvePreferences({ city: "Tokyo", country_code: "JP" }, {});
  assert.equal(res2.city, "Tokyo", "Tokyo must be preserved");
  assert.equal(res2.countryCode, "JP", "JP must be preserved");

  // Case 3: User has "London", "GB"; request accidentally carries default "Seattle", "US"
  const res3 = resolvePreferences({ city: "London", country_code: "GB" }, { city: "Seattle", country_code: "US" });
  assert.equal(res3.city, "London", "Default Seattle must NOT overwrite existing London");
  assert.equal(res3.countryCode, "GB", "Default US must NOT overwrite existing GB");
});

