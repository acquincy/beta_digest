"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { TopLeftLogo } from "./TopLeftLogo";
import { CanvasB } from "./CanvasB";
import { OutlineButton } from "./primitives/Button";
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
import { DashboardBoard } from "./dashboard";

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
        <DashboardBoard
          userName={prefs.name}
          dateLabel={todayFormatted || "Daily Digest"}
          weather={weather}
          cityName={weather.city || prefs.city || "Seattle"}
          countryName={countryName}
          weatherTopics={prefs.weatherTopics}
          stories={stories}
          weatherLastUpdated={weatherLastUpdated}
          weatherLoading={weatherLoading && !realWeather}
          weatherError={weatherError && !realWeather ? weatherError : null}
          newsLoading={newsLoading && stories.length === 0}
          newsError={newsError && stories.length === 0 ? newsError : null}
          onRetryWeather={() => fetchWeather(prefs.city || "Seattle", prefs.countryCode || "US")}
          onRetryNews={() => fetchNews(prefs.newsTopics)}
          onStoryClick={openStoryModal}
          onSignOut={async () => {
            await logoutViaApi();
          }}
          triggerButtonRefs={triggerButtonRefs}
        />
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
              <span className="font-sans text-[12px] text-white/50">
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

            {/* Enriched Story Content */}
            <div className="font-sans font-[400] text-[14px] sm:text-[15px] text-white/80 leading-relaxed mb-6 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {selectedStory.summary.split("\n\n").map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {/* Modal Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
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
                <span>Read full article</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-black shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
