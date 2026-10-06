"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Rocket, X, ChevronDown, Check } from "lucide-react";
import { CanvasA } from "./CanvasA";
import { IconTile } from "./primitives/IconTile";
import { DarkButton, OutlineButton, Button } from "./primitives/Button";
import { UnderlineInput } from "./primitives/UnderlineInput";
import { Footer } from "./Footer";
import { loadWizardState, saveWizardState } from "@/lib/wizard-store";

const COUNTRIES = [
  { name: "United States", code: "US", flag: "🇺🇸", dial: "+1" },
  { name: "United Kingdom", code: "UK", flag: "🇬🇧", dial: "+44" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dial: "+1" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dial: "+49" },
  { name: "France", code: "FR", flag: "🇫🇷", dial: "+33" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dial: "+81" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", dial: "+234" },
  { name: "Kenya", code: "KE", flag: "🇰🇪", dial: "+254" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dial: "+27" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dial: "+61" },
];

export const SignupFlow: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard state
  const [wizardState, setWizardState] = useState(loadWizardState());
  const [step, setStep] = useState<1 | 2>(() => {
    const urlStep = searchParams?.get("step");
    return urlStep === "2" ? 2 : 1;
  });

  // S1 State
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(wizardState.country);

  // S2 State
  const [firstName, setFirstName] = useState(wizardState.firstName || "");
  const [email, setEmail] = useState(() => searchParams?.get("email") || wizardState.email || "");
  const [agreed, setAgreed] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const updated = {
      ...wizardState,
      country: selectedCountry,
      firstName,
      email,
    };
    saveWizardState(updated);
  }, [selectedCountry, firstName, email]);

  const handleCountrySelect = (c: (typeof COUNTRIES)[0]) => {
    setSelectedCountry(c);
    setShowCountryMenu(false);
  };

  const handleS1Continue = () => {
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

  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      return false;
    }
    setFirstNameError("");
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
    firstName.trim().length > 0 &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    agreed;

  const handleS2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNameOk = validateFirstName();
    const isEmailOk = validateEmail();
    if (!isNameOk || !isEmailOk || !agreed) return;

    const finalState = {
      ...wizardState,
      country: selectedCountry,
      firstName: firstName.trim(),
      email: email.trim(),
    };
    saveWizardState(finalState);

    // Advance to /basic-info
    router.push("/basic-info");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <CanvasA />

      {/* Main card container */}
      <main className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
        {step === 1 ? (
          /* S1 Location Modal: centered card 666px x ~352px, radius 40px, white, --shadow-float */
          <div
            className="relative w-full max-w-[666px] bg-white rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[var(--shadow-float)] step-enter flex flex-col items-center select-none"
          >
            {/* 48px white circle close button (X 22px grey) at top-right, offset 20px */}
            <Link
              href="/"
              aria-label="Close"
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-[22px] h-[22px] text-[#7A7A7A]" aria-hidden="true" />
            </Link>

            {/* 80px IconTile (Rocket, radius 24px) at top center, 20px from top */}
            <div className="pt-2">
              <IconTile icon={Rocket} size={80} radius={24} iconSize={42} />
            </div>

            {/* H1 "Where are you located?" 40px/700 centered */}
            <h1 className="font-display font-[700] text-[32px] md:text-[40px] leading-[40px] text-black text-center mt-6">
              Where are you located?
            </h1>

            {/* 8px gap, 20px paragraph "Select your country to get started." */}
            <p className="font-sans font-[400] text-[18px] md:text-[20px] text-[var(--text)] text-center mt-2">
              Select your country to get started.
            </p>

            {/* 24px gap, lime country selector: height 44px, radius 8px, bg --lime, padding 0 16px */}
            <div className="relative mt-6 w-full max-w-[320px]">
              <button
                type="button"
                onClick={() => setShowCountryMenu(!showCountryMenu)}
                className="w-full h-[44px] rounded-[8px] bg-[var(--lime)] hover:bg-[var(--lime-hover)] px-4 flex items-center justify-between font-sans font-[700] text-[14px] text-black cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                aria-expanded={showCountryMenu}
                aria-label="Select Country"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">{selectedCountry.flag}</span>
                  <span>{selectedCountry.name}</span>
                  <span className="text-[#374151]">({selectedCountry.dial})</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-black transition-transform duration-200 ${
                    showCountryMenu ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Country dropdown menu */}
              {showCountryMenu && (
                <div className="absolute top-[50px] left-0 w-full bg-white rounded-[12px] border border-[var(--line)] shadow-lg py-2 z-50 max-h-[220px] overflow-y-auto thin-scrollbar">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={`w-full px-4 py-2 text-left flex items-center justify-between text-[14px] font-sans hover:bg-[#F7F7F7] cursor-pointer ${
                        selectedCountry.code === c.code
                          ? "bg-[var(--lime-tint)] font-semibold text-black"
                          : "text-black"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[12px] text-[#6B7280] tabular-nums">
                        {c.dial}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 24px gap, DarkButton (58px high, 156px wide) "Continue" + arrow */}
            <div className="mt-6 flex justify-center">
              <DarkButton
                type="button"
                onClick={handleS1Continue}
                className="w-[156px] h-[58px]"
              >
                Continue
              </DarkButton>
            </div>
          </div>
        ) : (
          /* S2 Credentials Modal: card 666px wide, same shell, Rocket tile */
          <div
            className="relative w-full max-w-[666px] bg-white rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[var(--shadow-float)] step-enter flex flex-col"
          >
            {/* Close button */}
            <Link
              href="/"
              aria-label="Close"
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-[22px] h-[22px] text-[#7A7A7A]" aria-hidden="true" />
            </Link>

            {/* Rocket tile */}
            <div className="flex justify-center pt-2">
              <IconTile icon={Rocket} size={80} radius={24} iconSize={42} />
            </div>

            {/* H1 "Start your journey to smarter updates" (two lines, centered, 40px/40px, 700, tracking -0.03em) */}
            <h1
              className="font-display font-[700] text-[30px] leading-[34px] md:text-[40px] md:leading-[40px] text-black text-center mt-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              Start your journey to smarter updates
            </h1>

            {/* 16px gap, 18px centered paragraph */}
            <p className="font-sans font-[400] text-[16px] md:text-[18px] text-[var(--text)] text-center mt-4">
              We just need your name and email to create your account.
            </p>

            {/* Credentials form */}
            <form onSubmit={handleS2Submit} noValidate className="mt-8 flex flex-col">
              {/* First Name */}
              <UnderlineInput
                label="First name*"
                placeholder="Alex"
                value={firstName}
                height={56}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (firstNameError) setFirstNameError("");
                }}
                onBlur={validateFirstName}
                error={firstNameError}
                autoComplete="given-name"
                required
              />

              {/* 24px gap between fields */}
              <div className="h-6" />

              {/* Email */}
              <UnderlineInput
                label="Email*"
                type="email"
                placeholder="reader@betadigest.com"
                value={email}
                height={56}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onBlur={validateEmail}
                error={emailError}
                autoComplete="email"
                required
              />

              {/* Consent box: bg #F5F5F0, 1px --line border, radius 24px, padding 16px */}
              <div
                className="mt-6 rounded-[24px] p-4 flex items-start gap-3 border"
                style={{
                  backgroundColor: "#F5F5F0",
                  borderColor: "var(--line)",
                }}
              >
                {/* Checkbox 20px (radius 4px, 2px black border; checked = black fill with white check) */}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreed}
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded-[4px] border-[2px] border-black flex items-center justify-center shrink-0 mt-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    agreed ? "bg-black" : "bg-transparent"
                  }`}
                  aria-label="I agree to Terms & Conditions and Privacy Policy"
                >
                  {agreed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" aria-hidden="true" />}
                </button>
                <div className="font-sans font-[400] text-[15px] leading-[22px] text-[var(--text)]">
                  I agree to the{" "}
                  <Link
                    href="/credits"
                    className="font-bold underline text-black hover:opacity-80"
                  >
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/credits"
                    className="font-bold underline text-black hover:opacity-80"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>

              {/* 24px gap, footer row: OutlineButton "Back" left, "Join free →" right */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <OutlineButton type="button" onClick={handleS2Back}>
                  Back
                </OutlineButton>

                {isFormValid ? (
                  <DarkButton type="submit">Join free →</DarkButton>
                ) : (
                  <Button disabled type="button">
                    Join free →
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Page footer (black bar, same as landing footer links) sits under the card region */}
      <Footer className="py-12" />
    </div>
  );
};
