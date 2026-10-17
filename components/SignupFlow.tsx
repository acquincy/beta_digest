"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, X, Rocket } from "lucide-react";
import { CanvasA } from "./CanvasA";
import { IconTile } from "./primitives/IconTile";
import { DarkButton, OutlineButton, Button } from "./primitives/Button";
import { UnderlineInput } from "./primitives/UnderlineInput";
import { Checkbox } from "./primitives/Checkbox";
import { Footer } from "./Footer";
import { COUNTRIES, CITIES } from "@/lib/geo";
import { loadPreferences, savePreferences, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { cityRegex } from "@/lib/schemas";
import { signupViaN8n } from "@/lib/n8n";
import { VerificationWaitingCard } from "./VerificationWaitingCard";

export const SignupFlow: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState(INITIAL_PREFERENCES);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Country & City
  const [countryCode, setCountryCode] = useState("");
  const [citySelection, setCitySelection] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [cityError, setCityError] = useState("");

  // Step 2: Credentials
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load preferences strictly after mount
  useEffect(() => {
    const p = loadPreferences();
    setPrefs(p);
    setCountryCode(p.countryCode || "");
    if (p.cityIsCustom) {
      setCitySelection("__other__");
      setCustomCity(p.city || "");
    } else {
      setCitySelection(p.city || "");
    }
    setName(p.name || "");
    const paramEmail = searchParams?.get("email");
    setEmail(paramEmail || p.email || "");

    const urlStep = searchParams?.get("step");
    if (urlStep === "2") {
      setStep(2);
    } else if (urlStep === "3") {
      setStep(3);
    } else {
      setStep(1);
    }

    setHydrated(true);
  }, [searchParams]);

  // Handle Country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    setCitySelection("");
    setCustomCity("");
    setCityError("");
  };

  // Handle City change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCitySelection(val);
    setCityError("");
    if (val !== "__other__") {
      setCustomCity("");
    }
  };

  const isOtherCity = citySelection === "__other__";
  const effectiveCity = isOtherCity ? customCity.trim() : citySelection;
  const isCityValid = Boolean(
    effectiveCity &&
      effectiveCity.length >= 2 &&
      effectiveCity.length <= 60 &&
      cityRegex.test(effectiveCity)
  );

  const canContinueS1 = Boolean(countryCode && isCityValid);

  const handleS1Continue = () => {
    if (!canContinueS1) return;

    const updated = {
      ...prefs,
      countryCode,
      city: effectiveCity,
      cityIsCustom: isOtherCity,
    };
    setPrefs(updated);
    savePreferences(updated);

    setStep(2);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("step", "2");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleS2Back = () => {
    setStep(1);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("step", "1");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Name is required.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = () => {
    const val = email.trim();
    if (!val) {
      setEmailError("Email address is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    agreed;

  const handleS2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNameOk = validateName();
    const isEmailOk = validateEmail();
    if (!isNameOk || !isEmailOk || !agreed || submitting) return;

    const finalPrefs = {
      ...prefs,
      countryCode,
      city: effectiveCity,
      cityIsCustom: isOtherCity,
      name: name.trim(),
      email: email.trim(),
    };
    setPrefs(finalPrefs);
    savePreferences(finalPrefs);

    setSubmitting(true);
    try {
      await signupViaN8n({
        email: email.trim(),
        name: name.trim(),
        city: effectiveCity,
        country_code: countryCode,
      });

      setStep(3);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("step", "3");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (err: unknown) {
      console.warn("Signup dispatch error:", err);
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const availableCities = countryCode ? CITIES[countryCode] || [] : [];

  if (!hydrated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
        <CanvasA />
        <main className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
          <div className="w-full max-w-[666px] h-[400px] bg-white rounded-[32px] md:rounded-[40px] animate-pulse" />
        </main>
        <Footer className="py-12" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <CanvasA />

      {/* Main card container */}
      <main className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
        {step === 1 && (
          /* S1 Location Modal */
          <div className="relative w-full max-w-[666px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl step-enter flex flex-col items-center select-none">
            {/* Close button */}
            <Link
              href="/"
              aria-label="Close"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* S1: 80px IconTile (Globe) */}
            <div className="pt-2">
              <IconTile icon={Globe} size={80} radius={24} iconSize={42} />
            </div>

            {/* H1 "Where are you located?" */}
            <h1 className="font-display font-[600] text-[32px] md:text-[40px] leading-[40px] text-white text-center mt-6 tracking-tight">
              Where are you located?
            </h1>

            {/* Subtitle */}
            <p className="font-sans font-[400] text-[16px] md:text-[18px] text-white/75 text-center mt-2">
              Select your country and city to get started.
            </p>

            {/* Country and City selectors */}
            <div className="mt-6 w-full max-w-[320px] flex flex-col gap-4">
              {/* S2 Country Selector */}
              <div>
                <label
                  htmlFor="country-select"
                  className="block font-sans font-[500] text-[14px] text-[#ededed] mb-1.5"
                >
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country-select"
                    value={countryCode}
                    onChange={handleCountryChange}
                    className="w-full h-[46px] rounded-xl bg-[#202020] hover:bg-[#252525] border border-white/10 px-4 font-sans font-medium text-[14px] text-white cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 appearance-none"
                  >
                    <option value="" disabled className="bg-[#161616] text-white/50">
                      Select your country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#161616] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* S3 City Selector */}
              <div>
                <label
                  htmlFor="city-select"
                  className="block font-sans font-[500] text-[14px] text-[#ededed] mb-1.5"
                >
                  City
                </label>
                <div className="relative">
                  <select
                    id="city-select"
                    value={citySelection}
                    onChange={handleCityChange}
                    disabled={!countryCode}
                    className="w-full h-[46px] rounded-xl bg-[#202020] hover:bg-[#252525] border border-white/10 px-4 font-sans font-medium text-[14px] text-white cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="" disabled className="bg-[#161616] text-white/50">
                      Select your city
                    </option>
                    {availableCities.map((c) => (
                      <option key={c.name} value={c.name} className="bg-[#161616] text-white">
                        {c.name}
                      </option>
                    ))}
                    {countryCode && <option value="__other__" className="bg-[#161616] text-white">Other</option>}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Typed Other City Underline Input */}
              {isOtherCity && (
                <div className="mt-2 w-full">
                  <UnderlineInput
                    label="Your city"
                    placeholder="Enter your city"
                    value={customCity}
                    height={44}
                    onChange={(e) => {
                      setCustomCity(e.target.value);
                      if (cityError) setCityError("");
                    }}
                    error={cityError}
                    required
                  />
                </div>
              )}
            </div>

            {/* S4 Continue button */}
            <div className="mt-8 flex justify-center">
              <DarkButton
                type="button"
                onClick={handleS1Continue}
                disabled={!canContinueS1}
                className="w-[156px] h-[52px] !bg-white !text-black hover:!bg-[#eaeaea] font-medium shadow-sm"
              >
                Continue
              </DarkButton>
            </div>
          </div>
        )}

        {step === 2 && (
          /* S2 Credentials Modal */
          <div className="relative w-full max-w-[666px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl step-enter flex flex-col">
            {/* Close button */}
            <Link
              href="/"
              aria-label="Close"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </Link>

            <div className="flex justify-center pt-2">
              <IconTile icon={Rocket} size={80} radius={24} iconSize={42} />
            </div>

            <h1
              className="font-display font-[600] text-[30px] leading-[34px] md:text-[38px] md:leading-[42px] text-white text-center mt-6 tracking-tight"
            >
              Start your journey to smarter updates
            </h1>

            <p className="font-sans font-[400] text-[15px] md:text-[17px] text-white/75 text-center mt-3">
              We just need your name and email to create your account.
            </p>

            <form onSubmit={handleS2Submit} noValidate className="mt-8 flex flex-col">
              <UnderlineInput
                label="First name*"
                placeholder="Alex"
                value={name}
                height={52}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                onBlur={validateName}
                error={nameError}
                autoComplete="given-name"
                required
              />

              <div className="h-6" />

              <UnderlineInput
                label="Email*"
                type="email"
                placeholder="reader@betadigest.com"
                value={email}
                height={52}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onBlur={validateEmail}
                error={emailError}
                autoComplete="email"
                required
              />

              {/* Consent box with Checkbox */}
              <div
                className="mt-6 rounded-[20px] p-4 flex items-start gap-3 bg-white/[0.03] border border-white/10"
              >
                <div className="mt-0.5">
                  <Checkbox
                    checked={agreed}
                    onChange={setAgreed}
                    ariaLabel="I agree to Terms & Conditions and Privacy Policy"
                  />
                </div>
                <div className="font-sans font-[400] text-[14px] leading-[22px] text-white/75">
                  I agree to the{" "}
                  <Link
                    href="/credits"
                    className="font-medium underline text-white hover:opacity-80 transition-opacity"
                  >
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/credits"
                    className="font-medium underline text-white hover:opacity-80 transition-opacity"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>

              {/* Footer row: OutlineButton Back, Join free */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <OutlineButton type="button" onClick={handleS2Back}>
                  Back
                </OutlineButton>

                {isFormValid ? (
                  <DarkButton type="submit" disabled={submitting} className="!bg-white !text-black hover:!bg-[#eaeaea] font-medium shadow-sm">
                    {submitting ? "Sending verification..." : "Join free"}
                  </DarkButton>
                ) : (
                  <Button disabled type="button">
                    Join free
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <VerificationWaitingCard
            email={email}
            name={name}
            city={effectiveCity}
            countryCode={countryCode}
            onChangeEmail={() => {
              setStep(2);
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("step", "2");
                window.history.replaceState({}, "", url.toString());
              }
            }}
            onVerified={() => {
              router.push("/set-up-reports?step=1");
            }}
          />
        )}
      </main>

      <Footer className="py-12" />
    </div>
  );
};
