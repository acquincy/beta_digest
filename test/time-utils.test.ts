import test from "node:test";
import assert from "node:assert/strict";
import {
  HOURLY_OPTIONS,
  formatHourOption,
  getTimeUntilNextDispatch,
  formatCurrentTimeInZone,
} from "../lib/time-utils";

test("HOURLY_OPTIONS contains exactly 24 hourly options from 0 to 23", () => {
  assert.equal(HOURLY_OPTIONS.length, 24);
  for (let i = 0; i < 24; i++) {
    assert.equal(HOURLY_OPTIONS[i].value, i);
  }
});

test("formatHourOption correctly formats 12-hour AM/PM values", () => {
  assert.equal(formatHourOption(0), "12:00 AM");
  assert.equal(formatHourOption(7), "7:00 AM");
  assert.equal(formatHourOption(12), "12:00 PM");
  assert.equal(formatHourOption(13), "1:00 PM");
  assert.equal(formatHourOption(23), "11:00 PM");
});

test("getTimeUntilNextDispatch calculates exact delta before dispatch time", () => {
  // Mock current time: 03:30:00 UTC
  const mockNow = new Date(Date.UTC(2026, 9, 5, 3, 30, 0));

  // Target dispatch: 6 (06:00 UTC)
  const remaining = getTimeUntilNextDispatch(6, "UTC", mockNow);

  // Delta between 03:30:00 and 06:00:00 is 2 hours and 30 minutes
  assert.equal(remaining.hours, 2);
  assert.equal(remaining.minutes, 30);
  assert.equal(remaining.seconds, 0);
  assert.equal(remaining.formatted, "02:30:00");
});

test("getTimeUntilNextDispatch wraps to next day if dispatch time already passed", () => {
  // Mock current time: 08:15:30 UTC
  const mockNow = new Date(Date.UTC(2026, 9, 5, 8, 15, 30));

  // Target dispatch: 6 (06:00 UTC)
  const remaining = getTimeUntilNextDispatch(6, "UTC", mockNow);

  assert.equal(remaining.hours, 21);
  assert.equal(remaining.minutes, 44);
  assert.equal(remaining.seconds, 30);
  assert.equal(remaining.formatted, "21:44:30");
});

test("formatCurrentTimeInZone returns formatted HH:mm string", () => {
  const mockNow = new Date(Date.UTC(2026, 9, 5, 6, 42, 0));
  const formatted = formatCurrentTimeInZone("UTC", mockNow);
  assert.equal(formatted, "06:42");
});
