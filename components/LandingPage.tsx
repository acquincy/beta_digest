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
import { IconTile, GradientIcon } from "./primitives/IconTile";
import { PrimaryButton, DarkButton } from "./primitives/Button";
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
          <div className="max-w-[1120px] mx-auto flex flex-col items-center">
            {/* Centered header: H2 48px/56px max-width 720px */}
            <h2 className="font-display font-[600] text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] text-black text-center max-w-[720px]">
              Get the weather and news that matter to you
            </h2>

            {/* 16px gap, Paragraph (20px/30px, max-width 640px, centered) */}
            <p className="font-sans font-[400] text-[18px] leading-[26px] md:text-[20px] md:leading-[30px] text-[var(--text)] text-center max-w-[640px] mt-4">
              Pick up to 3 weather details and up to 5 news topics. Your digest arrives in your inbox at the hour you choose.
            </p>

            {/* 48px gap, then 2-column grid, equal widths, 24px gap, max-width 1120px */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12 items-stretch">
              {/* Weather Card: white, radius 40px, padding 40px */}
              <div
                className="w-full bg-white rounded-[40px] p-8 md:p-10 flex flex-col justify-between"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
              >
                <div>
                  {/* 64px gradient icon (CloudSun) */}
                  <div className="w-16 h-16 flex items-center justify-center">
                    <GradientIcon icon={CloudSun} size={64} />
                  </div>

                  {/* 24px gap */}
                  <div className="h-6" />

                  {/* Title "Weather" Red Hat Display 700 32px */}
                  <h3 className="font-display font-[700] text-[32px] leading-tight text-black">
                    Weather
                  </h3>

                  {/* 12px gap, Description 18px */}
                  <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text)] mt-3">
                    Precise weather for your exact city, tailored to your preferences.
                  </p>
                </div>

                {/* 32px gap, then counter and chips */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sans font-[600] text-[14px] text-black">
                      Select weather details
                    </span>
                    <span className="font-sans font-[600] text-[14px] text-[var(--text-muted-sm)] tabular-nums">
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

              {/* News Card: identical structure */}
              <div
                className="w-full bg-white rounded-[40px] p-8 md:p-10 flex flex-col justify-between"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
              >
                <div>
                  {/* 64px gradient icon (Newspaper) */}
                  <div className="w-16 h-16 flex items-center justify-center">
                    <GradientIcon icon={Newspaper} size={64} />
                  </div>

                  {/* 24px gap */}
                  <div className="h-6" />

                  {/* Title "News" Red Hat Display 700 32px */}
                  <h3 className="font-display font-[700] text-[32px] leading-tight text-black">
                    News
                  </h3>

                  {/* 12px gap, Description 18px */}
                  <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text)] mt-3">
                    The 5 stories that matter, on the topics you choose.
                  </p>
                </div>

                {/* 32px gap, then counter and chips */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sans font-[600] text-[14px] text-black">
                      Select news topics
                    </span>
                    <span className="font-sans font-[600] text-[14px] text-[var(--text-muted-sm)] tabular-nums">
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

          {/* Stack container 896px wide */}
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

            {/* 4 (L4: Get your digest in your inbox every day with Inbox icon) */}
            <div className="w-full min-h-[96px] bg-white rounded-[24px] px-6 py-4 flex items-center gap-6">
              <IconTile icon={Inbox} size={48} radius={14} iconSize={26} />
              <span className="font-sans font-[600] text-[20px] md:text-[22px] text-black">
                Get your digest in your inbox every day
              </span>
            </div>
          </div>

          {/* 64px gap */}
          <div className="h-16" />

          {/* DarkButton */}
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
          <h2 className="font-display font-[600] text-[32px] leading-[38px] md:text-[48px] md:leading-[56px] text-black text-center">
            Frequently Asked Questions
          </h2>

          <div className="h-14" />

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

        {/* E. Final CTA (L6) */}
        <section
          aria-label="Get Started"
          className="w-full bg-black py-24 px-6 text-center flex flex-col items-center"
        >
          {/* H2 "Start Getting Your Beta Digest" */}
          <h2 className="font-display font-[600] text-[34px] leading-[44px] md:text-[56px] md:leading-[72px] text-white max-w-[760px]">
            Start Getting Your Beta Digest
          </h2>

          <div className="h-6" />

          {/* Paragraph "Join thousands of users who start their day informed. Free forever." */}
          <p className="font-sans font-[400] text-[18px] md:text-[20px] leading-[28px] text-[#E5E5E5] max-w-xl">
            Join thousands of users who start their day informed. Free forever.
          </p>

          <div className="h-10" />

          {/* PrimaryButton */}
          <Link href="/signup" tabIndex={-1}>
            <PrimaryButton size="cta">Get your daily digest</PrimaryButton>
          </Link>

          <div className="h-[72px]" />

          <Footer />
        </section>
      </main>
    </div>
  );
};
