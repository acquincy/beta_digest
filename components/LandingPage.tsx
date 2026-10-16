"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CloudSun,
  Newspaper,
  MailCheck,
  MessagesSquare,
  Timer,
  Inbox,
  ChevronDown,
} from "lucide-react";
import { Header } from "./Header";
import { CanvasB } from "./CanvasB";
import { LandingHero } from "./LandingHero";
import { Chip } from "./primitives/Chip";
import { IconTile } from "./primitives/IconTile";
import { DarkButton } from "./primitives/Button";
import { Footer } from "./Footer";
import {
  WeatherTopicId,
  NewsTopicId,
  WEATHER_TOPIC_ORDER,
  NEWS_TOPIC_ORDER,
  WEATHER_TOPIC_LABELS,
  NEWS_TOPIC_LABELS,
} from "@/lib/types";

const INITIAL_ACTIVE_WEATHER: WeatherTopicId[] = [
  "current-temperature",
  "rain-chance",
  "uv-index",
];

const INITIAL_ACTIVE_NEWS: NewsTopicId[] = [
  "economy",
  "technology",
  "science",
  "health",
  "environment",
];

const FAQ_ITEMS = [
  {
    q: "How accurate is the forecast?",
    a: "We source high-resolution meteorological models updated every 15 minutes. Data is localized directly to your exact coordinates rather than a generic regional airport.",
  },
  {
    q: "What details can I include in my digest?",
    a: "You have full control over every detail including hourly breakdowns, UV index, air quality, wind, and sunrise or sunset times. You can also select the top stories across twelve essential news topics.",
  },
  {
    q: "Can I get alerts for severe weather?",
    a: "Yes. When severe weather watches or warnings are issued for your location, high-priority alert notices are automatically prepended to your morning briefing.",
  },
  {
    q: "What time will I receive my digest?",
    a: "You select your exact delivery window during onboarding, choosing any hour between 12:00 AM and 11:00 PM in your local time zone.",
  },
  {
    q: "Is this better than a weather app?",
    a: "BetaDigest eliminates bloated animations, invasive tracking, and unskippable ads. You get clean, dense, actionable facts delivered directly to your inbox.",
  },
  {
    q: "Does it work with my location?",
    a: "BetaDigest supports 195 sovereign countries and cities worldwide, plus custom locations across international regions.",
  },
];

export const LandingPage: React.FC = () => {
  const [activeWeather, setActiveWeather] = useState<WeatherTopicId[]>(INITIAL_ACTIVE_WEATHER);
  const [activeNews, setActiveNews] = useState<NewsTopicId[]>(INITIAL_ACTIVE_NEWS);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleWeather = (id: WeatherTopicId) => {
    if (activeWeather.includes(id)) {
      setActiveWeather((prev) => prev.filter((t) => t !== id));
    } else if (activeWeather.length < 3) {
      setActiveWeather((prev) => [...prev, id]);
    }
  };

  const toggleNews = (id: NewsTopicId) => {
    if (activeNews.includes(id)) {
      setActiveNews((prev) => prev.filter((t) => t !== id));
    } else if (activeNews.length < 5) {
      setActiveNews((prev) => [...prev, id]);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col bg-[#0a0a0a]">
      {/* Canvas B background fixed behind hero */}
      <CanvasB />

      {/* Floating Pill Navigation Bar */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-grow flex flex-col">
        {/* A. Hero */}
        <LandingHero />

        {/* B. Features */}
        <section
          id="features"
          aria-label="Digest Features"
          className="w-full py-24 px-6 lg:px-12 relative"
        >
          <div className="max-w-[1140px] mx-auto flex flex-col items-center">
            {/* Eyebrow badge */}
            <div className="text-[12px] font-sans font-semibold uppercase tracking-widest text-[#8E9096] mb-3">
              TAILORED BRIEFS
            </div>

            {/* Centered header: H2 max-width 720px */}
            <h2 className="font-display font-[600] text-[32px] leading-[38px] md:text-[46px] md:leading-[54px] text-white text-center max-w-[720px] tracking-tight">
              Get the weather and news that matter to you
            </h2>

            {/* Paragraph */}
            <p className="font-sans font-[400] text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-[#8E9096] text-center max-w-[620px] mt-4">
              Pick up to 3 weather details and up to 5 news topics. Your digest arrives in your inbox at the hour you choose.
            </p>

            {/* 2-column grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mt-14 items-stretch">
              {/* Weather Card */}
              <div
                className="w-full bg-[#161616] border border-white/10 rounded-[32px] p-8 md:p-10 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/20 transition-colors"
              >
                <div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                    <CloudSun className="w-7 h-7 text-white" />
                  </div>

                  <div className="h-6" />

                  {/* Title */}
                  <h3 className="font-display font-[600] text-[28px] md:text-[32px] leading-tight text-white tracking-tight">
                    Weather
                  </h3>

                  {/* Description */}
                  <p className="font-sans font-[400] text-[16px] leading-[26px] text-[#8E9096] mt-3">
                    Precise weather for your exact city, tailored to your preferences.
                  </p>
                </div>

                {/* Counter and chips */}
                <div className="mt-10 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-sans font-[500] text-[14px] text-white">
                      Select weather details
                    </span>
                    <span className="font-sans font-[500] text-[14px] text-[#8E9096] tabular-nums">
                      ({activeWeather.length}/3)
                    </span>
                  </div>

                  <div
                    role="group"
                    aria-label="Weather metrics selection"
                    className="flex flex-wrap gap-2"
                  >
                    {WEATHER_TOPIC_ORDER.map((topicId) => {
                      const isActive = activeWeather.includes(topicId);
                      const isMax = activeWeather.length >= 3 && !isActive;

                      return (
                        <Chip
                          key={topicId}
                          size="landing"
                          active={isActive}
                          disabled={isMax}
                          onToggle={() => toggleWeather(topicId)}
                        >
                          {WEATHER_TOPIC_LABELS[topicId]}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* News Card */}
              <div
                className="w-full bg-[#161616] border border-white/10 rounded-[32px] p-8 md:p-10 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/20 transition-colors"
              >
                <div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                    <Newspaper className="w-7 h-7 text-white" />
                  </div>

                  <div className="h-6" />

                  {/* Title */}
                  <h3 className="font-display font-[600] text-[28px] md:text-[32px] leading-tight text-white tracking-tight">
                    News
                  </h3>

                  {/* Description */}
                  <p className="font-sans font-[400] text-[16px] leading-[26px] text-[#8E9096] mt-3">
                    The 5 stories that matter, on the topics you choose.
                  </p>
                </div>

                {/* Counter and chips */}
                <div className="mt-10 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-sans font-[500] text-[14px] text-white">
                      Select news topics
                    </span>
                    <span className="font-sans font-[500] text-[14px] text-[#8E9096] tabular-nums">
                      ({activeNews.length}/5)
                    </span>
                  </div>

                  <div
                    role="group"
                    aria-label="News topics selection"
                    className="flex flex-wrap gap-2"
                  >
                    {NEWS_TOPIC_ORDER.map((topicId) => {
                      const isActive = activeNews.includes(topicId);
                      const isMax = activeNews.length >= 5 && !isActive;

                      return (
                        <Chip
                          key={topicId}
                          size="landing"
                          active={isActive}
                          disabled={isMax}
                          onToggle={() => toggleNews(topicId)}
                        >
                          {NEWS_TOPIC_LABELS[topicId]}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* C. How It Works */}
        <section
          id="how-it-works"
          aria-label="How It Works"
          className="w-full py-24 px-6 flex flex-col items-center relative"
        >
          <div className="text-[12px] font-sans font-semibold uppercase tracking-widest text-[#8E9096] mb-3">
            DAILY ROUTINE
          </div>

          <h2 className="font-display font-[600] text-[32px] leading-[38px] md:text-[46px] md:leading-[54px] text-white text-center tracking-tight">
            How It Works
          </h2>

          <p className="font-sans font-[400] text-[16px] md:text-[18px] text-[#8E9096] text-center max-w-[560px] mt-4">
            Four simple steps to starting every morning with clarity and peace of mind.
          </p>

          <div className="h-12" />

          {/* Stack container 920px wide */}
          <div className="w-full max-w-[920px] flex flex-col gap-3.5">
            {/* Step 1 */}
            <div className="w-full min-h-[84px] bg-[#161616] border border-white/10 rounded-[22px] px-6 py-4 flex items-center justify-between hover:border-white/20 transition-all shadow-sm group">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#ededed] group-hover:text-white transition-colors shrink-0">
                  <MailCheck className="w-5 h-5 text-white" />
                </div>
                <span className="font-sans font-[500] text-[18px] md:text-[20px] text-white">
                  Sign up with just your email
                </span>
              </div>
              <span className="font-mono text-xs text-[#686868] uppercase tracking-wider pl-4">
                01
              </span>
            </div>

            {/* Step 2 */}
            <div className="w-full min-h-[84px] bg-[#161616] border border-white/10 rounded-[22px] px-6 py-4 flex items-center justify-between hover:border-white/20 transition-all shadow-sm group">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#ededed] group-hover:text-white transition-colors shrink-0">
                  <MessagesSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-sans font-[500] text-[18px] md:text-[20px] text-white">
                  Customize your digest preferences
                </span>
              </div>
              <span className="font-mono text-xs text-[#686868] uppercase tracking-wider pl-4">
                02
              </span>
            </div>

            {/* Step 3 */}
            <div className="w-full min-h-[84px] bg-[#161616] border border-white/10 rounded-[22px] px-6 py-4 flex items-center justify-between hover:border-white/20 transition-all shadow-sm group">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#ededed] group-hover:text-white transition-colors shrink-0">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <span className="font-sans font-[500] text-[18px] md:text-[20px] text-white">
                  Choose when to receive your daily digest
                </span>
              </div>
              <span className="font-mono text-xs text-[#686868] uppercase tracking-wider pl-4">
                03
              </span>
            </div>

            {/* Step 4 */}
            <div className="w-full min-h-[84px] bg-[#161616] border border-white/10 rounded-[22px] px-6 py-4 flex items-center justify-between hover:border-white/20 transition-all shadow-sm group">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#ededed] group-hover:text-white transition-colors shrink-0">
                  <Inbox className="w-5 h-5 text-white" />
                </div>
                <span className="font-sans font-[500] text-[18px] md:text-[20px] text-white">
                  Get your digest in your inbox every day
                </span>
              </div>
              <span className="font-mono text-xs text-[#686868] uppercase tracking-wider pl-4">
                04
              </span>
            </div>
          </div>

          <div className="h-12" />

          {/* DarkButton / Pill */}
          <Link href="/signup" tabIndex={-1}>
            <DarkButton className="!bg-white !text-black hover:!bg-[#eaeaea] font-medium shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
              Get your daily digest
            </DarkButton>
          </Link>
        </section>

        {/* D. FAQ */}
        <section
          id="faq"
          aria-label="Frequently Asked Questions"
          className="w-full py-24 px-6 flex flex-col items-center relative"
        >
          <div className="text-[12px] font-sans font-semibold uppercase tracking-widest text-[#8E9096] mb-3">
            QUESTIONS &amp; ANSWERS
          </div>

          <h2 className="font-display font-[600] text-[32px] leading-[38px] md:text-[46px] md:leading-[54px] text-white text-center tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="h-12" />

          <div className="w-full max-w-[896px] flex flex-col gap-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`w-full rounded-[22px] border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-[#181818] border-white/20"
                      : "bg-[#141414] border-white/10 hover:border-white/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full min-h-[72px] px-7 py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[22px]"
                  >
                    <span className="font-sans font-[500] text-[18px] md:text-[19px] text-[#ededed] pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8E9096] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-white" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-7 pb-6 pt-1 border-t border-white/5">
                      <p className="font-sans font-[400] text-[15px] md:text-[16px] leading-[26px] text-[#8E9096]">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* E. Final CTA */}
        <section
          aria-label="Get Started"
          className="relative w-full py-28 px-6 text-center flex flex-col items-center overflow-hidden"
        >
          {/* Radial Spotlight Accent behind CTA */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "700px",
              height: "400px",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "radial-gradient(ellipse at center, rgba(107, 98, 242, 0.22) 0%, transparent 70%)",
              zIndex: 0,
            }}
            aria-hidden="true"
          />

          {/* Dusk Violet Wash Strip */}
          <div
            className="w-full max-w-[400px] h-[1px] mb-12"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(107, 98, 242, 0.6) 50%, transparent)",
            }}
            aria-hidden="true"
          />

          {/* H2 */}
          <h2 className="relative z-10 font-display font-[600] text-[34px] leading-[44px] md:text-[54px] md:leading-[64px] text-white max-w-[760px] tracking-tight">
            Start Getting Your Beta Digest
          </h2>

          <div className="h-5" />

          {/* Paragraph */}
          <p className="relative z-10 font-sans font-[400] text-[17px] md:text-[19px] leading-[28px] text-[#8E9096] max-w-xl">
            Join thousands of users who start their day informed. Free forever.
          </p>

          <div className="h-10" />

          {/* PrimaryButton */}
          <Link href="/signup" tabIndex={-1} className="relative z-10">
            <DarkButton size="cta" className="!bg-white !text-black hover:!bg-[#eaeaea] font-medium shadow-[0_2px_16px_rgba(255,255,255,0.18)]">
              Get your daily digest
            </DarkButton>
          </Link>

          <div className="h-20" />

          <Footer />
        </section>
      </main>
    </div>
  );
};
