import test from "node:test";
import assert from "node:assert/strict";
import { fetchCityWeatherDataLive, geocodeCity } from "../services/weather";
import { getTop5StoriesLive, fetchStoriesForTopic } from "../services/news";
import { tokenStore } from "../lib/token-store";

test("geocodeCity returns valid geographic coordinates for cities", async () => {
  const results = await geocodeCity("London");
  assert.ok(Array.isArray(results));
  if (results.length > 0) {
    assert.ok(typeof results[0].latitude === "number");
    assert.ok(typeof results[0].longitude === "number");
    assert.ok(results[0].name.toLowerCase().includes("london"));
  }
});

test("fetchCityWeatherDataLive returns complete CityWeatherData structure", async () => {
  const weather = await fetchCityWeatherDataLive("London", "GB");
  assert.equal(weather.city, "London");
  assert.equal(weather.tempUnit, "°C");
  assert.ok(typeof weather.currentTemp === "number");
  assert.ok(typeof weather.high === "number");
  assert.ok(typeof weather.low === "number");
  assert.ok(typeof weather.humidity === "number");
  assert.ok(Array.isArray(weather.hourly));
  assert.ok(Array.isArray(weather.threeDay));
});

test("fetchStoriesForTopic retrieves live stories with headlines and links", async () => {
  const stories = await fetchStoriesForTopic("technology");
  assert.ok(Array.isArray(stories));
  if (stories.length > 0) {
    assert.ok(stories[0].headline.length > 0);
    assert.ok(stories[0].url.length > 0);
    assert.equal(stories[0].topic, "technology");
  }
});

test("getTop5StoriesLive returns up to 5 curated stories across topics", async () => {
  const stories = await getTop5StoriesLive(["technology", "economy", "science"]);
  assert.ok(Array.isArray(stories));
  assert.ok(stories.length <= 5);
  for (const s of stories) {
    assert.ok(s.headline.length > 0);
    assert.ok(s.topic.length > 0);
  }
});

test("tokenStore reliably caches and retrieves auth verification records", () => {
  const testToken = "test-token-" + Date.now();
  tokenStore.set(testToken, {
    email: "user@example.com",
    name: "User",
    expiresAt: Date.now() + 60000,
  });

  const record = tokenStore.get(testToken);
  assert.ok(record);
  assert.equal(record.email, "user@example.com");
  assert.equal(record.name, "User");
});
