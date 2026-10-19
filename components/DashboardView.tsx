"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Clock,
  Calendar,
  ExternalLink,
  Thermometer,
  ArrowUpDown,
  CloudRain,
  CloudLightning,
  Cloud,
  Sun,
  Wind,
  Compass,
  Droplets,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import { TopLeftLogo } from "./TopLeftLogo";
import { CanvasB } from "./CanvasB";
import { WeatherWidgetIcon } from "./WeatherWidgetIcon";
import { SectionCard } from "./primitives/SectionCard";
import { PrimaryButton, OutlineButton } from "./primitives/Button";
import { WEATHER_ICONS } from "@/lib/icons";
import {
  Preferences,
  WeatherTopicId,
  NewsTopicId,
  CityWeatherData,
  EditorialStory,
} from "@/lib/types";
import { loadPreferences, savePreferences, parseDeliveryHour, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { generateCityWeather, getTop5Stories } from "@/lib/mock-service";
import { fetchDashboardViaN8n, N8nDashboardResult, N8nDashboardArticle, logoutViaApi } from "@/lib/n8n";
import { COUNTRIES } from "@/lib/geo";
import { clsx } from "clsx";

interface CompactMetricConfig {
  icon: LucideIcon;
  label: string;
  getValue: (w: CityWeatherData) => React.ReactNode;
}

const COMPACT_METRICS: Record<string, CompactMetricConfig> = {
  "current-temperature": {
    icon: Thermometer,
    label: "Current temp",
    getValue: (w) => `${w.currentTemp}${w.tempUnit}`,
  },
  "high-low": {
    icon: ArrowUpDown,
    label: "Day's High / Low",
    getValue: (w) => `H: ${w.high}° · L: ${w.low}°`,
  },
  "rain-chance": {
    icon: CloudRain,
    label: "Rain chance",
    getValue: (w) => `${w.rainProb}%`,
  },
  "thunderstorm-chance": {
    icon: CloudLightning,
    label: "Thunderstorm",
    getValue: (w) => `${w.thunderstormProb || 0}%`,
  },
  cloudiness: {
    icon: Cloud,
    label: "Cloudiness",
    getValue: (w) => `${w.cloudiness}%`,
  },
  "uv-index": {
    icon: Sun,
    label: "UV index",
    getValue: (w) => (
      <span className="flex items-center gap-1.5">
        <span>{w.uvIndex}</span>
        {w.uvDescription && (
          <span className="text-[11px] font-normal text-white/60 truncate">({w.uvDescription})</span>
        )}
      </span>
    ),
  },
  "air-quality": {
    icon: Wind,
    label: "Air quality",
    getValue: (w) => {
      const aqi = w.airQuality ?? 0;
      const color =
        aqi <= 50 ? "text-emerald-400" : aqi <= 100 ? "text-amber-400" : "text-rose-400";
      return (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>AQI {aqi}</span>
          {w.airQualityDescription && (
            <span className={clsx("text-[11px] font-semibold", color)}>
              · {w.airQualityDescription}
            </span>
          )}
        </span>
      );
    },
  },
  wind: {
    icon: Compass,
    label: "Wind",
    getValue: (w) => w.windFormatted || `${w.windSpeed} ${w.windUnit}`,
  },
  humidity: {
    icon: Droplets,
    label: "Humidity",
    getValue: (w) => `${w.humidity}%`,
  },
  "sun-times": {
    icon: Sunrise,
    label: "Sun times",
    getValue: (w) => (
      <span className="text-[12px] truncate">
        ↑ {w.sunrise} · ↓ {w.sunset}
      </span>
    ),
  },
};

export const DashboardView: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  // Data states
  const [realWeather, setRealWeather] = useState<CityWeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherLastUpdated, setWeatherLastUpdated] = useState<string>("");

  const [realStories, setRealStories] = useState<EditorialStory[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  const [n8nStories, setN8nStories] = useState<EditorialStory[]>([]);

  // Focus restoration ref for modal accessibility
  const triggerButtonRefs = useRef<(HTMLElement | null)[]>([]);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  // 1. Fetch live weather function
  const fetchWeather = useCallback(async (city: string, country: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=full&t=${Date.now()}`
      );
      if (!res.ok) throw new Error(`Weather fetch failed (HTTP ${res.status})`);
      const data = await res.json();
      if (data && typeof data.currentTemp === "number") {
        setRealWeather(data);
        const now = new Date();
        setWeatherLastUpdated(
          now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        );
      } else {
        throw new Error("Invalid weather payload");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load weather";
      setWeatherError(msg);
      // Fallback deterministic weather so the UI never breaks
      setRealWeather(generateCityWeather(city, country));
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // 2. Fetch live news stories function
  const fetchNews = useCallback(async (topics: NewsTopicId[]) => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const topicsParam = topics.length > 0 ? topics.join(",") : "technology,economy,science";
      const res = await fetch(`/api/news?topics=${encodeURIComponent(topicsParam)}&t=${Date.now()}`);
      if (!res.ok) throw new Error(`News fetch failed (HTTP ${res.status})`);
      const data = await res.json();
      if (data && Array.isArray(data.stories) && data.stories.length > 0) {
        setRealStories(data.stories);
      } else {
        setRealStories([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load news";
      setNewsError(msg);
      setRealStories(getTop5Stories(topics));
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // 3. Initial load on mount
  useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
    setHydrated(true);

    const city = loaded.city || "Seattle";
    const country = loaded.countryCode || "US";
    fetchWeather(city, country);
    fetchNews(loaded.newsTopics);

    let mounted = true;

    // Fetch n8n remote dashboard data (syncs user preferences from database)
    fetchDashboardViaN8n()
      .then((data: N8nDashboardResult | null) => {
        if (!mounted || !data) return;

        // If n8n returns weekly digest articles, store as fallback
        if (data.weekly_digest && typeof data.weekly_digest === "object" && Array.isArray(data.weekly_digest.articles)) {
          const parsed = data.weekly_digest.articles.map((art: N8nDashboardArticle, idx: number) => ({
            id: `n8n-${idx}`,
            topic: (art.category?.toLowerCase() || "technology") as NewsTopicId,
            topicLabel: art.category ? art.category.toUpperCase() : "GENERAL",
            headline: art.title || "Daily Digest Story",
            summary: art.summary || "",
            source: art.source || "Beta Digest Wire",
            timestamp: art.published_at ? "Today" : "Recently",
            url: art.url || "#",
          }));
          setN8nStories(parsed);
        }

        // Sync fresh remote user preferences from DB if available
        if (data.user && typeof data.user === "object") {
          const u = data.user as Record<string, unknown>;
          const dbCity = typeof u.city === "string" && u.city.trim() ? u.city.trim() : "";
          const dbCountry = typeof u.country_code === "string" && u.country_code.trim() ? u.country_code.trim().toUpperCase() : "";
          const dbWeather = Array.isArray(u.weather_categories) && u.weather_categories.length > 0 ? (u.weather_categories as WeatherTopicId[]) : null;
          const dbNews = Array.isArray(u.news_categories) && u.news_categories.length > 0 ? (u.news_categories as NewsTopicId[]) : null;

          setPrefs((prev) => {
            const resolvedCity = dbCity && dbCity !== "Seattle" ? dbCity : prev.city || dbCity || "Seattle";
            const resolvedCountry = dbCountry && dbCountry !== "US" ? dbCountry : prev.countryCode || dbCountry || "US";
            const resolvedWeather = dbWeather || prev.weatherTopics;
            const resolvedNews = dbNews || prev.newsTopics;

            const updated: Preferences = {
              ...prev,
              name: typeof u.name === "string" && u.name ? u.name : prev.name,
              city: resolvedCity,
              countryCode: resolvedCountry,
              weatherTopics: resolvedWeather,
              newsTopics: resolvedNews,
              deliveryHour: typeof u.send_time === "string" ? parseDeliveryHour(u.send_time) : prev.deliveryHour,
            };

            savePreferences(updated);

            // If remote categories differ from current, re-fetch live news & weather
            if (JSON.stringify(resolvedNews) !== JSON.stringify(prev.newsTopics)) {
              fetchNews(resolvedNews);
            }
            if (resolvedCity !== prev.city || resolvedCountry !== prev.countryCode) {
              fetchWeather(resolvedCity, resolvedCountry);
            }

            return updated;
          });
        }
      })
      .catch((err: unknown) => {
        console.warn("n8n dashboard background sync:", err);
      });

    return () => {
      mounted = false;
    };
  }, [fetchWeather, fetchNews]);

  // Derived weather and news
  const weather = realWeather || generateCityWeather(prefs.city || "Seattle", prefs.countryCode || "US");
  const stories =
    realStories.length > 0
      ? realStories.slice(0, 5)
      : n8nStories.length > 0
      ? n8nStories.slice(0, 5)
      : getTop5Stories(prefs.newsTopics).slice(0, 5);

  const countryObj = COUNTRIES.find((c) => c.code === (weather.country || prefs.countryCode));
  const countryName = countryObj ? countryObj.name : weather.country || "United States";

  const todayFormatted = hydrated
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    : "";

  const selectedStory = selectedStoryIndex !== null ? stories[selectedStoryIndex] : null;

  // Modal accessibility: body scroll lock and focus management
  useEffect(() => {
    if (selectedStoryIndex !== null) {
      document.body.style.overflow = "hidden";
      modalCloseBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedStoryIndex]);

  // Keyboard navigation inside modal (Escape, ArrowLeft, ArrowRight)
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeStoryModal();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevStory();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextStory();
    }
  };

  const openStoryModal = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const closeStoryModal = () => {
    const prevIndex = selectedStoryIndex;
    setSelectedStoryIndex(null);
    if (prevIndex !== null && triggerButtonRefs.current[prevIndex]) {
      triggerButtonRefs.current[prevIndex]?.focus();
    }
  };

  const prevStory = () => {
    setSelectedStoryIndex((curr) => {
      if (curr === null || curr <= 0) return curr;
      return curr - 1;
    });
  };

  const nextStory = () => {
    setSelectedStoryIndex((curr) => {
      if (curr === null || curr >= stories.length - 1) return curr;
      return curr + 1;
    });
  };

  // Weather preference filters
  const selectedWeatherTopics = prefs.weatherTopics || [];
  const selectedCompactTopics = selectedWeatherTopics.filter(
    (t) => t in COMPACT_METRICS && t !== "hourly-3h" && t !== "forecast-3day"
  );
  const showHourlySection = selectedWeatherTopics.includes("hourly-3h");
  const showForecastSection = selectedWeatherTopics.includes("forecast-3day");

  return (
    <div className="relative min-h-screen text-[#ededed] flex flex-col pb-16">
      {/* Canvas B background */}
      <CanvasB showConcentricCircles={false} />

      {/* Top Utility Bar & Logo */}
      <header className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-4 flex items-center justify-start">
        <TopLeftLogo />
      </header>

      {/* Main Dashboard Card Shell */}
      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl p-6 sm:p-9 lg:p-10 transition-all duration-200">
          
          {/* Header Action Bar: Date, Greeting, Buttons */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-7 mb-8 border-b border-white/10">
            <div>
              <p className="font-sans text-[13px] text-white/60 mb-1">
                {todayFormatted || "Daily Digest"}
              </p>
              <h1 className="font-display font-[600] text-[28px] sm:text-[36px] tracking-tight text-white leading-tight">
                {prefs.name ? (
                  <>
                    Good morning,{" "}
                    <span className="bg-gradient-to-r from-[#6b62f2] to-[#8a7cfb] bg-clip-text text-transparent">
                      {prefs.name}
                    </span>
                  </>
                ) : (
                  "Good morning"
                )}
              </h1>
            </div>

            {/* Right Side Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/preferences"
                className="h-[40px] px-5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-[13px] font-medium transition-all duration-150 hover:-translate-y-[1px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb] flex items-center gap-2 select-none cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
                <span>Edit preferences</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logoutViaApi();
                }}
                className="h-[40px] px-5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-[13px] font-medium transition-all duration-150 hover:-translate-y-[1px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb] flex items-center gap-2 select-none cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>
          </header>

          {/* Asymmetric 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN: Weather Section (Respecting Saved Preferences) */}
            <aside className="w-full space-y-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="font-sans font-[600] text-[18px] text-white">
                  Your weather
                </h2>
                <Link
                  href="/preferences"
                  className="font-sans text-[13px] text-white/60 hover:text-white underline transition-colors"
                >
                  Preferences
                </Link>
              </div>

              {/* Weather Content Card */}
              <SectionCard className="p-6">
                {weatherLoading && !realWeather ? (
                  /* Weather Loading Skeleton */
                  <div className="space-y-4 animate-pulse">
                    <div className="h-6 w-36 bg-white/10 rounded-full" />
                    <div className="h-16 w-full bg-white/[0.04] rounded-2xl" />
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <div className="h-16 bg-white/[0.03] rounded-xl" />
                      <div className="h-16 bg-white/[0.03] rounded-xl" />
                    </div>
                  </div>
                ) : weatherError && !realWeather ? (
                  /* Weather Error State */
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <AlertTriangle className="w-7 h-7 text-amber-400 mb-2" aria-hidden="true" />
                    <p className="font-sans text-[14px] font-medium text-white mb-1">
                      Weather data unavailable
                    </p>
                    <p className="font-sans text-[12px] text-white/60 mb-4 max-w-xs">
                      {weatherError}
                    </p>
                    <button
                      type="button"
                      onClick={() => fetchWeather(prefs.city || "Seattle", prefs.countryCode || "US")}
                      className="h-[36px] px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-[12px] font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                ) : (
                  /* Weather Loaded Content */
                  <div className="space-y-5">
                    {/* Hero Block: Location, Condition Icon, Condition Text, Temp, High/Low */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-sans text-[13px] font-medium text-white/60 truncate">
                          {weather.city || prefs.city || "Seattle"}, {countryName}
                        </div>
                        <div className="font-sans font-[600] text-[16px] text-white capitalize mt-0.5">
                          {weather.condition}
                        </div>
                        <div className="font-sans text-[12px] text-white/60 tabular-nums mt-1">
                          H: <strong className="text-white font-medium">{weather.high}°</strong>
                          {" · "}
                          L: <strong className="text-white font-medium">{weather.low}°</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right shrink-0">
                        <div className="p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0">
                          <WeatherWidgetIcon condition={weather.condition} size={42} />
                        </div>
                        <div className="font-sans font-[700] text-[36px] sm:text-[40px] text-white tracking-tight leading-none tabular-nums">
                          {weather.currentTemp}{weather.tempUnit}
                        </div>
                      </div>
                    </div>

                    {/* Selected Compact Metrics (Max 3, rendered only if selected) */}
                    {selectedCompactTopics.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="font-sans text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2.5">
                          Selected Details ({selectedCompactTopics.length}/3)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {selectedCompactTopics.map((topId) => {
                            const config = COMPACT_METRICS[topId];
                            if (!config) return null;
                            const Icon = config.icon;
                            return (
                              <div
                                key={topId}
                                className="p-3 rounded-[16px] bg-white/[0.04] border border-white/10 flex flex-col justify-between transition-all hover:border-white/20"
                              >
                                <div className="flex items-center gap-1.5 text-white/60 text-[12px] font-sans font-medium">
                                  <Icon className="w-3.5 h-3.5 text-[#8a7cfb] shrink-0" aria-hidden="true" />
                                  <span className="truncate">{config.label}</span>
                                </div>
                                <div className="font-sans text-[13.5px] font-[600] text-white mt-1.5 tabular-nums">
                                  {config.getValue(weather)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3-Hour Breakdown (rendered ONLY if selected in preferences) */}
                    {showHourlySection && weather.hourly && weather.hourly.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2.5">
                          <Clock className="w-3.5 h-3.5 text-[#8a7cfb]" aria-hidden="true" />
                          <span>3-Hour Breakdown</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {weather.hourly.slice(0, 4).map((h, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-[14px] bg-white/[0.04] border border-white/10 flex flex-col items-center"
                            >
                              <span className="font-sans text-[11px] text-white/60 tabular-nums">
                                {h.time}
                              </span>
                              <WeatherWidgetIcon condition={h.condition} size={22} className="my-1" />
                              <span className="font-sans text-[12px] font-bold text-white tabular-nums">
                                {h.temp}°
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3-Day Forecast Outlook (rendered ONLY if selected in preferences) */}
                    {showForecastSection && weather.threeDay && weather.threeDay.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2.5">
                          <Calendar className="w-3.5 h-3.5 text-[#8a7cfb]" aria-hidden="true" />
                          <span>3-Day Forecast</span>
                        </div>
                        <div className="divide-y divide-white/[0.08]">
                          {weather.threeDay.map((d, idx) => (
                            <div
                              key={idx}
                              className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-[13px]"
                            >
                              <span className="font-sans font-medium text-white/90 w-[70px]">
                                {d.day}
                              </span>
                              <div className="flex items-center gap-1.5 flex-1 justify-center">
                                <WeatherWidgetIcon condition={d.condition} size={20} />
                                <span className="font-sans text-[11px] text-white/60 capitalize truncate max-w-[85px] hidden sm:inline">
                                  {d.condition}
                                </span>
                              </div>
                              <span className="font-sans text-[12px] text-white/70 tabular-nums text-right w-[80px]">
                                <strong className="text-white font-semibold">{d.high}°</strong> / {d.low}°
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* If user selected no details, show gentle nudge */}
                    {selectedWeatherTopics.length === 0 && (
                      <div className="pt-3 border-t border-white/10 text-center py-2">
                        <p className="font-sans text-[13px] text-white/60">
                          No extra details selected.
                        </p>
                        <Link
                          href="/preferences"
                          className="font-sans text-[12px] text-[#8a7cfb] hover:underline mt-1 inline-block"
                        >
                          Customize weather cards
                        </Link>
                      </div>
                    )}

                    {/* Footer: Last Updated & Edit Link */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-sans text-[12px] text-white/50">
                      <span>Last updated {weatherLastUpdated || "Just now"}</span>
                      <Link
                        href="/preferences"
                        className="text-white/70 hover:text-white underline transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                )}
              </SectionCard>
            </aside>

            {/* RIGHT COLUMN: News Section */}
            <section className="w-full space-y-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="font-sans font-[600] text-[18px] text-white">
                  Top 5 stories
                </h2>
                <span className="font-sans text-[13px] text-white/60">
                  Curated morning dispatch
                </span>
              </div>

              {/* News List Container */}
              <SectionCard className="p-6 sm:p-8">
                {newsLoading && stories.length === 0 ? (
                  /* News Loading Skeleton */
                  <div className="divide-y divide-white/10 space-y-5 animate-pulse">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="pt-5 first:pt-0 space-y-2.5">
                        <div className="h-4 w-32 bg-white/10 rounded-full" />
                        <div className="h-6 w-4/5 bg-white/[0.06] rounded-xl" />
                        <div className="h-4 w-full bg-white/[0.04] rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : newsError && stories.length === 0 ? (
                  /* News Error State */
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" aria-hidden="true" />
                    <p className="font-sans text-[15px] font-medium text-white mb-1">
                      Unable to load stories
                    </p>
                    <p className="font-sans text-[13px] text-white/60 mb-4 max-w-sm">
                      {newsError}
                    </p>
                    <button
                      type="button"
                      onClick={() => fetchNews(prefs.newsTopics)}
                      className="h-[38px] px-5 rounded-full bg-white text-black font-semibold text-[13px] inline-flex items-center gap-2 transition hover:bg-white/90 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  </div>
                ) : stories.length === 0 ? (
                  /* News Empty State */
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="font-sans text-[15px] font-medium text-white mb-1">
                      No stories found for your selected topics
                    </p>
                    <p className="font-sans text-[13px] text-white/60 mb-4">
                      Try adding more categories in your preferences.
                    </p>
                    <Link
                      href="/preferences"
                      className="h-[38px] px-5 rounded-full bg-white text-black font-semibold text-[13px] inline-flex items-center gap-2 hover:bg-white/90 transition"
                    >
                      <span>Choose topics</span>
                    </Link>
                  </div>
                ) : (
                  /* News Stories List */
                  <div className="divide-y divide-white/10">
                    {stories.map((story, i) => (
                      <article
                        key={story.id || i}
                        role="button"
                        tabIndex={0}
                        ref={(el) => {
                          triggerButtonRefs.current[i] = el;
                        }}
                        onClick={() => openStoryModal(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openStoryModal(i);
                          }
                        }}
                        className="py-5 first:pt-0 last:pb-0 -mx-3 px-3 rounded-2xl group cursor-pointer transition-all duration-150 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb]"
                        aria-label={`Open story: ${story.headline}`}
                      >
                        {/* Meta row: Index, Category Pill, Source, Timestamp */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-sans text-[12px] font-medium text-white/40 tabular-nums">
                            0{i + 1}
                          </span>
                          <span className="h-[24px] px-2.5 rounded-full text-[11px] font-medium bg-white/[0.06] border border-white/10 text-white/90 select-none inline-flex items-center">
                            {story.topicLabel}
                          </span>
                          <span className="font-sans text-[12px] text-white/50">
                            · {story.source}
                          </span>
                          <span className="font-sans text-[12px] text-white/40">
                            · {story.timestamp}
                          </span>
                        </div>

                        {/* Headline: Sans-serif font */}
                        <h3 className="font-sans font-[600] text-[17px] sm:text-[19px] text-white leading-snug group-hover:text-white/90 transition-colors mb-2">
                          {story.headline}
                        </h3>

                        {/* Summary: Line-clamped to 2 lines */}
                        <p className="font-sans font-[400] text-[13.5px] leading-relaxed text-white/70 line-clamp-2 mb-3">
                          {story.summary}
                        </p>

                        {/* Read full story action */}
                        <div className="font-sans font-[500] text-[13px] text-white/80 group-hover:text-white inline-flex items-center gap-1.5 transition-colors">
                          <span>Read full story</span>
                          <ExternalLink className="w-3 h-3 text-white/60 group-hover:text-white transition-colors" aria-hidden="true" />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </SectionCard>
            </section>
          </div>
        </div>
      </main>

      {/* News Preview Modal Dialog */}
      {selectedStory && selectedStoryIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
          onClick={closeStoryModal}
          onKeyDown={handleModalKeyDown}
        >
          <div
            className="bg-[#141418]/95 border border-white/15 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl w-full max-w-lg relative transition-all duration-150 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Pagination Controls & Close */}
            <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[12px] font-medium text-white/60 tabular-nums">
                  Story {selectedStoryIndex + 1} of {stories.length}
                </span>

                {/* Prev & Next Controls */}
                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    onClick={prevStory}
                    disabled={selectedStoryIndex === 0}
                    aria-label="Previous story"
                    className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-white transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextStory}
                    disabled={selectedStoryIndex === stories.length - 1}
                    aria-label="Next story"
                    className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-white transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                ref={modalCloseBtnRef}
                type="button"
                onClick={closeStoryModal}
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb]"
                aria-label="Close story preview"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Story Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="h-[24px] px-2.5 rounded-full text-[11px] font-medium bg-white/[0.06] border border-white/10 text-white/90">
                {selectedStory.topicLabel}
              </span>
              <span className="font-sans text-[12px] text-white/60">
                {selectedStory.source} · {selectedStory.timestamp}
              </span>
            </div>

            {/* Headline: Sans-serif */}
            <h2
              id="story-modal-title"
              className="font-sans font-[600] text-[20px] sm:text-[23px] text-white leading-snug mb-3.5"
            >
              {selectedStory.headline}
            </h2>

            {/* Full Summary */}
            <p className="font-sans font-[400] text-[14px] sm:text-[15px] text-white/75 leading-relaxed mb-6">
              {selectedStory.summary}
            </p>

            {/* Modal Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
              <span className="font-sans text-[12px] text-white/50">
                Dispatched via {selectedStory.source}
              </span>
              <div className="flex items-center gap-2.5">
                <OutlineButton
                  size="sm"
                  onClick={closeStoryModal}
                >
                  Close
                </OutlineButton>
                <a
                  href={selectedStory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[40px] px-5 text-[14px] inline-flex items-center justify-center font-sans font-[500] rounded-full select-none whitespace-nowrap bg-white text-black hover:bg-white hover:text-black hover:shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:-translate-y-[1px] active:scale-[0.97] transition-all duration-150 cursor-pointer"
                >
                  <span>Read on {selectedStory.source}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-black shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
