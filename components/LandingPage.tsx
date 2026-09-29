"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  WeatherData,
  DigestNewsItem,
  TopicCategory,
  UserPreferences,
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
  CheckCircle2,
  Check,
  Bell,
  Mail,
  Wind,
  Droplets,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Workflow,
  Search,
  Loader2,
} from "lucide-react";

interface LandingPageProps {
  onEnterDashboard: () => void;
  initialPreferences: UserPreferences;
  onPreferencesChange: (prefs: UserPreferences) => void;
}

const AVAILABLE_TOPICS: { id: TopicCategory; label: string; icon: string }[] = [
  { id: "ai", label: "AI Frontiers", icon: "🧠" },
  { id: "tech", label: "Technology", icon: "💻" },
  { id: "startups", label: "Startups & VC", icon: "🚀" },
  { id: "science", label: "Science & Space", icon: "🔭" },
  { id: "business", label: "Markets & Economy", icon: "📈" },
  { id: "world", label: "Global Affairs", icon: "🌍" },
];

export function LandingPage({
  onEnterDashboard,
  initialPreferences,
  onPreferencesChange,
}: LandingPageProps) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [newsItems, setNewsItems] = useState<DigestNewsItem[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  // 2-Step Onboarding states
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [enablePushAlerts, setEnablePushAlerts] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // City search modal
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; country: string; latitude: number; longitude: number }[]
  >([]);
  const [searchingCities, setSearchingCities] = useState(false);

  // Fetch weather for current location
  useEffect(() => {
    let isMounted = true;
    setLoadingWeather(true);
    fetch(
      `/api/weather?lat=${preferences.latitude}&lon=${preferences.longitude}&city=${encodeURIComponent(
        preferences.city
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setLoadingWeather(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingWeather(false);
      });

    return () => {
      isMounted = false;
    };
  }, [preferences.latitude, preferences.longitude, preferences.city]);

  // Fetch news digest preview for selected topics
  useEffect(() => {
    let isMounted = true;
    setLoadingNews(true);
    fetch("/api/digest/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: preferences.city,
        latitude: preferences.latitude,
        longitude: preferences.longitude,
        topics: preferences.topics,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.digest) {
          setNewsItems(data.digest.newsItems);
          setLoadingNews(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingNews(false);
      });

    return () => {
      isMounted = false;
    };
  }, [preferences.topics, preferences.city, preferences.latitude, preferences.longitude]);

  // Bio-responsive atmospheric gradient calculator
  const atmosphericStyle = useMemo(() => {
    if (!weather) {
      return {
        background:
          "linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(244, 244, 245, 1) 40%, rgba(56, 189, 248, 0.08) 100%)",
        accentGlow: "from-orange-500/20 via-amber-400/10 to-sky-500/20",
        badgeColor: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
      };
    }

    const code = weather.weatherCode;
    // Rainy / Drizzle
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return {
        background:
          "linear-gradient(135deg, rgba(71, 85, 105, 0.12) 0%, rgba(248, 250, 252, 1) 40%, rgba(14, 165, 233, 0.12) 100%)",
        accentGlow: "from-slate-600/20 via-cyan-500/10 to-blue-600/20",
        badgeColor: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
      };
    }
    // Thunderstorm
    if ([95, 96, 99].includes(code)) {
      return {
        background:
          "linear-gradient(135deg, rgba(88, 28, 135, 0.12) 0%, rgba(248, 250, 252, 1) 40%, rgba(234, 179, 8, 0.10) 100%)",
        accentGlow: "from-purple-600/20 via-amber-500/10 to-slate-900/20",
        badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
      };
    }
    // Snow
    if ([71, 73, 75].includes(code)) {
      return {
        background:
          "linear-gradient(135deg, rgba(165, 180, 252, 0.15) 0%, rgba(248, 250, 252, 1) 40%, rgba(224, 231, 255, 0.15) 100%)",
        accentGlow: "from-indigo-400/20 via-sky-300/10 to-slate-200/30",
        badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
      };
    }
    // Cloudy / Overcast
    if ([2, 3, 45, 48].includes(code)) {
      return {
        background:
          "linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(250, 250, 250, 1) 40%, rgba(203, 213, 225, 0.12) 100%)",
        accentGlow: "from-slate-400/20 via-zinc-300/10 to-slate-500/20",
        badgeColor: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300",
      };
    }
    // Sunny / Clear default
    return {
      background:
        "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(255, 255, 255, 1) 35%, rgba(14, 165, 233, 0.10) 100%)",
      accentGlow: "from-amber-400/25 via-orange-300/15 to-sky-400/20",
      badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    };
  }, [weather]);

  const toggleTopic = (topic: TopicCategory) => {
    const exists = preferences.topics.includes(topic);
    let updated: TopicCategory[];
    if (exists) {
      if (preferences.topics.length === 1) return; // Keep at least one
      updated = preferences.topics.filter((t) => t !== topic);
    } else {
      updated = [...preferences.topics, topic];
    }
    const newPrefs = { ...preferences, topics: updated };
    setPreferences(newPrefs);
    onPreferencesChange(newPrefs);
  };

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
      // Ignore search error
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim() || !subscriberEmail.includes("@")) return;
    setSubscribing(true);
    // Simulate instantaneous subscription / n8n sync
    setTimeout(() => {
      setSubscribing(false);
      setIsSubscribed(true);
    }, 800);
  };

  return (
    <div
      style={{ background: atmosphericStyle.background }}
      className="min-h-screen transition-colors duration-1000 font-sans text-zinc-900 antialiased dark:text-zinc-50"
    >
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-30 border-b border-zinc-200/50 bg-white/60 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Beta Digest
            </span>
            <span className="hidden sm:inline-flex rounded-full bg-orange-100/70 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
              Personalized Morning Intelligence
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCitySearch(true)}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur-sm transition-all hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200"
            >
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
              <span>{preferences.city}</span>
              <span className="text-[10px] text-zinc-400">Change</span>
            </button>

            <button
              onClick={onEnterDashboard}
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Open Reader Dashboard →
            </button>
          </div>
        </div>
      </nav>

      {/* Atmospheric Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Signal Badges */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3.5 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Atmosphere: {weather ? weather.conditionText : "Calibrating..."}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1 text-zinc-500">
              <Clock className="h-3 w-3" /> 60-Second Scan
            </span>
          </div>

          {/* Conversational Hero Title */}
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50 leading-[1.15]">
            Good morning.{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Clarity awaits
            </span>{" "}
            before your coffee brews.
          </h1>

          {/* Conversational Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            No 45-minute doomscrolling. Just hyper-local weather alerts, tailored industry intelligence, and actionable AI takeaways delivered to your inbox at 07:00 AM.
          </p>

          {/* Bento Topic Assembly Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-1">
              Customize Your Topics:
            </span>
            {AVAILABLE_TOPICS.map((topic) => {
              const active = preferences.topics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border border-zinc-200/80 bg-white/70 text-zinc-600 hover:bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400"
                  }`}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.label}</span>
                  {active && <Check className="h-3 w-3 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Live Atmospheric Briefing Capsule (Centerpiece) */}
        <div className="mx-auto mt-12 max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
            {/* Header: Weather Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 text-amber-600 dark:from-amber-950/60 dark:to-orange-950/60 dark:text-amber-400 shadow-inner">
                  {weather && [0, 1].includes(weather.weatherCode) ? (
                    <Sun className="h-7 w-7 text-amber-500 animate-spin-slow" />
                  ) : weather && [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.weatherCode) ? (
                    <CloudRain className="h-7 w-7 text-sky-500" />
                  ) : weather && [71, 73, 75].includes(weather.weatherCode) ? (
                    <CloudSnow className="h-7 w-7 text-indigo-400" />
                  ) : (
                    <Cloud className="h-7 w-7 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {weather ? `${weather.temperature}°C` : "--°C"}
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      in {preferences.city}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    {weather ? weather.conditionText : "Loading forecast..."} • Feels like {weather ? `${weather.apparentTemperature}°C` : "--"}
                  </p>
                </div>
              </div>

              {/* Weather Telemetry pills */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 rounded-xl bg-zinc-100/80 px-3 py-1.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <Wind className="h-3.5 w-3.5 text-sky-500" />
                  <span>{weather ? `${weather.windSpeed} km/h` : "--"}</span>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-zinc-100/80 px-3 py-1.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <Droplets className="h-3.5 w-3.5 text-cyan-500" />
                  <span>{weather ? `${weather.humidity}%` : "--"}</span>
                </div>
              </div>
            </div>

            {/* Natural language lifestyle advice */}
            {weather?.lifestyleAdvice && (
              <div className="my-4 rounded-xl bg-orange-50/70 p-3 text-xs leading-relaxed text-orange-950 dark:bg-orange-950/30 dark:text-orange-200">
                <span className="font-semibold">Morning Outlook:</span> {weather.lifestyleAdvice}
              </div>
            )}

            {/* Curated News Stream with AI Takeaways */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Today&apos;s High-Signal Briefings ({preferences.topics.join(", ")})
                </h3>
                <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400">
                  Live Preview
                </span>
              </div>

              {loadingNews ? (
                <div className="space-y-3 py-4">
                  <div className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-3">
                  {newsItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-2xl border border-zinc-100 bg-white/90 p-4 transition-all hover:border-zinc-200 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/40"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {item.source}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400 transition-colors">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </h4>

                      <p className="mt-1 text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
                        {item.summary}
                      </p>

                      {item.aiTakeaway && (
                        <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-zinc-50 p-2 text-[11px] text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                          <Sparkles className="mt-0.5 h-3 w-3 text-amber-500 flex-shrink-0" />
                          <span>{item.aiTakeaway}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Two-Step Onboarding Form */}
            <div className="mt-8 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-white/60 p-6 dark:border-orange-950 dark:from-orange-950/30 dark:to-zinc-900/60">
              {!isSubscribed ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {onboardingStep === 1
                          ? "Step 1: Confirm Your Morning Calibration"
                          : "Step 2: Where should we send tomorrow's edition?"}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {onboardingStep === 1
                          ? `Ready for ${preferences.city} weather and ${preferences.topics.length} selected topics.`
                          : "Delivered strictly at 07:00 AM. One email, zero spam, instant unsubscribe."}
                      </p>
                    </div>
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                      Step {onboardingStep} of 2
                    </span>
                  </div>

                  {onboardingStep === 1 ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-lg bg-white/80 px-2.5 py-1 font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
                          📍 {preferences.city}
                        </span>
                        {preferences.topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg bg-white/80 px-2.5 py-1 font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-600/25 transition-all hover:bg-orange-500"
                      >
                        <span>Confirm & Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                          <input
                            type="email"
                            required
                            placeholder="Enter your morning email..."
                            value={subscriberEmail}
                            onChange={(e) => setSubscriberEmail(e.target.value)}
                            className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-xs text-zinc-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={subscribing}
                          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-600/25 transition-all hover:bg-orange-500 disabled:opacity-50"
                        >
                          {subscribing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <span>Activate Subscription</span>
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="pushCheckbox"
                          checked={enablePushAlerts}
                          onChange={(e) => setEnablePushAlerts(e.target.checked)}
                          className="h-3.5 w-3.5 rounded text-orange-600 accent-orange-600"
                        />
                        <label
                          htmlFor="pushCheckbox"
                          className="text-[11px] text-zinc-600 dark:text-zinc-400 cursor-pointer"
                        >
                          Also send browser push notifications if rain or severe weather is detected in {preferences.city}.
                        </label>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 py-2 text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      You are set! First edition arrives tomorrow at 07:00 AM.
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Check your inbox at <strong>{subscriberEmail}</strong> for your welcome briefing. You can tweak topics or location anytime in the dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="border-t border-zinc-200/60 bg-white/40 py-16 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Engineered for Cognitive Clarity
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Three pillars that differentiate Beta Digest from chaotic social timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 mb-4">
                <Sun className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Atmospheric Grounding
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Ground your morning in physical reality. Hyper-local temperature, wind gusts, UV index, and human advice (commute alerts, rain prep) so you step outside prepared.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                No Clickbait AI Synthesis
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Raw RSS feeds and research papers are processed through Google Gemini to extract only the fundamental takeaway, cutting 90% of headline sensationalism.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 mb-4">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                n8n Automation Backbone
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Workflows run on resilient n8n pipelines. Scheduled cron triggers, multi-channel delivery (Email & Web Push), and transparent webhook diagnostics with zero vendor lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Beta Digest
            </span>
            <span>• Built for calm, focused mornings</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onEnterDashboard}
              className="text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
            >
              Reader Dashboard
            </button>
            <span>•</span>
            <span>Open-Meteo & RSS Ingestion</span>
          </div>
        </div>
      </footer>

      {/* City Search Modal */}
      {showCitySearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Change Your Location
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
                  placeholder="Enter city (e.g. Paris, Tokyo, Austin)..."
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
              <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-zinc-50/50 p-1 text-xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
                {searchResults.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectCity(city)}
                    className="flex w-full items-center justify-between rounded-lg p-2.5 text-left hover:bg-white dark:hover:bg-zinc-900 transition-colors"
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
