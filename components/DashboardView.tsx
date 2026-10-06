"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Smile,
  FileText,
  Sparkles,
  Send,
  Pencil,
  Check,
  Clock,
  ArrowRight,
  Sun,
  Wind,
  ShieldAlert,
  Droplets,
  Sunrise,
  Sunset,
  CloudSun,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Header } from "./Header";
import { CanvasB } from "./CanvasB";
import { IconTile } from "./primitives/IconTile";
import { DarkButton, PrimaryButton } from "./primitives/Button";
import { Chip } from "./primitives/Chip";
import { CityData, UserPreferences, EditorialStory } from "@/lib/types";
import { digestService, MOCK_STORIES } from "@/lib/mock-service";
import { getTimeUntilNextDispatch, TimeRemaining } from "@/lib/time-utils";
import { loadWizardState } from "@/lib/wizard-store";

export const DashboardView: React.FC = () => {
  const router = useRouter();
  const [wizardState] = useState(loadWizardState());
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Timezone-aware countdown
  const [countdown, setCountdown] = useState<TimeRemaining>({
    hours: 2,
    minutes: 45,
    seconds: 30,
    totalSeconds: 9930,
    formatted: "02:45:30",
  });

  // Settings Email Digests toggle
  const [emailDigestsActive, setEmailDigestsActive] = useState(true);

  // Load preferences and weather data
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const p = await digestService.getPreferences();
        const c = await digestService.getForecast(p.city || "Seattle");
        if (mounted) {
          setPrefs(p);
          setCityData(c);
          // Simulate realistic quick loading transition
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 800);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Update countdown
  useEffect(() => {
    if (!prefs) return;
    const tick = () => {
      const remaining = getTimeUntilNextDispatch(
        prefs.dispatchTime || "06:00",
        prefs.timezone || "America/Los_Angeles"
      );
      setCountdown(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [prefs]);

  const userName = wizardState.firstName || "Alex";
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Determine active banner variant
  let activeBanner: {
    type: "ACTION REQUIRED" | "ATTENTION" | "PAUSED";
    message: string;
    actionLabel: string;
    onAction: () => void;
  } | null = null;

  if (prefs?.isPaused) {
    activeBanner = {
      type: "PAUSED",
      message: "Vacation pause active. Daily morning digests are temporarily held.",
      actionLabel: "Resume delivery",
      onAction: async () => {
        if (!prefs) return;
        const updated = { ...prefs, isPaused: false };
        setPrefs(updated);
        await digestService.pauseDelivery(false);
      },
    };
  } else if (prefs && !prefs.editions.morning && !prefs.editions.midday && !prefs.editions.evening) {
    activeBanner = {
      type: "ATTENTION",
      message: "All editions are turned off. You will not receive any digests.",
      actionLabel: "Enable Morning Edition",
      onAction: async () => {
        if (!prefs) return;
        const updated = { ...prefs, editions: { ...prefs.editions, morning: true } };
        setPrefs(updated);
        await digestService.savePreferences(updated);
      },
    };
  } else if (prefs && prefs.channel === "sms" && !prefs.phone) {
    activeBanner = {
      type: "ACTION REQUIRED",
      message: "A mobile number is required to receive daily SMS summaries.",
      actionLabel: "Add phone number",
      onAction: () => router.push("/set-up-reports?step=1"),
    };
  }

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col pb-16">
      {/* Canvas B background */}
      <CanvasB showConcentricCircles={false} />

      {/* Header: logo only */}
      <Header />

      {/* Main dashboard content */}
      <main className="w-full max-w-[1340px] mx-auto px-4 md:px-6 flex flex-col gap-4">
        {/* Banner variant above left card if active */}
        {activeBanner && (
          <div className="w-full bg-black text-white rounded-[24px] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-3">
              <span
                className="font-sans font-[700] text-[12px] px-3 py-1 rounded-full uppercase"
                style={{
                  backgroundColor: "var(--lime)",
                  color: "#000000",
                }}
              >
                {activeBanner.type}
              </span>
              <span className="font-sans font-[500] text-[15px] text-white">
                {activeBanner.message}
              </span>
            </div>
            <button
              type="button"
              onClick={activeBanner.onAction}
              className="h-[38px] px-4 rounded-full bg-white hover:bg-[#E5E5E5] text-black font-sans font-[600] text-[13px] self-start sm:self-auto cursor-pointer transition-colors"
            >
              {activeBanner.actionLabel}
            </button>
          </div>
        )}

        {/* Two columns below with 16px page padding, gap 16px: left main card 795px (flex 1.6), right column 490px (flex 1) */}
        <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
          {/* Left Main Card: 795px (flex 1.6), white, radius 48px, padding 40px */}
          <div
            className="w-full lg:flex-[1.6] bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-[var(--line)] shadow-sm flex flex-col"
            style={{ minHeight: "680px" }}
          >
            {/* Header Row: IconTile 64px (Smile) + "Hi, {name}" 44px; date right-aligned, Inter 600 16px tabular */}
            <div className="flex items-center justify-between pb-6 border-b border-[var(--line)]">
              <div className="flex items-center gap-4">
                <IconTile icon={Smile} size={64} radius={20} iconSize={34} />
                <h1 className="font-display font-[600] text-[32px] md:text-[44px] leading-tight text-black">
                  Hi, {userName}
                </h1>
              </div>
              <span className="font-sans font-[600] text-[16px] text-black tabular-nums">
                {todayFormatted}
              </span>
            </div>

            {/* Content: Loading state OR Loaded state */}
            {loading ? (
              /* Loading State */
              <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
                {/* 64px lime square tile (radius 20px) with black FileText icon and 28px white circle badge with Sparkles */}
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 rounded-[20px] flex items-center justify-center"
                    style={{ backgroundColor: "var(--lime)" }}
                  >
                    <FileText className="w-8 h-8 text-black" aria-hidden="true" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center"
                    style={{ boxShadow: "var(--shadow-tile)" }}
                  >
                    <Sparkles className="w-4 h-4 text-black" aria-hidden="true" />
                  </div>
                </div>

                {/* Heading "Preparing your daily report..." 20px Red Hat Display */}
                <h2 className="font-display font-[600] text-[20px] text-black mb-2">
                  Preparing your daily report...
                </h2>

                {/* 14px olive-grey (#6B6B5A) sub */}
                <p className="font-sans font-[400] text-[14px] text-[#6B6B5A] max-w-sm mb-8">
                  We&apos;re gathering your personalized updates. This usually
                  takes just a moment.
                </p>

                {/* Skeleton panel bg #F7F7F2, border 1px --line, radius 20px, padding 20px */}
                <div
                  className="w-full max-w-[540px] bg-[#F7F7F2] rounded-[20px] p-5 border border-[var(--line)] flex flex-col gap-3 animate-pulse"
                  style={{ animationDuration: "1.4s" }}
                >
                  <div className="w-24 h-4 bg-[#CED6BE] rounded-[8px]" />
                  <div className="w-full h-4 bg-[#E0E4D6] rounded-[8px]" />
                  <div className="w-full h-4 bg-[#E0E4D6] rounded-[8px]" />
                  <div className="w-[70%] h-4 bg-[#E0E4D6] rounded-[8px]" />
                </div>
              </div>
            ) : (
              /* Loaded State */
              <div className="pt-6 flex flex-col gap-6">
                {/* Next-dispatch countdown (tabular) */}
                <div className="p-4 rounded-[24px] bg-[var(--lime-tint)] border border-[var(--lime)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-black" aria-hidden="true" />
                    <span className="font-sans font-[600] text-[15px] text-black">
                      Next morning dispatch
                    </span>
                  </div>
                  <span className="font-sans font-[700] text-[18px] text-black tabular-nums">
                    in {countdown.formatted}
                  </span>
                </div>

                {/* Hourly strip (horizontal scroll-snap, chips 72px wide) */}
                {cityData && cityData.hourly && (
                  <div>
                    <h3 className="font-sans font-[600] text-[16px] text-black mb-3">
                      Hourly Forecast ({cityData.city})
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 thin-scrollbar snap-x">
                      {cityData.hourly.map((h, i) => (
                        <div
                          key={i}
                          className="w-[72px] shrink-0 p-3 bg-white rounded-[24px] border border-[var(--line)] flex flex-col items-center gap-1.5 snap-start text-center select-none"
                        >
                          <span className="font-sans text-[12px] text-[var(--text-muted-sm)] tabular-nums">
                            {h.time}
                          </span>
                          <CloudSun className="w-5 h-5 text-black" aria-hidden="true" />
                          <span className="font-sans font-[700] text-[14px] text-black tabular-nums">
                            {h.temp}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3-day forecast (3 columns) */}
                {cityData && cityData.threeDay && (
                  <div>
                    <h3 className="font-sans font-[600] text-[16px] text-black mb-3">
                      3-Day Outlook
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {cityData.threeDay.map((d, i) => (
                        <div
                          key={i}
                          className="p-4 bg-white rounded-[24px] border border-[var(--line)] flex flex-col justify-between"
                        >
                          <div className="font-sans font-[600] text-[15px] text-black">
                            {d.day}
                          </div>
                          <div className="font-sans text-[13px] text-[var(--text-muted-sm)] mt-1">
                            {d.condition}
                          </div>
                          <div className="font-sans font-[700] text-[16px] text-black tabular-nums mt-3">
                            {d.high}° <span className="font-normal text-[var(--text-muted-sm)]">/ {d.low}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details micro-cards (UV, Wind, AQI, Humidity, Sun) */}
                {cityData && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 bg-white rounded-[24px] border border-[var(--line)] flex flex-col items-center text-center">
                      <Sun className="w-4 h-4 text-black mb-1" aria-hidden="true" />
                      <span className="text-[11px] text-[var(--text-muted-sm)]">UV Index</span>
                      <span className="font-sans font-[700] text-[15px] text-black tabular-nums">
                        {cityData.uvIndex}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-[24px] border border-[var(--line)] flex flex-col items-center text-center">
                      <Wind className="w-4 h-4 text-black mb-1" aria-hidden="true" />
                      <span className="text-[11px] text-[var(--text-muted-sm)]">Wind</span>
                      <span className="font-sans font-[700] text-[15px] text-black tabular-nums">
                        {cityData.wind.split(" ")[0]} mph
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-[24px] border border-[var(--line)] flex flex-col items-center text-center">
                      <ShieldAlert className="w-4 h-4 text-black mb-1" aria-hidden="true" />
                      <span className="text-[11px] text-[var(--text-muted-sm)]">AQI</span>
                      <span className="font-sans font-[700] text-[15px] text-black tabular-nums">
                        {cityData.airQuality}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-[24px] border border-[var(--line)] flex flex-col items-center text-center">
                      <Droplets className="w-4 h-4 text-black mb-1" aria-hidden="true" />
                      <span className="text-[11px] text-[var(--text-muted-sm)]">Humidity</span>
                      <span className="font-sans font-[700] text-[15px] text-black tabular-nums">
                        {cityData.humidity}%
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-[24px] border border-[var(--line)] flex flex-col items-center text-center col-span-2 sm:col-span-1">
                      <Sunrise className="w-4 h-4 text-black mb-1" aria-hidden="true" />
                      <span className="text-[11px] text-[var(--text-muted-sm)]">Sunrise</span>
                      <span className="font-sans font-[700] text-[13px] text-black tabular-nums">
                        {cityData.sunrise}
                      </span>
                    </div>
                  </div>
                )}

                {/* Digest Feed */}
                <div>
                  <h3 className="font-sans font-[600] text-[16px] text-black mb-3">
                    Curated Briefing
                  </h3>
                  <div className="space-y-3">
                    {MOCK_STORIES.slice(0, 2).map((story) => (
                      <div
                        key={story.id}
                        className="p-5 bg-white rounded-[24px] border border-[var(--line)] flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sans font-[600] text-[18px] text-black">
                            {story.headline}
                          </span>
                          <span
                            className="font-sans text-[11px] font-bold px-2 py-0.5 rounded-full uppercase"
                            style={{
                              backgroundColor: "var(--lime-tint)",
                              color: "#000000",
                            }}
                          >
                            {story.category}
                          </span>
                        </div>
                        <p className="font-sans font-[400] text-[14px] leading-[20px] text-[var(--text)] line-clamp-2">
                          {story.summary}
                        </p>
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-sans font-[600] text-[13px] text-[#2563EB] hover:underline self-start inline-flex items-center gap-1 mt-1"
                        >
                          Read full story →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 490px (flex 1) */}
          <div className="w-full lg:flex-[1] flex flex-col gap-4">
            {/* PlanCard: bg --accent-gradient, radius 32px, padding 32px, white text */}
            <div
              className="relative w-full rounded-[32px] p-8 text-white overflow-hidden shadow-sm"
              style={{ background: "var(--accent-gradient)" }}
            >
              {/* Outline PaperPlane icon 90px at top-right, white, 40% opacity */}
              <Send
                className="absolute top-6 right-6 w-[90px] h-[90px] text-white opacity-40 pointer-events-none"
                aria-hidden="true"
              />

              <div className="font-display font-[500] text-[24px] text-white">
                Your plan
              </div>
              <div className="font-display font-[700] text-[44px] leading-tight text-white mt-1">
                Free
              </div>

              {/* 24px gap */}
              <div className="h-6" />

              <div className="font-sans font-[700] text-[16px] uppercase tracking-wide text-white">
                RECLAIM YOUR TIME
              </div>
              <p className="font-sans font-[400] text-[16px] leading-[24px] text-white text-opacity-90 mt-2">
                36 days a year go to doomscrolling social feeds. Get informed in
                minutes &amp; save time.
              </p>

              {/* 24px gap */}
              <div className="h-6" />

              <DarkButton className="w-full h-[56px] text-white">
                Reclaim My Time
              </DarkButton>
            </div>

            {/* SettingsCard: bg rgba(255,255,255,0.55), backdrop blur 12px, radius 32px, padding 32px */}
            <div
              className="w-full rounded-[32px] p-8 border border-[var(--line)] shadow-sm flex flex-col"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              {/* Header row: "Your settings" 24px + "Email Digests" 14px/600 + chips Yes/No */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[var(--line)]">
                <h2 className="font-display font-[600] text-[24px] text-black">
                  Your settings
                </h2>
                <div className="flex items-center gap-2">
                  <span className="font-sans font-[600] text-[14px] text-black">
                    Email Digests
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEmailDigestsActive(true)}
                      className={`h-[30px] px-3 rounded-full font-sans text-[13px] font-medium cursor-pointer transition-colors ${
                        emailDigestsActive
                          ? "bg-[var(--lime)] text-black font-semibold"
                          : "bg-white text-black"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailDigestsActive(false)}
                      className={`h-[30px] px-3 rounded-full font-sans text-[13px] font-medium cursor-pointer transition-colors ${
                        !emailDigestsActive
                          ? "bg-[var(--lime)] text-black font-semibold"
                          : "bg-white text-black"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* 2-column tile grid gap 16px: each tile radius 24px, padding 24px, 160px min-height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Enabled tile (Email settings): bg white, IconTile 40px, title 16px with 22px lime check circle, Pencil 16px at top-right */}
                <div className="relative rounded-[24px] p-6 min-h-[160px] bg-white border border-[var(--line)] flex flex-col justify-between">
                  <Link
                    href="/set-up-reports?step=1"
                    aria-label="Edit email settings"
                    className="absolute top-5 right-5 hover:opacity-70 transition-opacity"
                  >
                    <Pencil className="w-4 h-4 text-black" aria-hidden="true" />
                  </Link>

                  <div className="flex items-center gap-3">
                    <IconTile icon={Mail} size={40} radius={12} iconSize={22} />
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-[600] text-[16px] text-black">
                        Digest Feed
                      </span>
                      {/* 22px lime check circle */}
                      <div
                        className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--lime)" }}
                      >
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <p className="font-sans font-[400] text-[12px] leading-[18px] text-[var(--text-muted-sm)] mt-4">
                    Active for {wizardState.selectedTopics.join(", ")} at{" "}
                    {wizardState.dispatchTime}.
                  </p>
                </div>

                {/* Disabled tile (SMS Settings): bg #E7E7E7, grey pencil, title grey, caption "(Only for paid users)" */}
                <div className="relative rounded-[24px] p-6 min-h-[160px] bg-[#E7E7E7] border border-[var(--line)] flex flex-col justify-between opacity-80 select-none">
                  <Pencil className="w-4 h-4 text-[#9A9A9A] absolute top-5 right-5" aria-hidden="true" />

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-[#9A9A9A]" aria-hidden="true" />
                    </div>
                    <span className="font-sans font-[600] text-[16px] text-[#7A7A7A]">
                      SMS Alerts
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="font-sans font-[400] text-[12px] leading-[18px] text-[#7A7A7A]">
                      Instant severe weather and market pings.
                    </p>
                    <span className="font-sans font-[600] text-[11px] text-[#7A7A7A] block mt-1">
                      (Only for paid users)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
