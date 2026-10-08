"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smile } from "lucide-react";
import { CanvasA } from "./CanvasA";
import { IconTile } from "./primitives/IconTile";
import { DarkButton } from "./primitives/Button";
import { UnderlineInput } from "./primitives/UnderlineInput";
import { loadPreferences, savePreferences, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { Preferences } from "@/lib/types";
import { COUNTRIES, CITIES } from "@/lib/geo";
import { cityRegex } from "@/lib/schemas";

export const BasicInfoFlow: React.FC = () => {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);
  const [countryCode, setCountryCode] = useState("US");
  const [name, setName] = useState("");
  const [citySelection, setCitySelection] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [customCityError, setCustomCityError] = useState("");

  // Load preferences strictly after mount
  useEffect(() => {
    const p = loadPreferences();
    setPrefs(p);
    setCountryCode(p.countryCode || "US");
    setName(p.name || "");
    if (p.cityIsCustom) {
      setCitySelection("__other__");
      setCustomCity(p.city || "");
    } else {
      setCitySelection(p.city || "");
    }
    setHydrated(true);

    if (!p.name) {
      router.push("/signup");
    }
  }, [router]);

  const isOtherCity = citySelection === "__other__";
  const effectiveCity = isOtherCity ? customCity.trim() : citySelection;
  const isCityValid = Boolean(
    effectiveCity &&
      effectiveCity.length >= 2 &&
      effectiveCity.length <= 60 &&
      cityRegex.test(effectiveCity)
  );

  const canContinue = Boolean(name.trim() && countryCode && isCityValid);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    setCitySelection("");
    setCustomCity("");
    setCustomCityError("");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCitySelection(val);
    setCustomCityError("");
    if (val !== "__other__") {
      setCustomCity("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;

    const updated = {
      ...prefs,
      name: name.trim(),
      countryCode,
      city: effectiveCity,
      cityIsCustom: isOtherCity,
    };
    savePreferences(updated);
    router.push("/set-up-reports?step=1");
  };

  const availableCities = countryCode ? CITIES[countryCode] || [] : [];

  if (!hydrated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-12 md:py-16 overflow-x-hidden">
        <CanvasA />
        <div className="w-full max-w-[768px] h-[480px] bg-white rounded-[32px] md:rounded-[40px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-12 md:py-16 overflow-x-hidden">
      <CanvasA />

      {/* S3 Card: 768px wide, 48px padding */}
      <div className="relative w-full max-w-[768px] bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-[var(--shadow-float)] step-enter flex flex-col">
        {/* Top center IconTile: Smile, 100px tile */}
        <div className="flex justify-center -mt-2 mb-8">
          <IconTile icon={Smile} size={100} radius={28} iconSize={52} />
        </div>

        {/* B2 Sentence form in Red Hat Display 600 44px/62px, left aligned */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="font-display font-[600] text-[28px] leading-[44px] md:text-[44px] md:leading-[62px] text-black">
            <span>My name is </span>

            {/* Name underline input at 44px */}
            <span className="inline-block align-baseline">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                className="w-[180px] md:w-[260px] bg-transparent border-0 border-b border-black text-black font-display font-[600] text-[28px] md:text-[44px] leading-tight p-0 outline-none focus:outline-none focus:border-b-2"
                style={{ verticalAlign: "baseline" }}
                required
              />
            </span>

            <span className="text-[20px] font-sans font-normal text-black">, </span>
            <span>I live in </span>

            {/* City select control */}
            <span className="relative inline-block align-baseline mr-2">
              <select
                value={citySelection}
                onChange={handleCityChange}
                disabled={!countryCode}
                className="inline-flex items-center h-[44px] rounded-[8px] bg-[var(--lime)] hover:bg-[var(--lime-hover)] px-3 pr-8 font-sans font-[700] text-[16px] md:text-[18px] text-black cursor-pointer align-middle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50 appearance-none"
              >
                <option value="" disabled>
                  Select city
                </option>
                {availableCities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
                {countryCode && <option value="__other__">Other</option>}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </span>

            <span className="text-[20px] font-sans font-normal text-black">, </span>

            {/* Country select control */}
            <span className="relative inline-block align-baseline">
              <select
                value={countryCode}
                onChange={handleCountryChange}
                className="inline-flex items-center h-[44px] rounded-[8px] bg-[var(--lime)] hover:bg-[var(--lime-hover)] px-3 pr-8 font-sans font-[700] text-[16px] md:text-[18px] text-black cursor-pointer align-middle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black appearance-none"
              >
                <option value="" disabled>
                  Select country
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </span>

            <span className="text-[20px] font-sans font-normal text-black">.</span>
          </div>

          {/* Typed-city input below the sentence when Other is chosen */}
          {isOtherCity && (
            <div className="mt-6 w-full">
              <UnderlineInput
                label="Your city"
                placeholder="Enter your city"
                value={customCity}
                height={48}
                onChange={(e) => {
                  setCustomCity(e.target.value);
                  if (customCityError) setCustomCityError("");
                }}
                error={customCityError}
                required
              />
            </div>
          )}

          {/* B4 Black full-width Continue button */}
          <div className="mt-10">
            <DarkButton
              type="submit"
              disabled={!canContinue}
              className="w-full h-[58px] rounded-full"
            >
              Continue
            </DarkButton>
          </div>
        </form>
      </div>
    </div>
  );
};
