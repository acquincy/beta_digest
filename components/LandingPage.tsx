"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CloudSun,
  Newspaper,
  Trophy,
  Aperture,
  CandlestickChart,
  MailCheck,
  MessagesSquare,
  Timer,
  BanIcon,
  ChevronDown,
  Heart,
} from "lucide-react";
import { Header } from "./Header";
import { CanvasB } from "./CanvasB";
import { LandingHero } from "./LandingHero";
import { Chip } from "./primitives/Chip";
import { IconTile, GradientIcon } from "./primitives/IconTile";
import { PrimaryButton, DarkButton } from "./primitives/Button";
import { Footer } from "./Footer";

const WEATHER_CHIPS_INITIAL = [
  { label: "Current temperature", active: true },
  { label: "3-hour breakdown", active: false },
  { label: "3-day forecast", active: false },
  { label: "Day's high/low temp", active: true },
  { label: "Cloudiness", active: true },
  { label: "Rain chance", active: true },
  { label: "Thunderstorm chance", active: false },
  { label: "UV index", active: true },
  { label: "Air quality", active: true },
  { label: "Wind", active: false },
  { label: "Humidity", active: false },
  { label: "Pressure", active: false },
  { label: "Dew point", active: false },
  { label: "Visibility", active: false },
  { label: "Sunrise time", active: false },
  { label: "Sunset time", active: true },
  { label: "Moon phase", active: true },
];

const FAQ_ITEMS = [
  {
    q: "How accurate is the forecast?",
    a: "We source high-resolution meteorological models updated every 15 minutes. Data is localized directly to your exact coordinates rather than a generic regional airport.",
  },
  {
    q: "What details can I include in my digest?",
    a: "You have full control over every metric including hourly breakdowns, UV indices, air quality, commute wind, and sunrise or sunset times. You can also customize news, sports scores, and stocks.",
  },
  {
    q: "Can I get alerts for severe weather?",
    a: "Yes. When severe weather watches or warnings are issued for your location, high-priority alert notices are automatically prepended to your briefing.",
  },
  {
    q: "What time will I receive my digest?",
    a: "You select your exact delivery window during onboarding, typically between 6:00 AM and 9:00 AM in your local time zone.",
  },
  {
    q: "Is this better than a weather app?",
    a: "BetaDigest eliminates bloated animations, invasive tracking, and unskippable ads. You get clean, dense, actionable facts delivered directly to your lock screen or inbox.",
  },
  {
    q: "Does it work with my location?",
    a: "BetaDigest supports postal codes and cities across the United States, Canada, the United Kingdom, Europe, and dozens of international regions.",
  },
];

export const LandingPage: React.FC = () => {
  const [weatherChips, setWeatherChips] = useState(WEATHER_CHIPS_INITIAL);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // first item open by default

  const toggleWeatherChip = (index: number) => {
    setWeatherChips((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, active: !item.active } : item
      )
    );
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col">
      {/* Canvas B background fixed behind hero */}
      <CanvasB />

      {/* Header: Logo and Wordmark only */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-grow flex flex-col">
        {/* A. Hero */}
        <LandingHero />

        {/* B. Features (bg --canvas, padding 80px) */}
        <section
          aria-label="Digest Features"
          className="w-full bg-[var(--canvas)] py-20 px-6 lg:px-20"
        >
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Featured Weather Card: 560px max / 5 cols on lg */}
            <div
              className="lg:col-span-5 w-full bg-white rounded-[40px] p-10 min-h-[528px] relative flex flex-col justify-between"
              style={{
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              {/* Top-right absolute badge: black rect radius 12px, 100x40px, FEATURED + filled heart */}
              <div
                className="absolute top-6 right-6 w-[100px] h-[40px] bg-black rounded-[12px] flex items-center justify-center gap-1.5 select-none"
                aria-label="Featured Feature"
              >
                <span className="font-sans font-[700] text-[14px] text-white">
                  FEATURED
                </span>
                <Heart
                  className="w-[14px] h-[14px] fill-[var(--lilac)] stroke-[var(--lilac)]"
                  aria-hidden="true"
                />
              </div>

              <div>
                {/* Icon (no tile) 64px gradient CloudSun */}
                <div className="w-16 h-16 flex items-center justify-center">
                  <GradientIcon icon={CloudSun} size={64} />
                </div>

                {/* 40px gap above title */}
                <div className="h-10" />

                {/* Title "Weather" 32px/700 Red Hat Display */}
                <h3 className="font-display font-[700] text-[32px] leading-tight text-black">
                  Weather
                </h3>

                {/* Description: 18px, --text */}
                <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text)] mt-3">
                  Get precise weather updates, specific to your exact location
                  and tailored to your preferences.
                </p>
              </div>

              {/* Chip grid (landing chip size 36px, 14px text) */}
              <div
                role="group"
                aria-label="Weather metrics customization"
                className="flex flex-wrap gap-x-2 gap-y-2.5 mt-8"
              >
                {weatherChips.map((chip, idx) => (
                  <Chip
                    key={chip.label}
                    size="landing"
                    active={chip.active}
                    onToggle={() => toggleWeatherChip(idx)}
                  >
                    {chip.label}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Right Column: the rest (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              {/* Top Row: H2 + paragraph beside News card */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="max-w-[440px]">
                  <h2 className="font-display font-[600] text-[34px] leading-[34px] text-black">
                    Get the Weather, News and updates that matter to you
                  </h2>
                  <p className="font-sans font-[400] text-[20px] leading-[30px] text-[var(--text)] mt-4">
                    Stay informed on the topics that matter most to you. Choose
                    from weather, news, sports, stocks, and more, all customized
                    to fit your day.
                  </p>
                </div>

                {/* News Card: white, radius 40px, 184px wide, padding 24px */}
                <div
                  className="w-full md:w-[184px] shrink-0 bg-white rounded-[40px] p-6 flex flex-col"
                  style={{
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <GradientIcon icon={Newspaper} size={40} />
                  </div>
                  <h4 className="font-display font-[600] text-[26px] text-black mt-4">
                    News
                  </h4>
                  <p className="font-sans font-[400] text-[14px] leading-[20px] text-[var(--text-muted-sm)] mt-2">
                    Stay informed with daily news that&apos;s most relevant to
                    you.
                  </p>
                </div>
              </div>

              {/* Bottom 3 columns: Sports, Horoscope, Stocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sports */}
                <div className="border-t border-black pt-9 flex flex-col">
                  <div className="flex items-center gap-3">
                    <GradientIcon icon={Trophy} size={36} />
                    <h4 className="font-display font-[600] text-[26px] text-black">
                      Sports
                    </h4>
                  </div>
                  <p className="font-sans font-[400] text-[16px] leading-[24px] text-[var(--text)] mt-3">
                    Receive updates on your favorite sports and teams.
                  </p>
                </div>

                {/* Horoscope */}
                <div className="border-t border-black pt-9 flex flex-col">
                  <div className="flex items-center gap-3">
                    <GradientIcon icon={Aperture} size={36} />
                    <h4 className="font-display font-[600] text-[26px] text-black">
                      Horoscope
                    </h4>
                  </div>
                  <p className="font-sans font-[400] text-[16px] leading-[24px] text-[var(--text)] mt-3">
                    Start your day with insights tailored to your zodiac sign.
                  </p>
                </div>

                {/* Stocks */}
                <div className="border-t border-black pt-9 flex flex-col">
                  <div className="flex items-center gap-3">
                    <GradientIcon icon={CandlestickChart} size={36} />
                    <h4 className="font-display font-[600] text-[26px] text-black">
                      Stocks
                    </h4>
                  </div>
                  <p className="font-sans font-[400] text-[16px] leading-[24px] text-[var(--text)] mt-3">
                    Track up to three stocks daily for timely market updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* C. How It Works (bg --canvas, padding 96px 0) */}
        <section
          id="how-it-works"
          aria-label="How It Works"
          className="w-full bg-[var(--canvas)] py-24 px-6 flex flex-col items-center"
        >
          {/* H2 centered */}
          <h2 className="font-display font-[600] text-[32px] leading-[38px] md:text-[48px] md:leading-[56px] text-black text-center">
            How It Works
          </h2>

          {/* 56px gap */}
          <div className="h-14" />

          {/* Stack container 896px wide, bg #E5E5EA, radius 24px, display grid, gap 16px, overflow hidden */}
          <div className="w-full max-w-[896px] bg-[#E5E5EA] rounded-[24px] p-4 md:p-6 grid gap-4 overflow-hidden">
            {/* 1 */}
            <div className="w-full min-h-[96px] bg-white rounded-[24px] px-6 py-4 flex items-center gap-6">
              <IconTile icon={MailCheck} size={48} radius={14} iconSize={26} />
              <span className="font-sans font-[600] text-[20px] md:text-[22px] text-black">
                Sign up with just your email
              </span>
            </div>

            {/* 2 */}
            <div className="w-full min-h-[96px] bg-white rounded-[24px] px-6 py-4 flex items-center gap-6">
              <IconTile icon={MessagesSquare} size={48} radius={14} iconSize={26} />
              <span className="font-sans font-[600] text-[20px] md:text-[22px] text-black">
                Customize your digest preferences
              </span>
            </div>

            {/* 3 */}
            <div className="w-full min-h-[96px] bg-white rounded-[24px] px-6 py-4 flex items-center gap-6">
              <IconTile icon={Timer} size={48} radius={14} iconSize={26} />
              <span className="font-sans font-[600] text-[20px] md:text-[22px] text-black">
                Choose when to receive your daily digest
              </span>
            </div>

            {/* 4 */}
            <div className="w-full min-h-[96px] bg-white rounded-[24px] px-6 py-4 flex items-center gap-6">
              <IconTile icon={BanIcon} size={48} radius={14} iconSize={26} />
              <span className="font-sans font-[600] text-[20px] md:text-[22px] text-black">
                Get updates via SMS or email every day
              </span>
            </div>
          </div>

          {/* 64px gap */}
          <div className="h-16" />

          {/* DarkButton "Get your daily digest" centered */}
          <Link href="/signup" tabIndex={-1}>
            <DarkButton>Get your daily digest</DarkButton>
          </Link>
        </section>

        {/* D. FAQ (bg white, padding 96px 0) */}
        <section
          id="faq"
          aria-label="Frequently Asked Questions"
          className="w-full bg-white py-24 px-6 flex flex-col items-center"
        >
          {/* H2 centered */}
          <h2 className="font-display font-[600] text-[32px] leading-[38px] md:text-[48px] md:leading-[56px] text-black text-center">
            Frequently Asked Questions
          </h2>

          <div className="h-14" />

          {/* FAQ Items 896px wide, gap 16px */}
          <div className="w-full max-w-[896px] flex flex-col gap-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`w-full rounded-[24px] border transition-all duration-200 overflow-hidden ${
                    isOpen ? "bg-[#F8F9FB]" : "bg-white"
                  }`}
                  style={{ borderColor: "var(--line)" }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full min-h-[78px] px-8 py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[24px]"
                  >
                    <span className="font-sans font-[600] text-[20px] text-black pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-black shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-8 pb-6 pt-1">
                      <p className="font-sans font-[400] text-[16px] leading-[26px] text-[var(--text)]">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* E. Final CTA: bg #000, padding 96px 24px, centered */}
        <section
          aria-label="Get Started"
          className="w-full bg-black py-24 px-6 text-center flex flex-col items-center"
        >
          {/* H2 "Start Getting Your Daily Digest" */}
          <h2 className="font-display font-[600] text-[34px] leading-[44px] md:text-[56px] md:leading-[72px] text-white max-w-[760px]">
            Start Getting Your Daily Digest
          </h2>

          {/* 24px gap */}
          <div className="h-6" />

          {/* 20px/28px #E5E5E5 paragraph */}
          <p className="font-sans font-[400] text-[18px] md:text-[20px] leading-[28px] text-[#E5E5E5] max-w-xl">
            Join thousands of users who start their day informed. Free email plan
            available.
          </p>

          {/* 40px gap */}
          <div className="h-10" />

          {/* PrimaryButton lime at 76px high, 312px wide */}
          <Link href="/signup" tabIndex={-1}>
            <PrimaryButton size="cta">Get your daily digest</PrimaryButton>
          </Link>

          {/* 72px gap to footer links inside same black section */}
          <div className="h-[72px]" />

          {/* Footer bar */}
          <Footer />
        </section>
      </main>
    </div>
  );
};
