"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Smile, Check, ChevronDown } from "lucide-react";
import { CanvasA } from "./CanvasA";
import { IconTile } from "./primitives/IconTile";
import { DarkButton } from "./primitives/Button";
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

export const BasicInfoFlow: React.FC = () => {
  const router = useRouter();
  const [wizardState, setWizardState] = useState(loadWizardState());

  const [country, setCountry] = useState(wizardState.country);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [name, setName] = useState(wizardState.firstName || "");
  const [zipCode, setZipCode] = useState(wizardState.zipCode || "98039");
  const [phone, setPhone] = useState(wizardState.phone || "2065550192");
  const [channel, setChannel] = useState<"email" | "sms">(wizardState.channel || "sms");
  const [smsConsent, setSmsConsent] = useState(true);

  useEffect(() => {
    saveWizardState({
      ...wizardState,
      country,
      firstName: name,
      zipCode,
      phone,
      channel,
    });
  }, [country, name, zipCode, phone, channel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWizardState({
      ...wizardState,
      country,
      firstName: name.trim() || "Alex",
      zipCode: zipCode.trim() || "98039",
      phone: phone.trim() || "2065550192",
      channel,
    });
    router.push("/set-up-reports?step=1");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-12 md:py-16 overflow-x-hidden">
      <CanvasA />

      {/* S3 Card: 768px wide, 48px padding (mobile: full-width minus 16px margin, padding 24px, radius 32px) */}
      <div
        className="relative w-full max-w-[768px] bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-[var(--shadow-float)] step-enter flex flex-col"
      >
        {/* Top center IconTile: Smile, 80px/100px tile */}
        <div className="flex justify-center -mt-2 mb-8">
          <IconTile icon={Smile} size={100} radius={28} iconSize={52} />
        </div>

        {/* Delivery mode toggle (SMS or Email) to control phone visibility */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--line)]">
          <span className="font-sans font-[600] text-[15px] text-[#6B7280]">
            Delivery channel:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChannel("sms")}
              className={`h-[36px] px-4 rounded-full font-sans text-[14px] cursor-pointer transition-all ${
                channel === "sms"
                  ? "bg-[var(--lime)] font-semibold text-black"
                  : "bg-[var(--chip-off)] text-black hover:border-black"
              }`}
            >
              SMS &amp; Email
            </button>
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`h-[36px] px-4 rounded-full font-sans text-[14px] cursor-pointer transition-all ${
                channel === "email"
                  ? "bg-[var(--lime)] font-semibold text-black"
                  : "bg-[var(--chip-off)] text-black hover:border-black"
              }`}
            >
              Email only
            </button>
          </div>
        </div>

        {/* Sentence form in Red Hat Display 600 44px/62px, left aligned */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="font-display font-[600] text-[30px] leading-[44px] md:text-[44px] md:leading-[62px] text-black">
            <span>I&apos;m from </span>

            {/* Country selector */}
            <span className="relative inline-block align-baseline">
              <button
                type="button"
                onClick={() => setShowCountryMenu(!showCountryMenu)}
                className="inline-flex items-center gap-1.5 h-[44px] rounded-[8px] bg-[var(--lime)] hover:bg-[var(--lime-hover)] px-3 font-sans font-[700] text-[16px] md:text-[18px] text-black cursor-pointer align-middle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <ChevronDown className="w-4 h-4 ml-0.5" aria-hidden="true" />
              </button>

              {/* Country dropdown */}
              {showCountryMenu && (
                <div className="absolute top-[50px] left-0 w-[240px] bg-white rounded-[12px] border border-[var(--line)] shadow-xl py-2 z-50 max-h-[220px] overflow-y-auto thin-scrollbar">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCountry(c);
                        setShowCountryMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left flex items-center justify-between text-[14px] font-sans hover:bg-[#F7F7F7] cursor-pointer text-black"
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="text-[12px] text-[#6B7280] tabular-nums">
                        {c.dial}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </span>

            <span className="text-[20px] font-sans font-normal text-black">, </span>
            <span>my name is </span>

            {/* Underline input 290px for name */}
            <span className="inline-block align-baseline">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                className="w-[200px] md:w-[290px] bg-transparent border-0 border-b border-black text-black font-display font-[600] text-[30px] md:text-[44px] leading-tight p-0 outline-none focus:outline-none focus:border-b-2"
                style={{ verticalAlign: "baseline" }}
              />
            </span>

            <span className="text-[20px] font-sans font-normal text-black">, </span>
            <span>my ZIP Code is </span>

            {/* Underline input 160px for ZIP */}
            <span className="inline-block align-baseline">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="98039"
                className="w-[120px] md:w-[160px] bg-transparent border-0 border-b border-black text-black font-display font-[600] text-[30px] md:text-[44px] leading-tight p-0 outline-none focus:outline-none focus:border-b-2 tabular-nums"
                style={{ verticalAlign: "baseline" }}
              />
            </span>

            {/* Phone block hidden when delivery channel is Email only */}
            {channel === "sms" && (
              <>
                <span className="text-[20px] font-sans font-normal text-black">, </span>
                <span>and my phone # </span>
                <span className="text-[#6B7280] font-sans font-[400] text-[30px] md:text-[44px]">
                  {country.dial}{" "}
                </span>
                <span className="inline-block align-baseline">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="2065550192"
                    className="w-[180px] md:w-[270px] bg-transparent border-0 border-b border-black text-black font-display font-[600] text-[30px] md:text-[44px] leading-tight p-0 outline-none focus:outline-none focus:border-b-2 tabular-nums"
                    style={{ verticalAlign: "baseline" }}
                  />
                </span>
              </>
            )}

            <span className="text-[20px] font-sans font-normal text-black">.</span>
          </div>

          {/* Consent box */}
          {channel === "sms" && (
            <div
              className="mt-10 rounded-[24px] p-4 flex items-start gap-3 border"
              style={{
                backgroundColor: "#F5F5F0",
                borderColor: "var(--line)",
              }}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={smsConsent}
                onClick={() => setSmsConsent(!smsConsent)}
                className={`w-5 h-5 rounded-[4px] border-[2px] border-black flex items-center justify-center shrink-0 mt-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  smsConsent ? "bg-black" : "bg-transparent"
                }`}
                aria-label="Consent to receive SMS digests"
              >
                {smsConsent && (
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" aria-hidden="true" />
                )}
              </button>
              <div className="font-sans font-[400] text-[14px] leading-[20px] text-[var(--text)]">
                By providing your phone number, you consent to receive automated
                daily news &amp; weather digests via SMS. Message and data rates
                may apply. Reply STOP at any time to opt out.
              </div>
            </div>
          )}

          {/* DarkButton full-width (height 58px, radius full) "Continue" */}
          <div className="mt-8">
            <DarkButton
              type="submit"
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
