import test from "node:test";
import assert from "node:assert/strict";
import { deriveDigestText } from "../lib/digest-derivation";
import { generateCityWeather, getTop5Stories } from "../lib/mock-service";

test("deriveDigestText outputs clean plain text without emojis for 1 weather topic", () => {
  const city = generateCityWeather("Seattle", "US");
  const result = deriveDigestText({
    city,
    weatherTopics: ["current-temperature"],
    stories: [],
  });

  assert.ok(result.includes("Weather in Seattle:"));
  assert.ok(result.includes("°F"));
  // No emojis
  const emojiRegex = /\p{Extended_Pictographic}/u;
  assert.equal(emojiRegex.test(result), false);
});

test("deriveDigestText supports 1 news topic only", () => {
  const city = generateCityWeather("Tokyo", "JP");
  const stories = getTop5Stories(["technology"]);
  const result = deriveDigestText({
    city,
    weatherTopics: [],
    stories,
  });

  assert.ok(result.includes("Weather in Tokyo:"));
  assert.ok(result.includes("Top stories:"));
  const emojiRegex = /\p{Extended_Pictographic}/u;
  assert.equal(emojiRegex.test(result), false);
});

test("deriveDigestText handles maximum 8 topics (3 weather + 5 news)", () => {
  const city = generateCityWeather("Seattle", "US");
  const stories = getTop5Stories(["economy", "technology", "science", "health", "environment"]);
  const result = deriveDigestText({
    city,
    weatherTopics: ["current-temperature", "rain-chance", "uv-index"],
    stories,
  });

  assert.ok(result.includes("Weather in Seattle:"));
  assert.ok(result.includes("Rain chance"));
  assert.ok(result.includes("UV index"));
  assert.ok(result.includes("Top stories:"));

  const emojiRegex = /\p{Extended_Pictographic}/u;
  assert.equal(emojiRegex.test(result), false);
});

test("deriveDigestText always respects WEATHER_TOPIC_ORDER regardless of selection order", () => {
  const city = generateCityWeather("London", "GB");
  // Pass in reverse order: uv-index, rain-chance, current-temperature
  const result = deriveDigestText({
    city,
    weatherTopics: ["uv-index", "rain-chance", "current-temperature"],
    stories: [],
  });

  const currentIdx = result.indexOf("Weather in London:");
  const rainIdx = result.indexOf("Rain chance");
  const uvIdx = result.indexOf("UV index");

  assert.ok(currentIdx < rainIdx);
  assert.ok(rainIdx < uvIdx);
});
