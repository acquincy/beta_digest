import test from "node:test";
import assert from "node:assert/strict";
import { deriveDigestText } from "../lib/digest-derivation";
import { MOCK_CITIES, MOCK_STORIES } from "../lib/mock-service";

test("deriveDigestText outputs baseline greeting and condition", () => {
  const city = MOCK_CITIES.Seattle;
  const result = deriveDigestText({
    city,
    activeMetrics: [],
    stories: [],
  });

  assert.equal(result, "Good morning. 52°F, partly cloudy.");
});

test("deriveDigestText includes High/Low when high_low metric is active", () => {
  const city = MOCK_CITIES.Seattle;
  const result = deriveDigestText({
    city,
    activeMetrics: ["high_low"],
    stories: [],
  });

  assert.ok(result.includes("High 58 / Low 45."));
  assert.ok(!result.includes("UV"));
  assert.ok(!result.includes("Air quality"));
});

test("deriveDigestText dynamically updates when metrics are toggled", () => {
  const city = MOCK_CITIES.London;
  const metricsWithRain = deriveDigestText({
    city,
    activeMetrics: ["high_low", "rain_prob"],
    stories: [],
  });

  assert.ok(metricsWithRain.includes("High 17 / Low 11."));
  assert.ok(metricsWithRain.includes("Rain 60% before noon."));
  assert.ok(!metricsWithRain.includes("Wind"));

  const metricsWithWind = deriveDigestText({
    city,
    activeMetrics: ["commute_wind", "uv_index"],
    stories: [],
  });

  assert.ok(metricsWithWind.includes("Wind 12 mph NE."));
  assert.ok(metricsWithWind.includes("UV 2 (Low)."));
  assert.ok(!metricsWithWind.includes("High 17 / Low 11."));
});

test("deriveDigestText formats top 3 editorial stories without emojis", () => {
  const city = MOCK_CITIES.Tokyo;
  const result = deriveDigestText({
    city,
    activeMetrics: ["air_quality"],
    stories: MOCK_STORIES,
  });

  assert.ok(result.includes("Top stories: (1)"));
  assert.ok(result.includes("(2)"));
  assert.ok(result.includes("(3)"));
  // Ensure no emoji characters exist in the derived output
  const emojiRegex = /\p{Extended_Pictographic}/u;
  assert.equal(emojiRegex.test(result), false);
});
