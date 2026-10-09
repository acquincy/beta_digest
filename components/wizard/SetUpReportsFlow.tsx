"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
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
import { CardShell } from "../primitives/CardShell";
import { SectionCard } from "../primitives/SectionCard";
import { GradientIcon } from "../primitives/IconTile";
import { PrimaryButton, OutlineButton } from "../primitives/Button";
import { Chip } from "../primitives/Chip";
import { Stepper } from "./Stepper";
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
import { mockService } from "@/lib/mock-service";
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

  // Load preferences strictly after mount
  useEffect(() => {
    setPrefs(loadPreferences());
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
    try {
      await savePreferencesViaN8n({
        city: prefs.city,
        country_code: prefs.countryCode,
        categories: prefs.newsTopics,
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

  // Deterministic weather and news data
  const weatherData = mockService.getWeather(prefs.city, prefs.countryCode);
  const stories = mockService.getStories(prefs.newsTopics);
  if (!hydrated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-8 md:py-12 overflow-x-hidden">
        <CanvasA />
        <div className="w-full max-w-[768px] h-[520px] bg-white rounded-[32px] md:rounded-[40px] animate-pulse" />
      </div>
    );
  }

  const deliveryTimeFormatted = formatHourOption(prefs.deliveryHour);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-8 md:py-12 overflow-x-hidden">
      <CanvasA />

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

          <h1 className="font-display font-[600] text-[26px] md:text-[32px] leading-[37px] text-black">
            When do you want your digest?
          </h1>

          <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1">
            Choose the time you would like to receive your daily digest.
          </p>

          <div className="h-10" />

          {/* SectionCard "Delivery time" with 24 hourly options */}
          <SectionCard>
            <h2 className="font-sans font-[600] text-[18px] leading-[24px] text-black">
              Delivery time
            </h2>
            <p className="font-sans font-[400] text-[14px] leading-[20px] text-[var(--text-muted-sm)] mt-1">
              What time would you like to receive your daily digest?
            </p>
            <div className="mt-6 flex items-center gap-2 font-sans text-[16px] text-black">
              <span>Receive digests at</span>
              <select
                value={prefs.deliveryHour}
                onChange={(e) =>
                  setPrefs((prev) => ({
                    ...prev,
                    deliveryHour: parseInt(e.target.value, 10),
                  }))
                }
                className="bg-transparent border-0 border-b border-black font-semibold text-black p-0 pr-4 pb-0.5 outline-none focus:outline-none focus:border-b-2 cursor-pointer tabular-nums"
              >
                {HOURLY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
                disabled={totalTopics === 0}
              >
                Continue
              </PrimaryButton>
            </div>
          }
        >
          <Stepper currentStep={2} />

          <h1 className="font-display font-[600] text-[26px] md:text-[32px] leading-[37px] text-black">
            What do you want in your digest?
          </h1>

          <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1">
            Pick up to 3 weather details and up to 5 news topics.
          </p>

          <div className="h-8" />

          {/* Exactly two SectionCards */}
          <div className="flex flex-col gap-4">
            {/* 1. Your weather */}
            <SectionCard>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-sans font-[600] text-[18px] text-black">
                  Your weather
                </h2>
                <span className="font-sans font-[600] text-[14px] text-[var(--text-muted-sm)] tabular-nums">
                  ({weatherTopics.length}/3)
                </span>
              </div>
              <p className="font-sans font-[400] text-[14px] text-[var(--text-muted-sm)] mb-4">
                Choose up to 3 details
              </p>

              <div
                role="group"
                aria-label="Weather topics"
                className="flex flex-wrap gap-2"
              >
                {WEATHER_TOPIC_ORDER.map((topicId) => {
                  const isActive = weatherTopics.includes(topicId);
                  const isMax = weatherTopics.length >= 3 && !isActive;

                  return (
                    <Chip
                      key={topicId}
                      size="onboarding"
                      active={isActive}
                      disabled={isMax}
                      onToggle={() => toggleWeatherTopic(topicId)}
                    >
                      {WEATHER_TOPIC_LABELS[topicId]}
                    </Chip>
                  );
                })}
              </div>

              {weatherTopics.length >= 3 && (
                <p className="text-[13px] text-[var(--text-muted-sm)] mt-3">
                  You&apos;ve reached the limit. Deselect one to choose another.
                </p>
              )}
            </SectionCard>

            {/* 2. Your news */}
            <SectionCard>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-sans font-[600] text-[18px] text-black">
                  Your news
                </h2>
                <span className="font-sans font-[600] text-[14px] text-[var(--text-muted-sm)] tabular-nums">
                  ({newsTopics.length}/5)
                </span>
              </div>
              <p className="font-sans font-[400] text-[14px] text-[var(--text-muted-sm)] mb-4">
                Choose up to 5 topics
              </p>

              <div
                role="group"
                aria-label="News topics"
                className="flex flex-wrap gap-2"
              >
                {NEWS_TOPIC_ORDER.map((topicId) => {
                  const isActive = newsTopics.includes(topicId);
                  const isMax = newsTopics.length >= 5 && !isActive;

                  return (
                    <Chip
                      key={topicId}
                      size="onboarding"
                      active={isActive}
                      disabled={isMax}
                      onToggle={() => toggleNewsTopic(topicId)}
                    >
                      {NEWS_TOPIC_LABELS[topicId]}
                    </Chip>
                  );
                })}
              </div>

              {newsTopics.length >= 5 && (
                <p className="text-[13px] text-[var(--text-muted-sm)] mt-3">
                  You&apos;ve reached the limit. Deselect one to choose another.
                </p>
              )}
            </SectionCard>
          </div>
        </CardShell>
      )}

      {/* STEP 3: Review your digest (REDESIGNED) */}
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

          <h1 className="font-display font-[600] text-[28px] md:text-[32px] leading-[37px] text-black">
            Review your digest
          </h1>
          <p className="font-sans font-[400] text-[18px] leading-[26px] text-[var(--text-muted)] mt-1">
            Here&apos;s a preview of what lands in your inbox.
          </p>

          {/* Two columns, 24px gap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-start">
            {/* Left 340px summary SectionCard */}
            <div className="lg:col-span-4 w-full">
              <SectionCard className="divide-y divide-[rgba(0,0,0,0.08)]">
                {/* Delivery time row */}
                <div className="py-4 first:pt-0 flex items-center justify-between">
                  <div>
                    <span className="font-sans font-[600] text-[14px] text-black">
                      Delivery time
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="block text-[14px] text-[var(--text-muted-sm)] underline hover:text-black cursor-pointer text-left mt-0.5"
                    >
                      Edit
                    </button>
                  </div>
                  <span className="font-sans font-[600] text-[14px] text-black tabular-nums">
                    {deliveryTimeFormatted}
                  </span>
                </div>

                {/* Location row */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <span className="font-sans font-[600] text-[14px] text-black">
                      Location
                    </span>
                    <div className="font-sans text-[13px] text-[var(--text-muted-sm)] mt-0.5">
                      {locationLabel}
                    </div>
                  </div>
                  <Link
                    href="/basic-info"
                    className="text-[14px] text-[var(--text-muted-sm)] underline hover:text-black shrink-0 ml-3"
                  >
                    Edit
                  </Link>
                </div>

                {/* Weather topics row */}
                {weatherTopics.length > 0 && (
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-[600] text-[14px] text-black">
                          Weather topics
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-[14px] text-[var(--text-muted-sm)] underline hover:text-black cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <span className="font-sans text-[13px] text-[var(--text-muted-sm)] tabular-nums">
                        ({weatherTopics.length}/3)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {weatherTopics.map((topId) => {
                        const Icon = WEATHER_ICONS[topId] || CloudSun;
                        return (
                          <div
                            key={topId}
                            className="h-[30px] px-3 rounded-full flex items-center gap-1.5 border border-[var(--lime)] select-none"
                            style={{ backgroundColor: "var(--lime-tint)" }}
                          >
                            <GradientIcon icon={Icon} size={16} />
                            <span className="font-sans text-[13px] text-black font-medium">
                              {WEATHER_TOPIC_LABELS[topId]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* News topics row */}
                {newsTopics.length > 0 && (
                  <div className="py-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-[600] text-[14px] text-black">
                          News topics
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-[14px] text-[var(--text-muted-sm)] underline hover:text-black cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <span className="font-sans text-[13px] text-[var(--text-muted-sm)] tabular-nums">
                        ({newsTopics.length}/5)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {newsTopics.map((topId) => {
                        const Icon = NEWS_ICONS[topId] || Landmark;
                        return (
                          <div
                            key={topId}
                            className="h-[30px] px-3 rounded-full flex items-center gap-1.5 border border-[var(--lime)] select-none"
                            style={{ backgroundColor: "var(--lime-tint)" }}
                          >
                            <GradientIcon icon={Icon} size={16} />
                            <span className="font-sans text-[13px] text-black font-medium">
                              {NEWS_TOPIC_LABELS[topId]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Right flexible email preview panel */}
            <div className="lg:col-span-8 w-full flex flex-col">
              <div className="w-full bg-white rounded-[24px] border border-[var(--line)] overflow-hidden">
                {/* Header band bg #F2F2F2, padding 20px */}
                <div className="bg-[#F2F2F2] p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-white stroke-[2]" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-sans font-[600] text-[15px] text-black">
                          BetaDigest &lt;dispatch@betadigest.com&gt;
                        </div>
                        <div className="font-sans text-[13px] text-[#6B6F76]">
                          To: {prefs.name}
                        </div>
                      </div>
                    </div>

                    <span className="font-sans text-[13px] text-[#6B6F76] tabular-nums">
                      Thu, Oct 8 · {deliveryTimeFormatted}
                    </span>
                  </div>

                  <h3 className="font-display font-[700] text-[20px] text-black mt-2">
                    Your BetaDigest for Thursday, October 8
                  </h3>
                </div>

                {/* Email Body padding 24px */}
                <div className="p-6 flex flex-col gap-6">
                  <div className="font-sans font-[500] text-[18px] text-black">
                    Good morning, {prefs.name}
                  </div>

                  {/* Weather block (only if weather topics selected) */}
                  {weatherTopics.length > 0 && (
                    <div className="border-t border-[rgba(0,0,0,0.08)] pt-4">
                      <h4 className="font-sans font-[700] text-[16px] text-black mb-3">
                        Weather in {prefs.city}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {weatherTopics.map((topId) => {
                          const Icon = WEATHER_ICONS[topId] || CloudSun;
                          if (topId === "hourly-3h") {
                            return (
                              <div
                                key={topId}
                                className="sm:col-span-3 p-3.5 rounded-[16px] bg-[var(--lime-tint)] border border-[rgba(0,0,0,0.06)] flex flex-col gap-2"
                              >
                                <div className="flex items-center gap-1.5 font-sans font-[600] text-[13px] text-black">
                                  <GradientIcon icon={Icon} size={15} />
                                  <span>3-Hour Breakdown</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {weatherData.hourly.map((h, idx) => (
                                    <div
                                      key={idx}
                                      className="text-center font-sans text-[12px] tabular-nums text-black"
                                    >
                                      <div className="text-[#6B6F76]">{h.time}</div>
                                      <div className="font-bold">{h.temp}{weatherData.tempUnit}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          if (topId === "forecast-3day") {
                            return (
                              <div
                                key={topId}
                                className="sm:col-span-3 p-3.5 rounded-[16px] bg-white border border-[rgba(0,0,0,0.1)] flex flex-col gap-2"
                              >
                                <div className="flex items-center gap-1.5 font-sans font-[600] text-[13px] text-black">
                                  <GradientIcon icon={Icon} size={15} />
                                  <span>3-Day Forecast</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {weatherData.threeDay.map((d, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2 rounded-[12px] bg-[#F9F9F9] text-center font-sans text-[12px] tabular-nums text-black"
                                    >
                                      <div className="font-semibold">{d.day}</div>
                                      <div className="text-[11px] text-[#6B6F76] truncate">{d.condition}</div>
                                      <div className="font-bold mt-1">
                                        {d.high}° / {d.low}{weatherData.tempUnit}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          let labelVal = "";
                          switch (topId) {
                            case "current-temperature":
                              labelVal = `${weatherData.currentTemp}${weatherData.tempUnit} (${weatherData.condition})`;
                              break;
                            case "high-low":
                              labelVal = `High ${weatherData.high}° / Low ${weatherData.low}°`;
                              break;
                            case "rain-chance":
                              labelVal = `${weatherData.rainProb}% chance`;
                              break;
                            case "thunderstorm-chance":
                              labelVal = `${weatherData.thunderstormProb}% chance`;
                              break;
                            case "cloudiness":
                              labelVal = `${weatherData.cloudiness}%`;
                              break;
                            case "uv-index":
                              labelVal = `${weatherData.uvIndex} (${weatherData.uvDescription})`;
                              break;
                            case "air-quality":
                              labelVal = `AQI ${weatherData.airQuality} (${weatherData.airQualityDescription})`;
                              break;
                            case "wind":
                              labelVal = weatherData.windFormatted;
                              break;
                            case "humidity":
                              labelVal = `${weatherData.humidity}%`;
                              break;
                            case "sun-times":
                              labelVal = `↑ ${weatherData.sunrise} · ↓ ${weatherData.sunset}`;
                              break;
                          }

                          return (
                            <div
                              key={topId}
                              className="p-3 rounded-[16px] bg-[#F9F9F9] border border-[rgba(0,0,0,0.06)] flex flex-col justify-between"
                            >
                              <div className="flex items-center gap-1.5 font-sans font-[500] text-[12px] text-[#6B6F76]">
                                <GradientIcon icon={Icon} size={14} />
                                <span className="truncate">{WEATHER_TOPIC_LABELS[topId]}</span>
                              </div>
                              <div className="font-sans font-[700] text-[14px] text-black mt-2 tabular-nums">
                                {labelVal}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* News block (only if news topics selected) */}
                  {newsTopics.length > 0 && (
                    <div className="border-t border-[rgba(0,0,0,0.08)] pt-4">
                      <h4 className="font-sans font-[700] text-[16px] text-black mb-3">
                        Top 5 stories
                      </h4>

                      <div className="space-y-4">
                        {stories.map((story, idx) => (
                          <div
                            key={`${story.id}-${idx}`}
                            className="flex flex-col gap-1.5 pb-4 border-b border-[rgba(0,0,0,0.06)] last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-[12px] font-bold text-[#8E9096] tabular-nums">
                                0{idx + 1}
                              </span>
                              <span
                                className="font-sans text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: "var(--lime-tint)",
                                  color: "#000000",
                                }}
                              >
                                {story.topicLabel}
                              </span>
                              <span className="text-[12px] text-[#8E9096]">
                                · {story.source}
                              </span>
                            </div>

                            <div className="font-sans font-[600] text-[16px] leading-snug text-black">
                              {story.headline}
                            </div>

                            <p className="font-sans font-[400] text-[14px] leading-relaxed text-[#6B6F76]">
                              {story.summary}
                            </p>

                            <a
                              href={story.url}
                              className="font-sans font-[500] text-[14px] text-black underline hover:opacity-80 self-start"
                            >
                              Read full story
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardShell>
      )}
    </div>
  );
};
