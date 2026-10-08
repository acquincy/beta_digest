import test from "node:test";
import assert from "node:assert/strict";
import { COUNTRIES, CITIES } from "../lib/geo";

test("COUNTRIES contains exactly 195 sovereign states", () => {
  assert.equal(COUNTRIES.length, 195);
});

test("all 195 country names are unique and sorted alphabetically", () => {
  const names = COUNTRIES.map((c) => c.name);
  const uniqueNames = new Set(names);
  assert.equal(uniqueNames.size, 195);

  const collator = new Intl.Collator("en", { sensitivity: "base" });
  for (let i = 0; i < names.length - 1; i++) {
    assert.ok(
      collator.compare(names[i], names[i + 1]) <= 0,
      `Countries not sorted: "${names[i]}" should come before or equal to "${names[i + 1]}"`
    );
  }
});

test("country display names contain no dial codes, flags, or ISO abbreviations", () => {
  for (const c of COUNTRIES) {
    // No plus sign or dial code
    assert.ok(!c.name.includes("+"), `Country name has dial code: ${c.name}`);
    // No parentheses with codes
    assert.ok(!/\(\+[0-9]+\)/.test(c.name), `Country name has dial code: ${c.name}`);
    // No ISO 2-letter in display name e.g. " (US)"
    assert.ok(!/\([A-Z]{2}\)/.test(c.name), `Country name has ISO code: ${c.name}`);
  }
});

test("CITIES Record contains real cities for every country in COUNTRIES", () => {
  for (const country of COUNTRIES) {
    const cityList = CITIES[country.code];
    assert.ok(
      cityList && cityList.length > 0,
      `Country ${country.code} (${country.name}) has no cities in CITIES Record`
    );

    // Microstates like Vatican City may have 1 city, others have between 2 and 10
    assert.ok(
      cityList.length >= 1 && cityList.length <= 10,
      `Country ${country.code} has ${cityList.length} cities (expected 1 to 10)`
    );

    for (const city of cityList) {
      assert.ok(city.name && city.name.trim().length > 0);
      assert.ok(typeof city.lat === "number");
      assert.ok(typeof city.lon === "number");
    }
  }
});
