"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  CloudSun,
  LogOut,
  ArrowRight,
  X,
  FileText,
} from "lucide-react";
import { TopLeftLogo } from "./TopLeftLogo";
import { CanvasB } from "./CanvasB";
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

export const DashboardView: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);
  const [selectedStory, setSelectedStory] = useState<EditorialStory | null>(null);

  const [n8nDigest, setN8nDigest] = useState<N8nDashboardResult | null>(null);
  const [realWeather, setRealWeather] = useState<CityWeatherData | null>(null);
  const [realStories, setRealStories] = useState<EditorialStory[]>([]);

  // Load preferences strictly after mount
  useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
    setHydrated(true);

    let mounted = true;

    // Fetch real live weather from Open-Meteo API
    const city = loaded.city || "Seattle";
    const country = loaded.countryCode || "US";
    fetch(`/api/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=full`)
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data && typeof data.currentTemp === "number") {
          setRealWeather(data);
        }
      })
      .catch((err) => console.warn("Live weather fetch error:", err));

    // Fetch real live news stories from RSS feeds
    const topicsParam = loaded.newsTopics && loaded.newsTopics.length > 0
      ? loaded.newsTopics.join(",")
      : "technology,economy,science";
    fetch(`/api/news?topics=${encodeURIComponent(topicsParam)}`)
      .then((r) => r.json())
      .then((data) => {
        if (mounted && Array.isArray(data.stories) && data.stories.length > 0) {
          setRealStories(data.stories);
        }
      })
      .catch((err) => console.warn("Live news fetch error:", err));

    fetchDashboardViaN8n()
      .then((data: N8nDashboardResult | null) => {
        if (mounted && data) {
          if (data.weekly_digest || data.weather) {
            setN8nDigest(data);
          }
          if (data.user && typeof data.user === "object") {
            const u = data.user as Record<string, unknown>;
            setPrefs((prev) => {
              const candidateCity = typeof u.city === "string" && u.city.trim() ? u.city.trim() : "";
              const candidateCountry = typeof u.country_code === "string" && u.country_code.trim() ? u.country_code.trim().toUpperCase() : "";

              const resolvedCity = (candidateCity && candidateCity !== "Seattle")
                ? candidateCity
                : (prev.city && prev.city !== "Seattle")
                ? prev.city
                : (candidateCity || prev.city || "");

              const resolvedCountry = (candidateCountry && candidateCountry !== "US")
                ? candidateCountry
                : (prev.countryCode && prev.countryCode !== "US")
                ? prev.countryCode
                : (candidateCountry || prev.countryCode || "");

              const updated: Preferences = {
                ...prev,
                name: typeof u.name === "string" && u.name ? u.name : prev.name,
                city: resolvedCity,
                countryCode: resolvedCountry,
                newsTopics: Array.isArray(u.news_categories) && u.news_categories.length > 0 ? (u.news_categories as NewsTopicId[]) : prev.newsTopics,
                weatherTopics: Array.isArray(u.weather_categories) && u.weather_categories.length > 0 ? (u.weather_categories as WeatherTopicId[]) : prev.weatherTopics,
                deliveryHour: typeof u.send_time === "string" ? parseDeliveryHour(u.send_time) : prev.deliveryHour,
              };
              savePreferences(updated);
              return updated;
            });
          }
        }
      })
      .catch((err: unknown) => {
        console.warn("n8n dashboard fetch:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const n8nStories: EditorialStory[] = React.useMemo(() => {
    if (!n8nDigest?.weekly_digest || typeof n8nDigest.weekly_digest !== "object") return [];
    const wd = n8nDigest.weekly_digest;
    if (!Array.isArray(wd.articles) || wd.articles.length === 0) return [];
    return wd.articles.map((art: N8nDashboardArticle, idx: number) => {
      const topic = (art.category?.toLowerCase() || "technology") as NewsTopicId;
      return {
        id: `n8n-${idx}`,
        topic,
        topicLabel: art.category ? art.category.toUpperCase() : "GENERAL",
        headline: art.title || "Daily Digest Story",
        summary: art.summary || "",
        source: art.source || "Beta Digest Wire",
        timestamp: art.published_at ? "Today" : "Recently",
        url: art.url || "#",
      };
    });
  }, [n8nDigest]);

  const weather = realWeather || generateCityWeather(prefs.city, prefs.countryCode);
  const stories =
    realStories.length > 0
      ? realStories
      : n8nStories.length > 0
      ? n8nStories
      : getTop5Stories(prefs.newsTopics);

  const todayFormatted = hydrated
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
        .format(new Date())
        .replace(/, ([A-Za-z]+ \d+)/, " · $1")
    : "";

  // Always convert temperature to Celsius
  const toCelsius = (val: number | undefined | null): number | "—" => {
    if (typeof val !== "number" || isNaN(val)) return "—";
    const sourceUnit = weather.tempUnit || "";
    if (sourceUnit.includes("C")) {
      return Math.round(val);
    }
    return Math.round(((val - 32) * 5) / 9);
  };

  const displayCurrentTemp = toCelsius(weather.currentTemp);
  const displayHigh = toCelsius(weather.high);
  const displayLow = toCelsius(weather.low);
  const displaySpread =
    typeof displayHigh === "number" && typeof displayLow === "number"
      ? Math.abs(displayHigh - displayLow)
      : "—";

  const displayThreeDay = (weather.threeDay || []).map((d) => ({
    day: d.day,
    condition: d.condition,
    high: toCelsius(d.high),
    low: toCelsius(d.low),
  }));

  const hasSecondaryWeather =
    typeof weather.rainProb === "number" ||
    typeof weather.uvIndex === "number" ||
    typeof weather.airQuality === "number" ||
    !!weather.windSpeed;

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col pb-16">
      {/* Canvas B background */}
      <CanvasB showConcentricCircles={false} />

      {/* Top Utility Bar & Logo */}
      <header className="relative z-10 w-full max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-10 pt-7 pb-4 flex items-center justify-start">
        <TopLeftLogo />
      </header>

      {/* Translucent Frosted Main Dashboard Board */}
      <main className="relative z-10 w-full max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="main-glass-board p-6 sm:p-9 lg:p-11">
          {/* Greeting & Header Action Bar */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-7 mb-8 border-b border-white/[0.16]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/75 mb-1.5">
                {todayFormatted || "Daily Edition"}
              </p>
              <h1 className="editorial-title text-[36px] sm:text-[42px] font-medium tracking-tight text-white leading-none">
                {prefs.name ? `Hi, ${prefs.name}` : "Welcome back"}
              </h1>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Dark-Glass Edit Preferences Button */}
              <Link
                href="/preferences"
                className="dark-glass-pill px-4 py-2 text-[12px] font-medium text-white flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-white/75" aria-hidden="true" />
                <span>Edit preferences</span>
              </Link>

              {/* Dark-Glass Sign Out Button */}
              <button
                type="button"
                onClick={async () => {
                  await logoutViaApi();
                }}
                className="dark-glass-pill px-4 py-2 text-[12px] font-medium text-white/90 flex items-center gap-2 cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5 text-white/75" aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>
          </header>

          {!hydrated ? (
            /* Skeleton State while hydrating */
            <div className="flex-grow flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl dark-glass-panel flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white/80" aria-hidden="true" />
              </div>
              <h2 className="editorial-title text-[22px] font-medium text-white mb-2">
                Loading your daily briefing...
              </h2>
              <p className="font-sans text-[14px] text-white/70 max-w-sm mb-6">
                Gathering your personalized updates and local weather.
              </p>
              <div className="w-full max-w-[480px] dark-glass-panel p-5 flex flex-col gap-3 animate-pulse">
                <div className="w-24 h-4 bg-white/10 rounded-full" />
                <div className="w-full h-3.5 bg-white/[0.06] rounded-full" />
                <div className="w-4/5 h-3.5 bg-white/[0.06] rounded-full" />
              </div>
            </div>
          ) : (
            /* Interior 2-Column Asymmetric Layout */
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-7 lg:gap-8 items-start">
              {/* LEFT RAIL (340px sticky on desktop): Weather Card */}
              <aside className="lg:sticky lg:top-6 space-y-5">
                <div>
                  <div className="flex items-baseline justify-between mb-3 px-1">
                    <h2 className="editorial-title text-[22px] font-medium tracking-tight text-white">
                      Your weather · <span className="italic font-normal">{prefs.city || "Seattle"}</span>
                    </h2>
                  </div>

                  {/* Deep Obsidian Dark-Glass Weather Panel */}
                  <div className="dark-glass-panel p-6">
                    {/* Top Part: Current Temperature + High/Low */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/55 mb-3">
                        <span>CURRENT CONDITIONS</span>
                        <CloudSun className="w-4 h-4 text-amber-300/85" aria-hidden="true" />
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <span className="editorial-title text-[52px] font-medium tracking-tight text-white leading-none tabular-nums">
                          {displayCurrentTemp !== "—" ? `${displayCurrentTemp}°C` : "—"}
                        </span>
                        <span className="font-mono text-[11px] text-white/65 bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-full tabular-nums">
                          Spread <span className="text-white font-medium">{displaySpread}°</span>
                        </span>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between text-[13px] text-white/70 pt-3 border-t border-white/[0.07]">
                        <span className="text-white/90 font-medium capitalize">{weather.condition}</span>
                        <span className="font-mono text-[12px] text-white/70 tabular-nums">
                          H: <strong className="text-white font-semibold">{displayHigh !== "—" ? `${displayHigh}°C` : "—"}</strong> · L: <strong className="text-white font-semibold">{displayLow !== "—" ? `${displayLow}°C` : "—"}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Crisp 1px Horizontal Divider */}
                    <div className="h-px bg-white/[0.09] my-5" />

                    {/* Bottom Part: 3-Day Forecast */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/55 mb-2.5">
                        <span>3-DAY OUTLOOK</span>
                        <span>HIGH / LOW</span>
                      </div>

                      <div className="divide-y divide-white/[0.07] text-[13px]">
                        {displayThreeDay.map((d, i) => (
                          <div key={i} className="py-2.5 first:pt-1 last:pb-0.5 flex items-center justify-between">
                            <span className="font-medium text-white">{d.day}</span>
                            <span className="text-white/50 text-[12px] capitalize truncate max-w-[100px]">{d.condition}</span>
                            <span className="font-mono text-[12px] text-white/60 tabular-nums">
                              <strong className="text-white font-medium">{d.high !== "—" ? `${d.high}°C` : "—"}</strong> / <span>{d.low !== "—" ? `${d.low}°C` : "—"}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Secondary weather topic tags if available */}
                    {hasSecondaryWeather && (
                      <div className="mt-4 pt-3 border-t border-white/[0.07] flex flex-wrap gap-1.5">
                        {typeof weather.rainProb === "number" && (
                          <span className="dark-category-pill font-mono text-[10px] px-2.5 py-0.5 text-white/80">
                            Rain: {weather.rainProb}%
                          </span>
                        )}
                        {typeof weather.uvIndex === "number" && (
                          <span className="dark-category-pill font-mono text-[10px] px-2.5 py-0.5 text-white/80">
                            UV: {weather.uvIndex}
                          </span>
                        )}
                        {typeof weather.airQuality === "number" && (
                          <span className="dark-category-pill font-mono text-[10px] px-2.5 py-0.5 text-white/80">
                            AQI: {weather.airQuality}
                          </span>
                        )}
                        {weather.windSpeed && (
                          <span className="dark-category-pill font-mono text-[10px] px-2.5 py-0.5 text-white/80">
                            Wind: {weather.windSpeed} {weather.windUnit || "km/h"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </aside>

              {/* RIGHT COLUMN (1fr width): Unified Top 5 Stories Section */}
              <section>
                <div className="flex items-baseline justify-between gap-3 mb-3 px-1">
                  <h2 className="editorial-title text-[22px] font-medium tracking-tight text-white">
                    Your top 5 stories
                  </h2>
                  <span className="font-mono text-[11px] text-white/70">
                    Curated morning briefing
                  </span>
                </div>

                {/* Strictly Unified Dark-Glass Stories Container */}
                <div className="dark-glass-panel divide-y divide-white/[0.08] px-6 sm:px-8">
                  {stories.slice(0, 5).map((story, i) => (
                    <article
                      key={story.id || i}
                      onClick={() => setSelectedStory(story)}
                      className="py-6 first:pt-6 last:pb-6 group cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                        <span className="font-mono text-[12px] font-medium text-white/45">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="dark-category-pill font-mono px-3 py-0.5 text-[11px] font-medium">
                          {story.topicLabel}
                        </span>
                        <span className="font-mono text-[11px] text-white/50">
                          {story.source} · {story.timestamp}
                        </span>
                      </div>

                      <h3 className="editorial-title text-[20px] sm:text-[22px] font-medium text-white group-hover:text-amber-200/95 transition leading-snug mb-2">
                        {story.headline}
                      </h3>

                      <p className="text-[13.5px] text-white/65 leading-relaxed mb-3.5">
                        {story.summary}
                      </p>

                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-white/85 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                        <span>Read full story</span>
                        <ArrowRight className="w-3 h-3 text-current" aria-hidden="true" />
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Article Preview Modal */}
      {selectedStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="modal-glass-board w-full max-w-lg p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 text-[12px] flex-wrap">
                <span className="font-mono font-medium text-white/55">
                  {stories.findIndex((s) => s === selectedStory) >= 0
                    ? (stories.findIndex((s) => s === selectedStory) + 1).toString().padStart(2, "0")
                    : "01"}
                </span>
                <span className="dark-category-pill font-mono px-3 py-1 text-[11px]">
                  {selectedStory.topicLabel}
                </span>
                <span className="font-mono text-[11px] text-white/55">
                  {selectedStory.source} · {selectedStory.timestamp}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Close story preview"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <h3 className="editorial-title text-[24px] sm:text-[27px] font-medium text-white leading-snug mb-3.5">
              {selectedStory.headline}
            </h3>
            <p className="text-[14px] text-white/75 leading-relaxed mb-6">
              {selectedStory.summary}
            </p>

            <div className="pt-4 border-t border-white/[0.1] flex items-center justify-between flex-wrap gap-3">
              <span className="font-mono text-[11px] text-white/50">
                Dispatched via {selectedStory.source}
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="dark-glass-pill px-4 py-1.5 text-[12px] font-medium text-white/80 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={selectedStory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full text-[12px] font-semibold bg-white text-[#111115] hover:bg-white/90 transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Read on {selectedStory.source}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-current" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
