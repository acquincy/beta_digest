"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import {
  CloudSun,
  Thermometer,
  ArrowUpDown,
  Clock,
  Calendar,
  CloudRain,
  CloudLightning,
  Cloud,
  Sun,
  Wind,
  Compass,
  Droplets,
  Sunrise,
  Landmark,
  TrendingUp,
  HeartPulse,
  Leaf,
  Scale,
  Globe,
  GraduationCap,
  Atom,
  Users,
  AlertTriangle,
  Cpu,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { CanvasA } from "../CanvasA";
import { TopLeftLogo } from "../TopLeftLogo";
import { CardShell } from "../primitives/CardShell";
import { SectionCard } from "../primitives/SectionCard";
import { GradientIcon } from "../primitives/IconTile";
import { PrimaryButton, OutlineButton } from "../primitives/Button";
import { Chip } from "../primitives/Chip";
import { Stepper } from "./Stepper";
import { CustomSelect } from "../CustomSelect";
import {
  Preferences,
  WeatherTopicId,
  NewsTopicId,
  WEATHER_TOPIC_ORDER,
  NEWS_TOPIC_ORDER,
  WEATHER_TOPIC_LABELS,
  NEWS_TOPIC_LABELS,
} from "@/lib/types";
import { loadPreferences, savePreferences, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { HOURLY_OPTIONS, formatHourOption } from "@/lib/time-utils";
import { COUNTRIES } from "@/lib/geo";
import { savePreferencesViaN8n } from "@/lib/n8n";

export const WEATHER_ICONS: Record<WeatherTopicId, LucideIcon> = {
  "current-temperature": Thermometer,
  "high-low": ArrowUpDown,
  "hourly-3h": Clock,
  "forecast-3day": Calendar,
  "rain-chance": CloudRain,
  "thunderstorm-chance": CloudLightning,
  cloudiness: Cloud,
  "uv-index": Sun,
  "air-quality": Wind,
  wind: Compass,
  humidity: Droplets,
  "sun-times": Sunrise,
};

export const NEWS_ICONS: Record<NewsTopicId, LucideIcon> = {
  politics: Landmark,
  economy: TrendingUp,
  health: HeartPulse,
  environment: Leaf,
  crime: Scale,
  international: Globe,
  education: GraduationCap,
  science: Atom,
  society: Users,
  disasters: AlertTriangle,
  technology: Cpu,
  sports: Trophy,
};

export const SetUpReportsFlow: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);
  const [lockedTopic, setLockedTopic] = useState<{ id: string; category: "weather" | "news" } | null>(null);
  const lockedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLockedClick = (id: string, category: "weather" | "news") => {
    if (lockedTimeoutRef.current) {
      clearTimeout(lockedTimeoutRef.current);
    }
    setLockedTopic({ id, category });
    lockedTimeoutRef.current = setTimeout(() => {
      setLockedTopic(null);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (lockedTimeoutRef.current) {
        clearTimeout(lockedTimeoutRef.current);
      }
    };
  }, []);

  // Load preferences strictly after mount
  useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
    setHydrated(true);
  }, []);

  // Sync state to storage only after hydration
  useEffect(() => {
    if (hydrated) {
      savePreferences(prefs);
    }
  }, [prefs, hydrated]);

  // Current step 1, 2, or 3
  const rawStepParam = searchParams?.get("step");
  const parsedStep = parseInt(rawStepParam || "1", 10);
  const currentStep: 1 | 2 | 3 =
    parsedStep === 1 ? 1 : parsedStep === 2 ? 2 : 3;

  // Update step in URL
  const setStep = (stepNumber: 1 | 2 | 3) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", stepNumber.toString());
    window.history.pushState({}, "", url.toString());
  };

  const weatherTopics = prefs.weatherTopics;
  const newsTopics = prefs.newsTopics;
  const totalTopics = weatherTopics.length + newsTopics.length;

  // Step 2 toggle handlers
  const toggleWeatherTopic = (topic: WeatherTopicId) => {
    if (weatherTopics.includes(topic)) {
      setPrefs((prev) => ({
        ...prev,
        weatherTopics: prev.weatherTopics.filter((t) => t !== topic),
      }));
    } else if (weatherTopics.length < 3) {
      setPrefs((prev) => ({
        ...prev,
        weatherTopics: WEATHER_TOPIC_ORDER.filter(
          (t) => prev.weatherTopics.includes(t) || t === topic
        ).slice(0, 3),
      }));
    }
  };

  const toggleNewsTopic = (topic: NewsTopicId) => {
    if (newsTopics.includes(topic)) {
      setPrefs((prev) => ({
        ...prev,
        newsTopics: prev.newsTopics.filter((t) => t !== topic),
      }));
    } else if (newsTopics.length < 5) {
      setPrefs((prev) => ({
        ...prev,
        newsTopics: NEWS_TOPIC_ORDER.filter(
          (t) => prev.newsTopics.includes(t) || t === topic
        ).slice(0, 5),
      }));
    }
  };

  const handleFinish = async () => {
    savePreferences(prefs);
    const sendTimeFormatted = `${String(Math.max(0, Math.min(23, prefs.deliveryHour ?? 7))).padStart(2, "0")}:00:00`;
    try {
      await savePreferencesViaN8n({
        email: prefs.email,
        city: prefs.city,
        country_code: prefs.countryCode,
        categories: prefs.newsTopics,
        news_categories: prefs.newsTopics,
        weather_categories: prefs.weatherTopics,
        send_time: sendTimeFormatted,
        delivery_hour: prefs.deliveryHour,
      });
    } catch (err) {
      console.warn("n8n preferences dispatch:", err);
    }
    router.push("/dashboard");
  };

  // Country name lookup
  const countryObj = COUNTRIES.find((c) => c.code === prefs.countryCode);
  const countryName = countryObj ? countryObj.name : "United States";
  const locationLabel = `${prefs.city}, ${countryName}`;

  if (!hydrated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between items-center overflow-x-hidden">
        <CanvasA />
        <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
          <TopLeftLogo />
        </header>
        <main className="flex-grow flex items-center justify-center p-4 py-8 md:py-12 w-full">
          <div className="w-full max-w-[768px] h-[520px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] animate-pulse" />
        </main>
      </div>
    );
  }

  const deliveryTimeFormatted = formatHourOption(prefs.deliveryHour);

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-x-hidden">
      <CanvasA />
      <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
        <TopLeftLogo />
      </header>
      <main className="flex-grow flex items-center justify-center p-4 py-8 md:py-12 w-full">

      {/* STEP 1: Delivery time only */}
      {currentStep === 1 && (
        <CardShell
          footer={
            <div className="w-full flex justify-end">
              <PrimaryButton onClick={() => setStep(2)}>Continue</PrimaryButton>
            </div>
          }
        >
          <Stepper currentStep={1} />

          <h1 className="font-display font-[600] text-[26px] md:text-[32px] leading-[37px] text-white tracking-tight">
            When do you want your digest?
          </h1>

          <p className="font-sans font-[400] text-[16px] md:text-[18px] leading-[26px] text-white/75 mt-1">
            Choose the time you would like to receive your daily digest.
          </p>

          <div className="h-10" />

          {/* SectionCard "Delivery time" with 24 hourly options */}
          <SectionCard>
            <h2 className="font-sans font-[600] text-[18px] leading-[24px] text-white">
              Delivery time
            </h2>
            <p className="font-sans font-[400] text-[14px] leading-[20px] text-white/75 mt-1">
              What time would you like to receive your daily digest?
            </p>
            <div className="mt-6 flex items-center gap-2 font-sans text-[16px] text-[#ededed] flex-wrap sm:flex-nowrap">
              <span className="whitespace-nowrap">Receive digests at</span>
              <CustomSelect
                variant="underline"
                value={prefs.deliveryHour}
                onChange={(e) =>
                  setPrefs((prev) => ({
                    ...prev,
                    deliveryHour: parseInt(e.target.value, 10),
                  }))
                }
                options={HOURLY_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
                searchable
                searchPlaceholder="Search delivery hour..."
              />
            </div>
          </SectionCard>
        </CardShell>
      )}

      {/* STEP 2: Topics with caps 3 and 5 */}
      {currentStep === 2 && (
        <CardShell
          footer={
            <div className="w-full flex items-center justify-between">
              <OutlineButton onClick={() => setStep(1)}>Back</OutlineButton>
              <PrimaryButton
                onClick={() => setStep(3)}
                disabled={weatherTopics.length === 0 || newsTopics.length === 0}
              >
                Continue
              </PrimaryButton>
            </div>
          }
        >
          <Stepper currentStep={2} />

          <h1 className="font-display font-[600] text-[26px] md:text-[32px] leading-[37px] text-white tracking-tight">
            What do you want in your digest?
          </h1>

          <p className="font-sans font-[400] text-[16px] md:text-[18px] leading-[26px] text-white/75 mt-1">
            Pick up to 3 weather details and up to 5 news topics.
          </p>

          <div className="h-8" />

          {/* Exactly two SectionCards */}
          <div className="flex flex-col gap-4">
            {/* 1. Your weather */}
            <SectionCard>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-sans font-[600] text-[18px] text-white">
                  Your weather
                </h2>
                <span
                  key={weatherTopics.length}
                  className={clsx(
                    "font-sans text-[14px] tabular-nums transition-all duration-200 inline-block",
                    weatherTopics.length === 3
                      ? "text-[#8a7cfb] font-bold scale-105"
                      : "text-white/70 font-[600] scale-100"
                  )}
                >
                  ({weatherTopics.length}/3)
                </span>
              </div>
              <div className="mb-4">
                <p className="font-sans font-[400] text-[14px] text-white/75">
                  Choose up to 3 details
                </p>
                <p className="font-sans font-[400] text-[13px] text-white/50 mt-0.5 transition-colors duration-200">
                  {lockedTopic?.category === "weather" ? (
                    <span className="text-[#8a7cfb] font-medium transition-colors">
                      Deselect one to choose another
                    </span>
                  ) : (
                    <span>{weatherTopics.length} of 3 selected.</span>
                  )}
                </p>
              </div>

              <div
                role="group"
                aria-label="Weather topics"
                className="flex flex-wrap gap-2"
              >
                {WEATHER_TOPIC_ORDER.map((topicId) => {
                  const isActive = weatherTopics.includes(topicId);
                  const isMax = weatherTopics.length >= 3 && !isActive;
                  const isLockedShaking = lockedTopic?.id === topicId;
                  const Icon = WEATHER_ICONS[topicId] || CloudSun;

                  return (
                    <div key={topicId} className="relative inline-flex">
                      {isLockedShaking && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-[8px] bg-[#22222a] border border-white/20 text-white text-[12px] font-sans font-medium whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.6)] z-30 pointer-events-none transition-all duration-150 animate-in fade-in"
                        >
                          Deselect one to choose another
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#22222a]" />
                        </div>
                      )}
                      <Chip
                        size="onboarding"
                        active={isActive}
                        disabled={isMax}
                        shaking={isLockedShaking}
                        onToggle={() => toggleWeatherTopic(topicId)}
                        onLockedClick={() => handleLockedClick(topicId, "weather")}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{WEATHER_TOPIC_LABELS[topicId]}</span>
                        </span>
                      </Chip>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* 2. Your news */}
            <SectionCard>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-sans font-[600] text-[18px] text-white">
                  Your news
                </h2>
                <span
                  key={newsTopics.length}
                  className={clsx(
                    "font-sans text-[14px] tabular-nums transition-all duration-200 inline-block",
                    newsTopics.length === 5
                      ? "text-[#8a7cfb] font-bold scale-105"
                      : "text-white/70 font-[600] scale-100"
                  )}
                >
                  ({newsTopics.length}/5)
                </span>
              </div>
              <div className="mb-4">
                <p className="font-sans font-[400] text-[14px] text-white/75">
                  Choose up to 5 topics
                </p>
                <p className="font-sans font-[400] text-[13px] text-white/50 mt-0.5 transition-colors duration-200">
                  {lockedTopic?.category === "news" ? (
                    <span className="text-[#8a7cfb] font-medium transition-colors">
                      Deselect one to choose another
                    </span>
                  ) : (
                    <span>{newsTopics.length} of 5 selected.</span>
                  )}
                </p>
              </div>

              <div
                role="group"
                aria-label="News topics"
                className="flex flex-wrap gap-2"
              >
                {NEWS_TOPIC_ORDER.map((topicId) => {
                  const isActive = newsTopics.includes(topicId);
                  const isMax = newsTopics.length >= 5 && !isActive;
                  const isLockedShaking = lockedTopic?.id === topicId;
                  const Icon = NEWS_ICONS[topicId] || Landmark;

                  return (
                    <div key={topicId} className="relative inline-flex">
                      {isLockedShaking && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-[8px] bg-[#22222a] border border-white/20 text-white text-[12px] font-sans font-medium whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.6)] z-30 pointer-events-none transition-all duration-150 animate-in fade-in"
                        >
                          Deselect one to choose another
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#22222a]" />
                        </div>
                      )}
                      <Chip
                        size="onboarding"
                        active={isActive}
                        disabled={isMax}
                        shaking={isLockedShaking}
                        onToggle={() => toggleNewsTopic(topicId)}
                        onLockedClick={() => handleLockedClick(topicId, "news")}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{NEWS_TOPIC_LABELS[topicId]}</span>
                        </span>
                      </Chip>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </CardShell>
      )}

      {/* STEP 3: Review your digest (Summary only) */}
      {currentStep === 3 && (
        <CardShell
          width="review"
          footer={
            <div className="w-full flex items-center justify-between">
              <OutlineButton onClick={() => setStep(2)}>Back</OutlineButton>
              <PrimaryButton onClick={handleFinish}>Save &amp; finish</PrimaryButton>
            </div>
          }
        >
          <Stepper currentStep={3} />

          <h1 className="font-display font-[600] text-[28px] md:text-[32px] leading-[37px] text-white tracking-tight">
            Review your digest
          </h1>
          <p className="font-sans font-[400] text-[16px] md:text-[18px] leading-[26px] text-white/75 mt-1">
            Check your choices before you join.
          </p>

          <SectionCard className="divide-y divide-white/10 mt-8">
            {/* Name (& email if collected) */}
            <div className="py-4 first:pt-0 flex items-center justify-between">
              <div>
                <span className="font-sans font-[600] text-[14px] text-white">
                  {prefs.email ? "Name & email" : "Name"}
                </span>
                <div className="font-sans text-[14px] text-white/85 mt-0.5 font-medium">
                  {prefs.name || "Alex"}
                </div>
                {prefs.email && (
                  <div className="font-sans text-[13px] text-white/60 mt-0.5">
                    {prefs.email}
                  </div>
                )}
              </div>
              <Link
                href="/basic-info"
                className="text-[14px] text-white/70 underline hover:text-white shrink-0 ml-4 transition-colors"
              >
                Edit
              </Link>
            </div>

            {/* Delivery time */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <span className="font-sans font-[600] text-[14px] text-white">
                  Delivery time
                </span>
                <div className="font-sans text-[14px] text-white/85 mt-0.5 font-medium tabular-nums">
                  {deliveryTimeFormatted}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[14px] text-white/70 underline hover:text-white shrink-0 ml-4 transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Location */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <span className="font-sans font-[600] text-[14px] text-white">
                  Location
                </span>
                <div className="font-sans text-[14px] text-white/85 mt-0.5 font-medium">
                  {locationLabel}
                </div>
              </div>
              <Link
                href="/basic-info"
                className="text-[14px] text-white/70 underline hover:text-white shrink-0 ml-4 transition-colors"
              >
                Edit
              </Link>
            </div>

            {/* Weather topics */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-[600] text-[14px] text-white">
                    Weather topics
                  </span>
                  {weatherTopics.length > 0 && (
                    <span className="font-sans text-[13px] text-white/60 tabular-nums">
                      ({weatherTopics.length}/3)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[14px] text-white/70 underline hover:text-white shrink-0 ml-4 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {weatherTopics.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {weatherTopics.map((topId) => {
                    const Icon = WEATHER_ICONS[topId] || CloudSun;
                    return (
                      <div
                        key={topId}
                        className="h-[30px] px-3 rounded-full flex items-center gap-1.5 border border-white/10 bg-white/[0.04] text-white select-none"
                      >
                        <GradientIcon icon={Icon} size={16} />
                        <span className="font-sans text-[13px] text-white font-medium">
                          {WEATHER_TOPIC_LABELS[topId]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="font-sans text-[13px] text-white/50 italic mt-1">
                  No weather topics selected
                </div>
              )}
            </div>

            {/* News topics */}
            <div className="py-4 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-[600] text-[14px] text-white">
                    News topics
                  </span>
                  {newsTopics.length > 0 && (
                    <span className="font-sans text-[13px] text-white/60 tabular-nums">
                      ({newsTopics.length}/5)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[14px] text-white/70 underline hover:text-white shrink-0 ml-4 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {newsTopics.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newsTopics.map((topId) => {
                    const Icon = NEWS_ICONS[topId] || Landmark;
                    return (
                      <div
                        key={topId}
                        className="h-[30px] px-3 rounded-full flex items-center gap-1.5 border border-white/10 bg-white/[0.04] text-white select-none"
                      >
                        <GradientIcon icon={Icon} size={16} />
                        <span className="font-sans text-[13px] text-white font-medium">
                          {NEWS_TOPIC_LABELS[topId]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="font-sans text-[13px] text-white/50 italic mt-1">
                  No news topics selected
                </div>
              )}
            </div>
          </SectionCard>
        </CardShell>
      )}
      </main>
    </div>
  );
};
