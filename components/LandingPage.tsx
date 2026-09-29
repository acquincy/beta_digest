"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  WeatherData,
  TopicCategory,
  UserPreferences,
  BriefingStory,
} from "@/lib/types";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Bookmark,
  Check,
  Plus,
  Wind,
  Droplets,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  Calendar,
  AlertCircle,
  Coffee,
} from "lucide-react";
import { FALLBACK_WEATHER_PORT_HARCOURT } from "@/services/weather";
import { EDITORIAL_STORIES as INITIAL_STORIES } from "@/services/briefing";

interface LandingPageProps {
  onEnterDashboard: () => void;
  initialPreferences: UserPreferences;
  onPreferencesChange: (prefs: UserPreferences) => void;
}

interface TopicOption {
  id: TopicCategory;
  label: string;
}

const ALL_AVAILABLE_TOPICS: TopicOption[] = [
  { id: "tech", label: "Technology" },
  { id: "ai", label: "AI" },
  { id: "business", label: "Business" },
  { id: "startups", label: "Startups" },
  { id: "sports", label: "Sports" },
  { id: "world", label: "World" },
  { id: "science", label: "Science" },
];

export function LandingPage({
  onEnterDashboard,
  initialPreferences,
  onPreferencesChange,
}: LandingPageProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [showForecastDetails, setShowForecastDetails] = useState(false);

  // Stories & Bookmarks state
  const [stories, setStories] = useState<BriefingStory[]>(INITIAL_STORIES);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // City search modal
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; country: string; latitude: number; longitude: number }[]
  >([]);
  const [searchingCities, setSearchingCities] = useState(false);

  // Compute dynamic current date
  const dateFormatted = useMemo(() => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const date = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    }).toUpperCase();
    return `${day} · ${date}`;
  }, []);

  // Fetch weather data with fallback
  useEffect(() => {
    let isMounted = true;
    setLoadingWeather(true);
    setWeatherError(null);

    fetch(
      `/api/weather?lat=${preferences.latitude}&lon=${preferences.longitude}&city=${encodeURIComponent(
        preferences.city
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Weather service unreachable");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setLoadingWeather(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          // Graceful fallback to Port Harcourt defaults
          setWeather({
            ...FALLBACK_WEATHER_PORT_HARCOURT,
            city: preferences.city,
            latitude: preferences.latitude,
            longitude: preferences.longitude,
          });
          setLoadingWeather(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [preferences.latitude, preferences.longitude, preferences.city]);

  // Filter stories based on active topics
  const filteredStories = useMemo(() => {
    if (!preferences.topics || preferences.topics.length === 0) {
      return stories;
    }
    const filtered = stories.filter((story) =>
      preferences.topics.includes(story.category)
    );
    return filtered.length > 0 ? filtered : stories.slice(0, 3);
  }, [stories, preferences.topics]);

  // Estimated read time
  const estimatedReadMinutes = useMemo(() => {
    return Math.max(2, Math.round(filteredStories.length * 0.8));
  }, [filteredStories.length]);

  // Subtle weather-responsive ambient atmosphere (calm & understated)
  const atmosphericClasses = useMemo(() => {
    if (!weather) {
      return "bg-[#FAFAF9] text-zinc-900";
    }
    const code = weather.weatherCode;
    // Rain / showers: cooler subdued atmosphere
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return "bg-[#F7F9FA] text-zinc-900";
    }
    // Cloudy / Overcast: neutral muted atmosphere
    if ([2, 3, 45, 48].includes(code)) {
      return "bg-[#F8F9FA] text-zinc-900";
    }
    // Clear / Sunny: soft bright atmosphere
    return "bg-[#FAFAF9] text-zinc-900";
  }, [weather]);

  // Toggle topic personalization
  const toggleTopic = (topicId: TopicCategory) => {
    const isSelected = preferences.topics.includes(topicId);
    let updated: TopicCategory[];
    if (isSelected) {
      if (preferences.topics.length === 1) return; // Keep at least one
      updated = preferences.topics.filter((t) => t !== topicId);
    } else {
      updated = [...preferences.topics, topicId];
    }
    const newPrefs = { ...preferences, topics: updated };
    setPreferences(newPrefs);
    onPreferencesChange(newPrefs);

    // Persist locally for immediate session continuity
    try {
      localStorage.setItem("beta_digest_topics", JSON.stringify(updated));
    } catch {
      // Ignore localStorage restrictions
    }
  };

  // Toggle bookmark on story
  const toggleBookmark = (storyId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) {
        next.delete(storyId);
      } else {
        next.add(storyId);
      }
      return next;
    });
  };

  // City Search
  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchingCities(true);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch {
      // Search fallback
    } finally {
      setSearchingCities(false);
    }
  };

  const selectCity = (city: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    const updated: UserPreferences = {
      ...preferences,
      city: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
    };
    setPreferences(updated);
    onPreferencesChange(updated);
    setShowCitySearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Weather icon helper
  const renderWeatherIcon = (code: number, className: string = "h-9 w-9 text-amber-500") => {
    if ([0, 1].includes(code)) return <Sun className={className} />;
    if ([2, 3].includes(code)) return <Cloud className="h-9 w-9 text-zinc-400" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return <CloudRain className="h-9 w-9 text-sky-500" />;
    if ([71, 73, 75].includes(code))
      return <CloudSnow className="h-9 w-9 text-indigo-400" />;
    if ([95, 96, 99].includes(code))
      return <CloudLightning className="h-9 w-9 text-amber-500" />;
    return <Sun className={className} />;
  };

  return (
    <div className={`min-h-screen font-sans ${atmosphericClasses} antialiased transition-colors duration-700`}>
      {/* 1. HEADER */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left: Beta Digest Logo & Supporting Label */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Beta Digest
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Personalized Morning Intelligence
              </span>
            </div>
          </div>

          {/* Right: Location Pill & Primary Reader Action */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCitySearch(true)}
              className="group flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              title="Change Location"
            >
              <MapPin className="h-3.5 w-3.5 text-orange-600" />
              <span>{preferences.city}</span>
              <span className="text-[10px] text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
                Change
              </span>
            </button>

            <button
              onClick={onEnterDashboard}
              className="rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Open Reader Dashboard →
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (Centered Editorial Layout, Max Width 4xl) */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* 2. HERO — MAKE IT THE PRODUCT */}
        <section className="mb-8">
          <div className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            {dateFormatted}
          </div>

          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Good morning, {preferences.name || "Emeka"}.
            <span className="block text-zinc-800 dark:text-zinc-200 font-semibold mt-0.5">
              Here&apos;s what matters today.
            </span>
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Your weather, the stories worth knowing, and the context behind them — in one short morning briefing.
          </p>
        </section>

        {/* 3. WEATHER — CORE PART OF THE HERO */}
        <section className="mb-12">
          {loadingWeather ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2">
                  <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ) : weatherError ? (
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span>Weather information is temporarily unavailable.</span>
            </div>
          ) : weather ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              {/* Primary Weather Bar */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Icon + Temperature + Condition + Location */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-orange-50/70 p-2 text-amber-500 dark:bg-zinc-800">
                      {renderWeatherIcon(weather.weatherCode)}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                          {weather.temperature}°
                        </span>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          {weather.conditionText}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 font-medium">
                        {weather.city}{weather.country ? `, ${weather.country}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Metrics Row (High, Low, Humidity, Rain Probability, Wind) */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <div className="rounded-lg bg-zinc-50 px-2.5 py-1.5 dark:bg-zinc-800/60">
                      <span className="text-zinc-400 mr-1">H</span>
                      <strong className="text-zinc-800 dark:text-zinc-200">
                        {weather.highTemp ?? 31}°
                      </strong>
                      <span className="text-zinc-400 mx-1.5">·</span>
                      <span className="text-zinc-400 mr-1">L</span>
                      <strong className="text-zinc-800 dark:text-zinc-200">
                        {weather.lowTemp ?? 24}°
                      </strong>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-zinc-50 px-2.5 py-1.5 dark:bg-zinc-800/60">
                      <Droplets className="h-3.5 w-3.5 text-sky-500" />
                      <span>{weather.humidity}%</span>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-zinc-50 px-2.5 py-1.5 dark:bg-zinc-800/60">
                      <CloudRain className="h-3.5 w-3.5 text-blue-500" />
                      <span>{weather.precipitationProbability ?? 35}%</span>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-zinc-50 px-2.5 py-1.5 dark:bg-zinc-800/60">
                      <Wind className="h-3.5 w-3.5 text-teal-500" />
                      <span>{weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>

                {/* Advisory / Forecast Action */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800/80">
                  <div className="text-zinc-600 dark:text-zinc-400">
                    {weather.lifestyleAdvice || "Warm and bright morning. High UV around midday, light afternoon rain possible."}
                  </div>
                  <button
                    onClick={() => setShowForecastDetails(!showForecastDetails)}
                    className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                  >
                    <span>{showForecastDetails ? "Hide forecast" : "View forecast →"}</span>
                    {showForecastDetails ? <ChevronUp className="h-3.5 w-3.5" /> : null}
                  </button>
                </div>
              </div>

              {/* Collapsible 3-day forecast */}
              {showForecastDetails && weather.dailyForecast && (
                <div className="border-t border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {weather.dailyForecast.slice(0, 3).map((day, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-200/80 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="font-semibold text-zinc-500 dark:text-zinc-400">
                          {day.date}
                        </div>
                        <div className="my-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {day.maxTemp}° / {day.minTemp}°
                        </div>
                        <div className="text-[11px] text-zinc-500">{day.conditionText}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* 4. YOUR MORNING BRIEF */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3 mb-6 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-50 uppercase">
                YOUR MORNING BRIEF
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {filteredStories.length} stories · {estimatedReadMinutes} min read
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Scannable in ~4 mins</span>
            </div>
          </div>

          {/* Stories List (Compact Editorial Layout) */}
          <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800/80">
            {filteredStories.map((story) => {
              const isBookmarked = bookmarkedIds.has(story.id);
              return (
                <article key={story.id} className="py-6 first:pt-0 last:pb-0">
                  {/* Eyebrow: Number & Category */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-500">
                        {story.number}
                      </span>
                      <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                        {story.categoryIcon} {story.categoryLabel}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(story.id)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                      title={isBookmarked ? "Remove bookmark" : "Save for later"}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          isBookmarked
                            ? "fill-orange-600 text-orange-600 dark:fill-orange-500 dark:text-orange-500"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Headline */}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 hover:text-orange-600 dark:text-zinc-100 dark:hover:text-orange-400 transition-colors">
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>{story.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 hover:opacity-100 text-zinc-400" />
                    </a>
                  </h3>

                  {/* Summary */}
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {story.summary}
                  </p>

                  {/* 5. "WHY IT MATTERS" DISTINCTIVE FEATURE BOX */}
                  <div className="mt-3.5 rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 mb-1">
                      WHY IT MATTERS
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {story.whyItMatters}
                    </p>
                  </div>

                  {/* Metadata line */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-500 dark:text-zinc-400">
                      {story.source}
                    </span>
                    <span>·</span>
                    <span>{story.publishedAt}</span>
                    <span>·</span>
                    <span>{story.readingTime}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 6. PERSONALIZATION SECTION */}
        <section id="personalization" className="mb-14 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Your morning, your way.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Choose what Beta Digest watches for you.
            </p>
          </div>

          {/* Interactive Topic Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {ALL_AVAILABLE_TOPICS.map((topic) => {
              const isSelected = preferences.topics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border border-orange-600 bg-orange-50 text-orange-700 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-300"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  )}
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] text-zinc-400">
            Selected topics calibrate your weather priorities and filter your daily morning stories.
          </p>
        </section>

        {/* 7. MORNING TIMELINE */}
        <section className="mb-14 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Your Morning
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              How Beta Digest fits into your daily routine.
            </p>
          </div>

          {/* Visual Step-by-Step Morning Ritual Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-6 sm:-left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 ring-4 ring-white dark:ring-zinc-900" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-orange-600">07:00</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  BRIEFING READY
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Your personalized morning digest arrives in your inbox or push notification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-6 sm:-left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-zinc-500">07:02</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  🌤 WEATHER
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                28° · Clear in Port Harcourt. High 31°, rain expected later in the afternoon.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-6 sm:-left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-zinc-500">07:05</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  🧠 TOP STORY
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                OpenAI announces new developer tools & agentic workflow SDK.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className="absolute -left-6 sm:-left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-zinc-500">07:08</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  💼 BUSINESS
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Nigerian markets react as Central Bank stabilizes liquidity and FX corridors.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <span className="absolute -left-6 sm:-left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-zinc-500">07:10</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  🌍 WORLD
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Global clean energy deployment reaches new quarterly record led by grid storage.
              </p>
            </div>

            {/* Step 6 */}
            <div className="relative">
              <span className="absolute -left-6 sm:-left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-zinc-500">07:15</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  YOUR DAY
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                3 context items worth keeping in mind before your first meeting begins.
              </p>
            </div>
          </div>
        </section>

        {/* 8. TRANSITION FROM LANDING PAGE TO READER (CTA) */}
        <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-zinc-800 mb-3">
            <Coffee className="h-5 w-5" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ready to see your full briefing?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Open your personalized reader.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterDashboard}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <span>Read today&apos;s briefing →</span>
            </button>

            <a
              href="#personalization"
              className="w-full sm:w-auto rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              Customize your interests
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200/80 pt-6 pb-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Beta Digest</span>
              <span>·</span>
              <span>Start your day here. Here&apos;s what matters today.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Port Harcourt, NG</span>
              <span>·</span>
              <button
                onClick={onEnterDashboard}
                className="font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                Reader View
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* City Search Modal */}
      {showCitySearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Change Location
              </h3>
              <button
                onClick={() => setShowCitySearch(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCitySearch} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Enter city (e.g. Port Harcourt, Lagos, London)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
              <button
                type="submit"
                disabled={searchingCities}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {searchingCities ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-zinc-50 p-1 text-xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
                {searchResults.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectCity(city)}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-white dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {city.name}, {city.country}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
