import test from "node:test";
import assert from "node:assert/strict";
import { preferencesSchema } from "../lib/schemas";
import { sanitizePreferences, INITIAL_PREFERENCES } from "../lib/wizard-store";

test("preferencesSchema validates a valid preference payload", () => {
  const valid = preferencesSchema.safeParse({
    name: "Alex",
    email: "alex@example.com",
    countryCode: "US",
    city: "Seattle",
    cityIsCustom: false,
    deliveryHour: 7,
    weatherTopics: ["current-temperature", "rain-chance", "uv-index"],
    newsTopics: ["economy", "technology", "science", "health", "environment"],
  });

  assert.equal(valid.success, true);
});

test("preferencesSchema enforces weather cap of 3 topics", () => {
  const overCap = preferencesSchema.safeParse({
    name: "Alex",
    email: "alex@example.com",
    countryCode: "US",
    city: "Seattle",
    cityIsCustom: false,
    deliveryHour: 7,
    weatherTopics: ["current-temperature", "high-low", "rain-chance", "uv-index"],
    newsTopics: ["economy"],
  });

  assert.equal(overCap.success, false);
});

test("preferencesSchema enforces news cap of 5 topics", () => {
  const overCap = preferencesSchema.safeParse({
    name: "Alex",
    email: "alex@example.com",
    countryCode: "US",
    city: "Seattle",
    cityIsCustom: false,
    deliveryHour: 7,
    weatherTopics: ["current-temperature"],
    newsTopics: ["economy", "technology", "science", "health", "environment", "politics"],
  });

  assert.equal(overCap.success, false);
});

test("preferencesSchema requires at least 1 topic in total", () => {
  const zeroTopics = preferencesSchema.safeParse({
    name: "Alex",
    email: "alex@example.com",
    countryCode: "US",
    city: "Seattle",
    cityIsCustom: false,
    deliveryHour: 7,
    weatherTopics: [],
    newsTopics: [],
  });

  assert.equal(zeroTopics.success, false);

  const weatherOnly = preferencesSchema.safeParse({
    name: "Alex",
    email: "alex@example.com",
    countryCode: "US",
    city: "Seattle",
    cityIsCustom: false,
    deliveryHour: 7,
    weatherTopics: ["current-temperature"],
    newsTopics: [],
  });

  assert.equal(weatherOnly.success, true);

  const newsOnly = preferencesSchema.safeParse({
    name: "Alex",
    email: "alex@example.com",
    countryCode: "US",
    city: "Seattle",
    cityIsCustom: false,
    deliveryHour: 7,
    weatherTopics: [],
    newsTopics: ["economy"],
  });

  assert.equal(newsOnly.success, true);
});

test("preferencesSchema validates deliveryHour within 0-23 range", () => {
  const valid0 = preferencesSchema.safeParse({
    ...INITIAL_PREFERENCES,
    deliveryHour: 0,
  });
  assert.equal(valid0.success, true);

  const valid23 = preferencesSchema.safeParse({
    ...INITIAL_PREFERENCES,
    deliveryHour: 23,
  });
  assert.equal(valid23.success, true);

  const invalidNegative = preferencesSchema.safeParse({
    ...INITIAL_PREFERENCES,
    deliveryHour: -1,
  });
  assert.equal(invalidNegative.success, false);

  const invalid24 = preferencesSchema.safeParse({
    ...INITIAL_PREFERENCES,
    deliveryHour: 24,
  });
  assert.equal(invalid24.success, false);
});

test("sanitizePreferences cleans legacy fields, unknown topics, and enforces caps", () => {
  const legacyData = {
    name: "Jordan",
    email: "jordan@example.com",
    channel: "sms",
    phone: "2065551234",
    dialCode: "+1",
    zipCode: "98101",
    sportsConfig: { teams: ["Lakers"] },
    stocksConfig: { symbols: ["AAPL"] },
    horoscopeConfig: { sign: "Aries" },
    weatherTopics: [
      "current-temperature",
      "rain-chance",
      "uv-index",
      "wind",
      "unknown-weather-metric",
    ],
    newsTopics: [
      "economy",
      "technology",
      "science",
      "health",
      "environment",
      "politics",
      "fake-news-topic",
    ],
  };

  const sanitized = sanitizePreferences(legacyData);

  // Legacy fields are dropped
  assert.equal("channel" in sanitized, false);
  assert.equal("phone" in sanitized, false);
  assert.equal("zipCode" in sanitized, false);
  assert.equal("sportsConfig" in sanitized, false);

  // Weather capped at 3 and unknown removed
  assert.equal(sanitized.weatherTopics.length, 3);
  assert.ok(!(sanitized.weatherTopics as string[]).includes("unknown-weather-metric"));

  // News capped at 5 and unknown removed
  assert.equal(sanitized.newsTopics.length, 5);
  assert.ok(!(sanitized.newsTopics as string[]).includes("fake-news-topic"));
});
