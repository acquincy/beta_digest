import test from "node:test";
import assert from "node:assert/strict";
import {
  generateCityWeather,
  getTop5Stories,
  FIXTURE_STORIES_BY_TOPIC,
} from "../lib/mock-service";
import { NEWS_TOPIC_ORDER } from "../lib/types";

test("generateCityWeather uses °F and mph for United States", () => {
  const usWeather = generateCityWeather("Seattle", "US");
  assert.equal(usWeather.tempUnit, "°F");
  assert.equal(usWeather.windUnit, "mph");
  assert.equal(usWeather.isUS, true);
  assert.ok(usWeather.currentTemp >= 32 && usWeather.currentTemp <= 110);
});

test("generateCityWeather uses °C and km/h for non-US countries", () => {
  const ukWeather = generateCityWeather("London", "GB");
  assert.equal(ukWeather.tempUnit, "°C");
  assert.equal(ukWeather.windUnit, "km/h");
  assert.equal(ukWeather.isUS, false);
  assert.ok(ukWeather.currentTemp >= 0 && ukWeather.currentTemp <= 45);

  const jpWeather = generateCityWeather("Tokyo", "JP");
  assert.equal(jpWeather.tempUnit, "°C");
  assert.equal(jpWeather.windUnit, "km/h");
  assert.equal(jpWeather.isUS, false);
});

test("generateCityWeather is deterministic per city name", () => {
  const weather1 = generateCityWeather("Paris", "FR");
  const weather2 = generateCityWeather("Paris", "FR");
  assert.deepEqual(weather1, weather2);

  const weatherBerlin = generateCityWeather("Berlin", "DE");
  assert.notEqual(weather1.currentTemp, weatherBerlin.currentTemp);
});

test("neutral source labels only: zero attribution to real media outlets", () => {
  const PROHIBITED_OUTLET_REGEX = /\b(reuters|bloomberg|ap|associated press|wsj|wall street journal|ft|financial times)\b/i;

  for (const topic of NEWS_TOPIC_ORDER) {
    const stories = FIXTURE_STORIES_BY_TOPIC[topic];
    assert.ok(stories && stories.length >= 3, `Topic ${topic} must have at least 3 stories`);

    for (const story of stories) {
      assert.ok(
        story.source === "BetaDigest Desk" || story.source === "Wire",
        `Source must be neutral ("BetaDigest Desk" or "Wire"), found: ${story.source}`
      );

      assert.ok(
        !PROHIBITED_OUTLET_REGEX.test(story.source),
        `Source attributes prohibited media outlet: ${story.source}`
      );
    }
  }
});

test("getTop5Stories always yields exactly 5 stories, including for 1 topic", () => {
  // Test with 1 topic
  const oneTopicStories = getTop5Stories(["technology"]);
  assert.equal(oneTopicStories.length, 5);
  for (const s of oneTopicStories) {
    assert.equal(s.topic, "technology");
  }

  // Test with 2 topics
  const twoTopicStories = getTop5Stories(["economy", "science"]);
  assert.equal(twoTopicStories.length, 5);

  // Test with 5 topics
  const fiveTopicStories = getTop5Stories(["politics", "economy", "health", "environment", "crime"]);
  assert.equal(fiveTopicStories.length, 5);
  // Check round-robin: each of the 5 topics should appear exactly once
  const topicsPresent = fiveTopicStories.map((s) => s.topic);
  assert.deepEqual(topicsPresent, ["politics", "economy", "health", "environment", "crime"]);
});
