import test from "node:test";
import assert from "node:assert/strict";
import { getTimeUntilNextDispatch, formatCurrentTimeInZone } from "../lib/time-utils";

test("getTimeUntilNextDispatch calculates exact delta before dispatch time", () => {
  // Mock current time: 03:30:00 UTC
  const mockNow = new Date(Date.UTC(2026, 9, 5, 3, 30, 0));

  // Target dispatch: 06:00 UTC
  const remaining = getTimeUntilNextDispatch("06:00", "UTC", mockNow);

  // Delta between 03:30:00 and 06:00:00 is 2 hours and 30 minutes
  assert.equal(remaining.hours, 2);
  assert.equal(remaining.minutes, 30);
  assert.equal(remaining.seconds, 0);
  assert.equal(remaining.formatted, "02:30:00");
});

test("getTimeUntilNextDispatch wraps to next day if dispatch time already passed", () => {
  // Mock current time: 08:15:30 UTC
  const mockNow = new Date(Date.UTC(2026, 9, 5, 8, 15, 30));

  // Target dispatch: 06:00 UTC
  const remaining = getTimeUntilNextDispatch("06:00", "UTC", mockNow);

  // Delta between 08:15:30 and next day 06:00:00 is (24 - 8.25833 + 6) = 21h 44m 30s
  assert.equal(remaining.hours, 21);
  assert.equal(remaining.minutes, 44);
  assert.equal(remaining.seconds, 30);
  assert.equal(remaining.formatted, "21:44:30");
});

test("getTimeUntilNextDispatch handles specific regional timezones correctly", () => {
  // Current time: 05:00:00 UTC
  // In Europe/London (BST / UTC+1 in summer, or UTC in winter)
  const mockNow = new Date(Date.UTC(2026, 9, 5, 5, 0, 0));
  const remaining = getTimeUntilNextDispatch("06:00", "UTC", mockNow);

  assert.equal(remaining.hours, 1);
  assert.equal(remaining.minutes, 0);
  assert.equal(remaining.seconds, 0);
  assert.equal(remaining.formatted, "01:00:00");
});

test("formatCurrentTimeInZone returns formatted HH:mm string", () => {
  const mockNow = new Date(Date.UTC(2026, 9, 5, 6, 42, 0));
  const formatted = formatCurrentTimeInZone("UTC", mockNow);
  assert.equal(formatted, "06:42");
});
