import test from "node:test";
import assert from "node:assert/strict";
import { step1Schema, step2Schema, step3Schema, fullSignupSchema } from "../lib/schemas";

test("step1Schema validates city and timezone", () => {
  const valid = step1Schema.safeParse({
    city: "Seattle",
    timezone: "America/Los_Angeles",
  });
  assert.equal(valid.success, true);

  const invalidCity = step1Schema.safeParse({
    city: "A",
    timezone: "America/Los_Angeles",
  });
  assert.equal(invalidCity.success, false);
});

test("step2Schema handles email channel without requiring phone", () => {
  const emailValid = step2Schema.safeParse({
    channel: "email",
    email: "reader@betadigest.com",
    dispatchTime: "06:00",
  });
  assert.equal(emailValid.success, true);

  const invalidEmail = step2Schema.safeParse({
    channel: "email",
    email: "not-an-email",
    dispatchTime: "06:00",
  });
  assert.equal(invalidEmail.success, false);
});

test("step2Schema enforces valid phone number when channel is SMS", () => {
  const smsWithoutPhone = step2Schema.safeParse({
    channel: "sms",
    email: "reader@betadigest.com",
    phone: "",
    dispatchTime: "06:00",
  });
  assert.equal(smsWithoutPhone.success, false);

  const smsWithValidPhone = step2Schema.safeParse({
    channel: "sms",
    email: "reader@betadigest.com",
    phone: "2065550192",
    dialCode: "+1",
    dispatchTime: "06:00",
  });
  assert.equal(smsWithValidPhone.success, true);
});

test("step3Schema requires at least one active edition and metric", () => {
  const invalidNoEditions = step3Schema.safeParse({
    editions: { morning: false, midday: false, evening: false },
    activeMetrics: ["high_low"],
  });
  assert.equal(invalidNoEditions.success, false);

  const invalidNoMetrics = step3Schema.safeParse({
    editions: { morning: true, midday: false, evening: false },
    activeMetrics: [],
  });
  assert.equal(invalidNoMetrics.success, false);

  const valid = step3Schema.safeParse({
    editions: { morning: true, midday: false, evening: false },
    activeMetrics: ["high_low", "rain_prob"],
  });
  assert.equal(valid.success, true);
});

test("fullSignupSchema validates complete multi-step payload", () => {
  const fullValid = fullSignupSchema.safeParse({
    city: "Tokyo",
    timezone: "Asia/Tokyo",
    channel: "email",
    email: "reader@tokyo.jp",
    dispatchTime: "06:00",
    dialCode: "+81",
    editions: { morning: true, midday: false, evening: false },
    activeMetrics: ["high_low", "uv_index", "air_quality"],
  });
  assert.equal(fullValid.success, true);
});
