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
  MapPin,
  ArrowRight,
  Check,
  Plus,
  Wind,
  Droplets,
  ExternalLink,
  Search,
  Loader2,
  Mail,
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
  emoji: string;
}

const ALL_TOPICS: TopicOption[] = [
  { id: "tech", label: "Technology", emoji: "🧠" },
  { id: "ai", label: "AI", emoji: "🤖" },
  { id: "business", label: "Business", emoji: "💼" },
  { id: "startups", label: "Startups", emoji: "🚀" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "world", label: "World", emoji: "🌍" },
  { id: "science", label: "Science", emoji: "🔬" },
];

export function LandingPage({
  onEnterDashboard,
  initialPreferences,
  onPreferencesChange,
}: LandingPageProps) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // City search
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; country: string; latitude: number; longitude: number }[]
  >([]);
  const [searchingCities, setSearchingCities] = useState(false);

  // Date
  const todayLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Fetch weather
  useEffect(() => {
    let active = true;
    setLoadingWeather(true);

    fetch(
      `/api/weather?lat=${preferences.latitude}&lon=${preferences.longitude}&city=${encodeURIComponent(preferences.city)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("fail");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setWeather(data);
          setLoadingWeather(false);
        }
      })
      .catch(() => {
        if (active) {
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
      active = false;
    };
  }, [preferences.latitude, preferences.longitude, preferences.city]);

  // Filter stories by selected topics
  const stories = useMemo(() => {
    if (!preferences.topics || preferences.topics.length === 0) {
      return INITIAL_STORIES;
    }
    const filtered = INITIAL_STORIES.filter((s) =>
      preferences.topics.includes(s.category)
    );
    return filtered.length > 0 ? filtered : INITIAL_STORIES.slice(0, 3);
  }, [preferences.topics]);

  // Topic toggle
  const toggleTopic = (id: TopicCategory) => {
    const selected = preferences.topics.includes(id);
    let next: TopicCategory[];
    if (selected) {
      if (preferences.topics.length === 1) return;
      next = preferences.topics.filter((t) => t !== id);
    } else {
      next = [...preferences.topics, id];
    }
    const updated = { ...preferences, topics: next };
    setPreferences(updated);
    onPreferencesChange(updated);
    try {
      localStorage.setItem("beta_digest_topics", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  // City search
  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchingCities(true);
    try {
      const res = await fetch(
        `/api/weather?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.results) setSearchResults(data.results);
    } catch {
      /* ignore */
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

  // Subscribe handler
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to Supabase / Resend
    setSubscribed(true);
  };

  // Weather icon
  const WeatherIcon = ({ code }: { code: number }) => {
    if ([0, 1].includes(code))
      return <Sun className="h-8 w-8 text-amber-500" />;
    if ([2, 3].includes(code))
      return <Cloud className="h-8 w-8 text-zinc-400" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return <CloudRain className="h-8 w-8 text-sky-500" />;
    if ([71, 73, 75].includes(code))
      return <CloudSnow className="h-8 w-8 text-indigo-400" />;
    if ([95, 96, 99].includes(code))
      return <CloudLightning className="h-8 w-8 text-amber-500" />;
    return <Sun className="h-8 w-8 text-amber-500" />;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white text-xs font-bold">
              β
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Beta Digest
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCitySearch(true)}
              className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 hover:border-zinc-300 transition-colors"
            >
              <MapPin className="h-3 w-3 text-orange-600" />
              {preferences.city}
            </button>

            <button
              onClick={onEnterDashboard}
              className="hidden sm:flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Open Dashboard
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-3xl px-5 py-8 sm:py-10">
        {/* ── Greeting + Date ── */}
        <section className="mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            {todayLabel}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 text-balance leading-[1.15]">
            {greeting}, {preferences.name || "there"}.
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl text-pretty">
            Your weather and the stories worth knowing — summarized in a few
            minutes.
          </p>
        </section>

        {/* ── Weather ── */}
        <section className="mb-8">
          {loadingWeather ? (
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-5 animate-pulse">
              <div className="h-8 w-24 rounded bg-zinc-200" />
              <div className="mt-2 h-4 w-40 rounded bg-zinc-200" />
            </div>
          ) : weather ? (
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <WeatherIcon code={weather.weatherCode} />
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold">
                        {weather.temperature}°
                      </span>
                      <span className="text-sm text-zinc-500">
                        {weather.conditionText}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {weather.city}
                      {weather.country ? `, ${weather.country}` : ""}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
                  <span>
                    H {weather.highTemp ?? 31}° · L {weather.lowTemp ?? 24}°
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Droplets className="h-3 w-3" />
                    {weather.humidity}%
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Wind className="h-3 w-3" />
                    {weather.windSpeed} km/h
                  </span>
                </div>
              </div>

              {/* Mobile weather details */}
              <div className="flex sm:hidden items-center gap-3 mt-3 text-xs text-zinc-500">
                <span>
                  H {weather.highTemp ?? 31}° · L {weather.lowTemp ?? 24}°
                </span>
                <span className="flex items-center gap-0.5">
                  <Droplets className="h-3 w-3" />
                  {weather.humidity}%
                </span>
                <span className="flex items-center gap-0.5">
                  <Wind className="h-3 w-3" />
                  {weather.windSpeed} km/h
                </span>
              </div>
            </div>
          ) : null}
        </section>

        {/* ── Today's Digest (sample) ── */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">
              Today&apos;s Digest
            </h2>
            <span className="text-xs text-zinc-400">
              {stories.length} stories
            </span>
          </div>

          <div className="space-y-0 divide-y divide-zinc-100">
            {stories.map((story) => (
              <article key={story.id} className="py-5 first:pt-0 last:pb-0">
                {/* Category label */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs">{story.categoryIcon}</span>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {story.categoryLabel}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-base font-semibold leading-snug text-zinc-900">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {story.title}
                  </a>
                </h3>

                {/* Summary */}
                <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">
                  {story.summary}
                </p>

                {/* Why it matters */}
                <div className="mt-2.5 border-l-2 border-orange-300 pl-3 py-1">
                  <p className="text-xs font-semibold text-orange-700 mb-0.5">
                    Why it matters
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {story.whyItMatters}
                  </p>
                </div>

                {/* Meta */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                  <span>{story.source}</span>
                  <span>·</span>
                  <span>{story.publishedAt}</span>
                  <span>·</span>
                  <span>{story.readingTime}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Pick your topics ── */}
        <section className="mb-10 rounded-xl border border-zinc-100 bg-zinc-50 p-5">
          <h2 className="text-sm font-semibold text-zinc-900">
            Pick the topics you care about
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5 mb-3">
            Your digest only includes what you choose.
          </p>

          <div className="flex flex-wrap gap-2">
            {ALL_TOPICS.map((topic) => {
              const active = preferences.topics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-orange-600 text-white"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  {active ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                  {topic.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Subscribe CTA ── */}
        <section className="mb-10 rounded-xl border border-zinc-100 bg-zinc-50 p-6 text-center">
          {subscribed ? (
            <div>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                You&apos;re in.
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                We&apos;ll send your first digest to{" "}
                <strong className="text-zinc-700">{email}</strong> tomorrow
                morning.
              </p>
              <button
                onClick={onEnterDashboard}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Explore the dashboard
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Get this delivered every morning
              </h3>
              <p className="mt-1 text-sm text-zinc-500 max-w-md mx-auto">
                Weather, news, and context — personalized and sent to your inbox
                before you start your day.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-4 flex flex-col sm:flex-row items-center gap-2 max-w-sm mx-auto"
              >
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>

              <p className="mt-3 text-[11px] text-zinc-400">
                Free. No spam. Unsubscribe anytime.
              </p>
            </div>
          )}
        </section>

        {/* ── How it works (very brief) ── */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-zinc-100 p-4">
              <p className="font-semibold text-zinc-900 mb-1">
                1. Pick your topics
              </p>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Choose from technology, business, world news, science, sports,
                and more.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-100 p-4">
              <p className="font-semibold text-zinc-900 mb-1">
                2. We read everything
              </p>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Hundreds of sources, summarized. Each story includes context on
                why it matters.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-100 p-4">
              <p className="font-semibold text-zinc-900 mb-1">
                3. You get a digest
              </p>
              <p className="text-zinc-500 text-xs leading-relaxed">
                A short, readable briefing — weather, top stories, and context —
                delivered daily.
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-zinc-100 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-zinc-600">Beta Digest</span>
            <span>·</span>
            <span>Your daily briefing, summarized.</span>
          </div>
          <button
            onClick={onEnterDashboard}
            className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
          >
            Open Dashboard →
          </button>
        </footer>
      </main>

      {/* ── City search modal ── */}
      {showCitySearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Change location
              </h3>
              <button
                onClick={() => setShowCitySearch(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCitySearch} className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={searchingCities}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {searchingCities ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-100 bg-zinc-50 p-1 text-sm">
                {searchResults.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectCity(city)}
                    className="flex w-full items-center justify-between rounded-md p-2 text-left hover:bg-white transition-colors"
                  >
                    <span className="font-medium text-zinc-800">
                      {city.name}, {city.country}
                    </span>
                    <span className="text-xs text-zinc-400">
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
