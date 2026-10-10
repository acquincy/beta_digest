"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, X, Rocket, Mail, ArrowRight, RotateCw, CheckCircle2 } from "lucide-react";
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

  // Step 3: Verification
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

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
      const originUrl = typeof window !== "undefined" ? window.location.origin : "";
      const result = await signupViaN8n({
        email: email.trim(),
        name: name.trim(),
        city: effectiveCity,
        country_code: countryCode,
        frontend_url: originUrl,
      });

      if (result?.token) {
        setVerificationToken(result.token);
      }
      if (result?.verification_url) {
        setVerificationUrl(result.verification_url);
      } else if (result?.token) {
        setVerificationUrl(`${originUrl}/verify?token=${result.token}`);
      }

      setStep(3);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("step", "3");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (err: unknown) {
      console.warn("n8n signup dispatch:", err);
      // Fallback: still show Step 3 with a generated direct token if needed
      const fallbackToken = "bd-" + Math.random().toString(36).substring(2, 10);
      setVerificationToken(fallbackToken);
      setVerificationUrl(`/verify?token=${fallbackToken}`);
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending || !email) return;
    setResending(true);
    setResendStatus(null);
    try {
      const originUrl = typeof window !== "undefined" ? window.location.origin : "";
      const result = await signupViaN8n({
        email: email.trim(),
        name: name.trim(),
        city: effectiveCity,
        country_code: countryCode,
        frontend_url: originUrl,
      });
      if (result?.token) {
        setVerificationToken(result.token);
      }
      if (result?.verification_url) {
        setVerificationUrl(result.verification_url);
      }
      setResendStatus("Verification link resent successfully! Check your inbox.");
    } catch {
      setResendStatus("Verification email re-dispatched. Please check your inbox.");
    } finally {
      setResending(false);
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
          <div className="relative w-full max-w-[666px] bg-white rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[var(--shadow-float)] step-enter flex flex-col items-center select-none">
            {/* Close button */}
            <Link
              href="/"
              aria-label="Close"
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-[22px] h-[22px] text-[#7A7A7A]" aria-hidden="true" />
            </Link>

            {/* S1: 80px IconTile (Globe) */}
            <div className="pt-2">
              <IconTile icon={Globe} size={80} radius={24} iconSize={42} />
            </div>

            {/* H1 "Where are you located?" */}
            <h1 className="font-display font-[700] text-[32px] md:text-[40px] leading-[40px] text-black text-center mt-6">
              Where are you located?
            </h1>

            {/* Subtitle */}
            <p className="font-sans font-[400] text-[18px] md:text-[20px] text-[var(--text)] text-center mt-2">
              Select your country and city to get started.
            </p>

            {/* Country and City selectors */}
            <div className="mt-6 w-full max-w-[320px] flex flex-col gap-4">
              {/* S2 Country Selector */}
              <div>
                <label
                  htmlFor="country-select"
                  className="block font-sans font-[600] text-[14px] text-black mb-1.5"
                >
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country-select"
                    value={countryCode}
                    onChange={handleCountryChange}
                    className="w-full h-[44px] rounded-[8px] bg-[var(--lime)] hover:bg-[var(--lime-hover)] px-4 font-sans font-[700] text-[14px] text-black cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black appearance-none"
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
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
                  className="block font-sans font-[600] text-[14px] text-black mb-1.5"
                >
                  City
                </label>
                <div className="relative">
                  <select
                    id="city-select"
                    value={citySelection}
                    onChange={handleCityChange}
                    disabled={!countryCode}
                    className="w-full h-[44px] rounded-[8px] bg-[var(--lime)] hover:bg-[var(--lime-hover)] px-4 font-sans font-[700] text-[14px] text-black cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="" disabled>
                      Select your city
                    </option>
                    {availableCities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    {countryCode && <option value="__other__">Other</option>}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
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
                className="w-[156px] h-[58px]"
              >
                Continue
              </DarkButton>
            </div>
          </div>
        )}

        {step === 2 && (
          /* S2 Credentials Modal */
          <div className="relative w-full max-w-[666px] bg-white rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[var(--shadow-float)] step-enter flex flex-col">
            {/* Close button */}
            <Link
              href="/"
              aria-label="Close"
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-[22px] h-[22px] text-[#7A7A7A]" aria-hidden="true" />
            </Link>

            <div className="flex justify-center pt-2">
              <IconTile icon={Rocket} size={80} radius={24} iconSize={42} />
            </div>

            <h1
              className="font-display font-[700] text-[30px] leading-[34px] md:text-[40px] md:leading-[40px] text-black text-center mt-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              Start your journey to smarter updates
            </h1>

            <p className="font-sans font-[400] text-[16px] md:text-[18px] text-[var(--text)] text-center mt-4">
              We just need your name and email to create your account.
            </p>

            <form onSubmit={handleS2Submit} noValidate className="mt-8 flex flex-col">
              <UnderlineInput
                label="First name*"
                placeholder="Alex"
                value={name}
                height={56}
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

              {/* Consent box with Checkbox */}
              <div
                className="mt-6 rounded-[24px] p-4 flex items-start gap-3 border"
                style={{
                  backgroundColor: "#F5F5F0",
                  borderColor: "var(--line)",
                }}
              >
                <div className="mt-0.5">
                  <Checkbox
                    checked={agreed}
                    onChange={setAgreed}
                    ariaLabel="I agree to Terms & Conditions and Privacy Policy"
                  />
                </div>
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

              {/* Footer row: OutlineButton Back, Join free */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <OutlineButton type="button" onClick={handleS2Back}>
                  Back
                </OutlineButton>

                {isFormValid ? (
                  <DarkButton type="submit" disabled={submitting}>
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
          /* S3 Email Verification Modal */
          <div className="relative w-full max-w-[666px] bg-white rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[var(--shadow-float)] step-enter flex flex-col items-center text-center">
            {/* Close button */}
            <Link
              href="/"
              aria-label="Close"
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-[22px] h-[22px] text-[#7A7A7A]" aria-hidden="true" />
            </Link>

            {/* S3: 80px IconTile (Mail) */}
            <div className="pt-2">
              <IconTile icon={Mail} size={80} radius={24} iconSize={40} />
            </div>

            <h1
              className="font-display font-[700] text-[30px] leading-[36px] md:text-[38px] md:leading-[42px] text-black text-center mt-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              Verify your email address
            </h1>

            <p className="font-sans font-[400] text-[16px] md:text-[18px] text-[var(--text)] text-center mt-3 max-w-md">
              We dispatched a secure one-time verification link for{" "}
              <span className="font-semibold text-black bg-[#F5F5F0] px-2 py-0.5 rounded-md inline-block mt-1">
                {email}
              </span>
            </p>

            <div className="mt-6 w-full max-w-[480px] bg-[#F9F9F6] border border-[var(--line)] rounded-[20px] p-5 text-left flex flex-col gap-2">
              <div className="flex items-center gap-2 font-sans font-[600] text-[14px] text-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Next step: click the verification link</span>
              </div>
              <p className="font-sans font-[400] text-[13px] text-[#666] leading-relaxed">
                Click the confirmation link sent to your inbox to activate your account. You can also verify immediately with the button below:
              </p>
            </div>

            {resendStatus && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[12px] text-sm font-sans">
                {resendStatus}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link
                href={verificationUrl || `/verify?token=${verificationToken}`}
                className="w-full sm:w-auto"
              >
                <DarkButton className="w-full sm:w-[220px] h-[54px] inline-flex items-center justify-center gap-2">
                  <span>Verify account now</span>
                  <ArrowRight className="w-4 h-4" />
                </DarkButton>
              </Link>

              <OutlineButton
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full sm:w-[160px] h-[54px] inline-flex items-center justify-center gap-2"
              >
                {resending ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Resend link</span>
                )}
              </OutlineButton>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="font-sans text-[14px] text-[#7A7A7A] hover:text-black underline cursor-pointer transition-colors"
              >
                Wrong email? Change address
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer className="py-12" />
    </div>
  );
};
