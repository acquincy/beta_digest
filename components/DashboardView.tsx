"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  Clock,
  ArrowRight,
  Sun,
  CloudSun,
  Droplets,
  CloudLightning,
  Cloud,
  ShieldAlert,
  Wind,
  Sunrise,
  FileText,
  Sparkles,
} from "lucide-react";
import { Header } from "./Header";
import { CanvasB } from "./CanvasB";
import {
  Preferences,
  WeatherTopicId,
  WEATHER_TOPIC_ORDER,
  WEATHER_TOPIC_LABELS,
} from "@/lib/types";
import { loadPreferences, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { generateCityWeather, getTop5Stories } from "@/lib/mock-service";
import { getTimeUntilNextDispatch, formatHourOption, TimeRemaining } from "@/lib/time-utils";
import { fetchDashboardViaN8n, N8nDashboardResult } from "@/lib/n8n";

const SURFACES = ["#F6FFDD", "#FFFFFF", "rgba(213,134,206,0.14)"];

export const DashboardView: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);

  const [countdown, setCountdown] = useState<TimeRemaining>({
    hours: 2,
    minutes: 45,
    seconds: 30,
    totalSeconds: 9930,
    formatted: "02:45:30",
  });

  const [n8nDigest, setN8nDigest] = useState<N8nDashboardResult | null>(null);

  // Load preferences strictly after mount
  useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
    setHydrated(true);

    let mounted = true;
    fetchDashboardViaN8n()
      .then((data) => {
        if (mounted && data && (data.weekly_digest || data.weather)) {
          setN8nDigest(data);
        }
      })
      .catch((err) => {
        console.warn("n8n dashboard fetch:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Update countdown only after hydration
  useEffect(() => {
    if (!hydrated) return;

    const tz =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles"
        : "America/Los_Angeles";

    const tick = () => {
      const remaining = getTimeUntilNextDispatch(prefs.deliveryHour, tz);
      setCountdown(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [prefs.deliveryHour, hydrated]);

  const weather = generateCityWeather(prefs.city, prefs.countryCode);
  const stories = getTop5Stories(prefs.newsTopics);

  const todayFormatted = hydrated
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    : "";

  const selectedWeather = WEATHER_TOPIC_ORDER.filter((t) =>
    prefs.weatherTopics.includes(t)
  );

  const gridColsClass =
    selectedWeather.length === 1
      ? "grid grid-cols-1 gap-4"
      : selectedWeather.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
      : "grid grid-cols-1 sm:grid-cols-3 gap-4";

  const wideSpanClass =
    selectedWeather.length === 2
      ? "sm:col-span-2"
      : selectedWeather.length >= 3
      ? "sm:col-span-3"
      : "col-span-1";

  const renderWeatherWidget = (topicId: WeatherTopicId, index: number) => {
    const bgSurface = SURFACES[index % SURFACES.length];
    const isWide = topicId === "hourly-3h" || topicId === "forecast-3day";

    return (
      <div
        key={topicId}
        className={`rounded-[24px] p-5 md:p-6 border border-[rgba(0,0,0,0.08)] flex flex-col justify-between ${
          isWide ? wideSpanClass : ""
        }`}
        style={{ backgroundColor: bgSurface }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans font-[600] text-[13px] text-[#292B2D] uppercase tracking-wide">
            {WEATHER_TOPIC_LABELS[topicId]}
          </span>
          {topicId === "current-temperature" && (
            <Sun className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "high-low" && (
            <CloudSun className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "rain-chance" && (
            <Droplets className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "thunderstorm-chance" && (
            <CloudLightning className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "cloudiness" && (
            <Cloud className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "uv-index" && (
            <Sun className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "air-quality" && (
            <ShieldAlert className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "wind" && (
            <Wind className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "humidity" && (
            <Droplets className="w-5 h-5 text-black" aria-hidden="true" />
          )}
          {topicId === "sun-times" && (
            <Sunrise className="w-5 h-5 text-black" aria-hidden="true" />
          )}
        </div>

        {topicId === "current-temperature" && (
          <div>
            <div className="font-sans font-[700] text-[32px] md:text-[36px] text-black tabular-nums">
              {weather.currentTemp}{weather.tempUnit}
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] capitalize mt-1">
              {weather.condition}
            </div>
          </div>
        )}

        {topicId === "high-low" && (
          <div>
            <div className="font-sans font-[700] text-[24px] md:text-[28px] text-black tabular-nums">
              High {weather.high}{weather.tempUnit} / Low {weather.low}{weather.tempUnit}
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1 tabular-nums">
              Spread: {weather.high - weather.low}°
            </div>
          </div>
        )}

        {topicId === "hourly-3h" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {weather.hourly.map((h, i) => (
              <div
                key={i}
                className="bg-white/80 rounded-[18px] p-3 text-center border border-[rgba(0,0,0,0.06)]"
              >
                <div className="font-sans text-[12px] text-[#666] tabular-nums font-[500]">
                  {h.time}
                </div>
                <div className="font-sans font-[700] text-[18px] text-black tabular-nums my-1">
                  {h.temp}{weather.tempUnit}
                </div>
                <div className="font-sans text-[12px] text-[#444] truncate">
                  {h.condition}
                </div>
              </div>
            ))}
          </div>
        )}

        {topicId === "forecast-3day" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {weather.threeDay.map((d, i) => (
              <div
                key={i}
                className="bg-white/80 rounded-[18px] p-4 border border-[rgba(0,0,0,0.06)] flex flex-col justify-between"
              >
                <div className="font-sans font-[600] text-[14px] text-black">
                  {d.day}
                </div>
                <div className="font-sans text-[12px] text-[#666] mt-0.5">
                  {d.condition}
                </div>
                <div className="font-sans font-[700] text-[16px] text-black tabular-nums mt-2">
                  {d.high}{weather.tempUnit}{" "}
                  <span className="font-normal text-[#888]">
                    / {d.low}{weather.tempUnit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {topicId === "rain-chance" && (
          <div>
            <div className="font-sans font-[700] text-[32px] md:text-[36px] text-black tabular-nums">
              {weather.rainProb}%
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              Afternoon precipitation
            </div>
          </div>
        )}

        {topicId === "thunderstorm-chance" && (
          <div>
            <div className="font-sans font-[700] text-[32px] md:text-[36px] text-black tabular-nums">
              {weather.thunderstormProb}%
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              Isolated afternoon storm risk
            </div>
          </div>
        )}

        {topicId === "cloudiness" && (
          <div>
            <div className="font-sans font-[700] text-[32px] md:text-[36px] text-black tabular-nums">
              {weather.cloudiness}%
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              Sky coverage
            </div>
          </div>
        )}

        {topicId === "uv-index" && (
          <div>
            <div className="font-sans font-[700] text-[32px] md:text-[36px] text-black tabular-nums">
              {weather.uvIndex}
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              {weather.uvDescription} UV
            </div>
          </div>
        )}

        {topicId === "air-quality" && (
          <div>
            <div className="font-sans font-[700] text-[32px] md:text-[36px] text-black tabular-nums">
              {weather.airQuality}
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              AQI · {weather.airQualityDescription}
            </div>
          </div>
        )}

        {topicId === "wind" && (
          <div>
            <div className="font-sans font-[700] text-[28px] md:text-[32px] text-black tabular-nums">
              {weather.windSpeed} {weather.windUnit}
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              Direction {weather.windDirection}
            </div>
          </div>
        )}

        {topicId === "humidity" && (
          <div>
            <div className="font-sans font-[700] text-[32px] md:text-[36px] text-black tabular-nums">
              {weather.humidity}%
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              Relative humidity
            </div>
          </div>
        )}

        {topicId === "sun-times" && (
          <div>
            <div className="font-sans font-[700] text-[20px] md:text-[22px] text-black tabular-nums">
              ↑ {weather.sunrise} · ↓ {weather.sunset}
            </div>
            <div className="font-sans font-[500] text-[14px] text-[#555] mt-1">
              Daylight window
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col pb-16">
      {/* Canvas B background */}
      <CanvasB showConcentricCircles={false} />

      {/* Header */}
      <Header />

      {/* Main dashboard content: Single centered card, max-width 1120px */}
      <main className="w-full max-w-[1120px] mx-auto px-4 md:px-6 flex flex-col gap-6">
        <div
          className="w-full bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-[var(--line)] shadow-sm flex flex-col gap-8"
          style={{ boxShadow: "var(--shadow-slab)" }}
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
            <div>
              <h1 className="font-display font-[700] text-[32px] md:text-[36px] leading-tight text-black">
                {hydrated && prefs.name ? `Hi, ${prefs.name}` : "Hi"}
              </h1>
              {hydrated && todayFormatted && (
                <p className="font-sans font-[500] text-[15px] text-[#6B6B5A] tabular-nums mt-1">
                  {todayFormatted}
                </p>
              )}
            </div>
            <Link
              href="/set-up-reports?step=1"
              className="inline-flex items-center gap-2 h-[44px] px-5 rounded-full border border-black text-black hover:bg-black/5 font-sans font-[600] text-[14px] transition-colors whitespace-nowrap min-w-max self-start sm:self-auto"
            >
              <Sliders className="w-4 h-4 text-black" aria-hidden="true" />
              <span>Edit preferences</span>
            </Link>
          </div>

          {!hydrated ? (
            /* Existing Skeleton State while hydrating */
            <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
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

              <h2 className="font-display font-[600] text-[20px] text-black mb-2">
                Preparing your daily report...
              </h2>

              <p className="font-sans font-[400] text-[14px] text-[#6B6B5A] max-w-sm mb-8">
                We&apos;re gathering your personalized updates. This usually
                takes just a moment.
              </p>

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
            <>
              {/* Countdown row */}
              <div className="p-5 md:p-6 rounded-[24px] bg-black text-white flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-[var(--lime)]" aria-hidden="true" />
                    <span className="font-sans font-[600] text-[16px] text-white">
                      Next digest arrives in
                    </span>
                  </div>
                  <span
                    className="font-sans font-[700] text-[16px] md:text-[18px] text-black px-4 py-1.5 rounded-full tabular-nums self-start sm:self-auto"
                    style={{ backgroundColor: "var(--lime)" }}
                  >
                    {countdown.formatted}
                  </span>
                </div>
                <div className="font-sans font-[400] text-[13px] md:text-[14px] text-[#A3A3A3]">
                  Scheduled for {formatHourOption(prefs.deliveryHour)} daily · Delivered to {prefs.email}
                </div>
              </div>

              {/* Weather Section */}
              <section className="flex flex-col gap-4">
                <h3 className="font-display font-[600] text-[24px] text-black">
                  Your weather · {prefs.city}
                </h3>

                {selectedWeather.length === 0 ? (
                  <div className="p-6 rounded-[24px] bg-[#F7F7F2] border border-[var(--line)] text-center font-sans text-[15px] text-[#6B6B5A]">
                    No weather details selected ·{" "}
                    <Link
                      href="/set-up-reports?step=2"
                      className="text-black font-[600] underline hover:no-underline"
                    >
                      Edit preferences
                    </Link>
                  </div>
                ) : (
                  <div className={gridColsClass}>
                    {selectedWeather.map((topicId, i) =>
                      renderWeatherWidget(topicId, i)
                    )}
                  </div>
                )}
              </section>

              {/* Live Digest Summary from n8n Dashboard Workflow */}
              {n8nDigest?.weekly_digest && (
                <section className="p-5 md:p-6 rounded-[24px] bg-[#F6FFDD] border border-[rgba(0,0,0,0.08)] flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-black" aria-hidden="true" />
                    <h3 className="font-display font-[600] text-[20px] text-black">
                      AI Executive Summary
                    </h3>
                  </div>
                  <p className="font-sans font-[400] text-[15px] leading-relaxed text-[#292B2D] whitespace-pre-line">
                    {n8nDigest.weekly_digest}
                  </p>
                </section>
              )}

              {/* News Section */}
              <section className="flex flex-col gap-4">
                <h3 className="font-display font-[600] text-[24px] text-black">
                  Your top 5 stories
                </h3>

                {prefs.newsTopics.length === 0 ? (
                  <div className="p-6 rounded-[20px] bg-[#F7F7F2] border border-[var(--line)] text-center font-sans text-[15px] text-[#6B6B5A]">
                    No news topics selected ·{" "}
                    <Link
                      href="/set-up-reports?step=2"
                      className="text-black font-[600] underline hover:no-underline"
                    >
                      Edit preferences
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {stories.map((story, i) => (
                      <article
                        key={`${story.id}-${i}`}
                        className="p-5 rounded-[20px] bg-white border border-[rgba(0,0,0,0.08)] flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-sans text-[14px] text-[#888] tabular-nums font-[600]">
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                          <span className="font-sans font-[600] text-[12px] px-2.5 py-0.5 rounded-full bg-[#F2F2F2] text-[#292B2D]">
                            {story.topicLabel}
                          </span>
                          <span className="font-sans text-[13px] text-[#666]">
                            {story.source}
                          </span>
                          <span className="text-[#999] text-[13px]">·</span>
                          <span className="font-sans text-[13px] text-[#888]">
                            {story.timestamp}
                          </span>
                        </div>

                        <h4 className="font-sans font-[600] text-[18px] text-black leading-snug mt-1">
                          {story.headline}
                        </h4>

                        <p className="font-sans font-[400] text-[14px] leading-[22px] text-[#555] line-clamp-2">
                          {story.summary}
                        </p>

                        <a
                          href={story.url}
                          className="inline-flex items-center gap-1.5 font-sans font-[600] text-[13px] text-black hover:underline self-start mt-2"
                        >
                          <span>Read full story</span>
                          <ArrowRight className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                        </a>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
