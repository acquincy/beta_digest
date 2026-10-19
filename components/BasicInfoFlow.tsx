"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smile } from "lucide-react";
import { CanvasA } from "./CanvasA";
import { TopLeftLogo } from "./TopLeftLogo";
import { IconTile } from "./primitives/IconTile";
import { PrimaryButton } from "./primitives/Button";
import { ThemedInput } from "./primitives/ThemedInput";
import { UnderlineInput } from "./primitives/UnderlineInput";
import { loadPreferences, savePreferences, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { Preferences } from "@/lib/types";
import { COUNTRIES, CITIES } from "@/lib/geo";
import { cityRegex } from "@/lib/schemas";
import { CustomSelect } from "./CustomSelect";
import { clsx } from "clsx";

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
  }, []);

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
      <div className="relative min-h-screen flex flex-col justify-between items-center overflow-x-hidden">
        <CanvasA />
        <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
          <TopLeftLogo />
        </header>
        <main className="flex-grow flex items-center justify-center p-4 py-8 md:py-12 w-full">
          <div className="w-full max-w-[768px] h-[480px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-x-hidden">
      <CanvasA />
      <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
        <TopLeftLogo />
      </header>

      {/* S3 Card: 768px wide, 48px padding */}
      <main className="flex-grow flex items-center justify-center p-4 py-8 md:py-12 w-full">
        <div className="relative w-full max-w-[768px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl step-enter flex flex-col text-white">
        {/* Top center IconTile: Smile, 100px tile */}
        <div className="flex justify-center -mt-2 mb-8">
          <IconTile icon={Smile} size={100} radius={28} iconSize={52} />
        </div>

        {/* B2 Sentence form in headline display font, left aligned */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="font-display font-[600] text-[clamp(24px,3.8vw,38px)] leading-[1.4] md:leading-[1.5] text-white tracking-tight">
            <span>My name is </span>

            {/* Name underline input auto-sized to content */}
            <span className="inline-grid items-baseline align-baseline relative">
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-display font-[600] text-[clamp(24px,3.8vw,38px)] leading-tight px-1 pb-0.5 whitespace-pre pointer-events-none select-none"
                style={{ minWidth: "90px" }}
              >
                {name || "Alex"}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                className={clsx(
                  "col-start-1 row-start-1 w-full bg-transparent border-0 border-b-[2px] px-1 pb-0.5 font-display font-[600] text-[clamp(24px,3.8vw,38px)] leading-tight outline-none focus:outline-none transition-all duration-200",
                  "border-white/30 hover:border-white/50 focus:border-[#6b62f2] focus:shadow-[0_2px_8px_-2px_rgba(107,98,242,0.6)]",
                  "placeholder:text-white/40 placeholder:font-normal caret-[#6b62f2]",
                  name.trim()
                    ? "bg-gradient-to-r from-[#8ba8ff] via-[#6b62f2] to-[#c084fc] bg-clip-text text-transparent"
                    : "text-white"
                )}
                style={{
                  verticalAlign: "baseline",
                  fieldSizing: "content",
                } as React.CSSProperties}
                required
              />
            </span>
            <span className="font-display font-[600] text-[clamp(24px,3.8vw,38px)] text-white">,</span>
            <span> </span>

            {/* Keep "I live in [city], [country]." together as a cohesive clause */}
            <span className="inline whitespace-normal">
              <span className="whitespace-nowrap inline-flex items-baseline align-baseline">
                <span>I live in </span>
                <CustomSelect
                  id="city-select"
                  name="city"
                  variant="sentence"
                  value={citySelection}
                  onChange={handleCityChange}
                  disabled={!countryCode}
                  placeholder="Select city"
                  searchable
                  searchPlaceholder="Search cities..."
                  className="font-display font-[600] text-[clamp(24px,3.8vw,38px)] leading-tight"
                  options={[
                    ...availableCities.map((c) => ({ value: c.name, label: c.name })),
                    ...(countryCode ? [{ value: "__other__", label: "Other" }] : []),
                  ]}
                />
                <span className="font-display font-[600] text-[clamp(24px,3.8vw,38px)] text-white">,</span>
              </span>
              <span> </span>
              <span className="whitespace-nowrap inline-flex items-baseline align-baseline">
                <CustomSelect
                  id="country-select"
                  name="country"
                  variant="sentence"
                  value={countryCode}
                  onChange={handleCountryChange}
                  placeholder="Select country"
                  searchable
                  searchPlaceholder="Search countries..."
                  className="font-display font-[600] text-[clamp(24px,3.8vw,38px)] leading-tight"
                  options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                />
                <span className="font-display font-[600] text-[clamp(24px,3.8vw,38px)] text-white">.</span>
              </span>
            </span>
          </div>

          {/* Typed-city input below the sentence when Other is chosen */}
          {isOtherCity && (
            <div className="mt-6 w-full max-w-[400px]">
              <ThemedInput
                label="Your city"
                placeholder="Enter your city"
                value={customCity}
                height={46}
                onChange={(e) => {
                  setCustomCity(e.target.value);
                  if (customCityError) setCustomCityError("");
                }}
                error={customCityError}
                required
              />
            </div>
          )}

          {/* Continue button */}
          <div className="mt-10">
            <PrimaryButton
              type="submit"
              disabled={!canContinue}
              showArrow
              className="w-full h-[54px] text-[16px] font-medium"
            >
              Continue
            </PrimaryButton>
          </div>
        </form>
      </div>
      </main>
    </div>
  );
};
