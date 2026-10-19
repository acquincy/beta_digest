"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sliders,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
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
import { PrimaryButton, OutlineButton } from "../primitives/Button";
import { Chip } from "../primitives/Chip";
import {
  WeatherTopicId,
  NewsTopicId,
  WEATHER_TOPIC_ORDER,
  NEWS_TOPIC_ORDER,
  WEATHER_TOPIC_LABELS,
  NEWS_TOPIC_LABELS,
  Preferences,
} from "@/lib/types";
import { loadPreferences, savePreferences, parseDeliveryHour, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { savePreferencesViaApi, fetchPreferencesViaApi } from "@/lib/n8n";

import { WEATHER_ICONS, NEWS_ICONS } from "@/lib/icons";
export { WEATHER_ICONS, NEWS_ICONS };

export const TopicPreferencesEditor: React.FC = () => {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);
  const [weatherTopics, setWeatherTopics] = useState<WeatherTopicId[]>(INITIAL_PREFERENCES.weatherTopics);
  const [newsTopics, setNewsTopics] = useState<NewsTopicId[]>(INITIAL_PREFERENCES.newsTopics);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Load preferences from localStorage immediately
  useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
    setWeatherTopics(loaded.weatherTopics);
    setNewsTopics(loaded.newsTopics);
    setHydrated(true);

    let mounted = true;

    // 2. Fetch fresh preferences from the database via API
    fetchPreferencesViaApi()
      .then((data) => {
        if (!mounted || !data) return;
        const u = data.user;
        const p = data.preferences;

        const dbCity =
          typeof u?.city === "string" && u.city.trim()
            ? u.city.trim()
            : typeof p?.city === "string" && p.city.trim()
            ? p.city.trim()
            : "";
        const dbCountry =
          typeof u?.country_code === "string" && u.country_code.trim()
            ? u.country_code.trim().toUpperCase()
            : typeof p?.countryCode === "string" && p.countryCode.trim()
            ? p.countryCode.trim().toUpperCase()
            : "";
        const dbName =
          typeof u?.name === "string" && u.name.trim()
            ? u.name.trim()
            : typeof p?.name === "string" && p.name.trim()
            ? p.name.trim()
            : "";
        const dbWeather = (
          Array.isArray(p?.weatherTopics) && p.weatherTopics.length > 0
            ? p.weatherTopics
            : Array.isArray(u?.weather_categories)
            ? u.weather_categories
            : null
        ) as WeatherTopicId[] | null;
        const dbNews = (
          Array.isArray(p?.newsTopics) && p.newsTopics.length > 0
            ? p.newsTopics
            : Array.isArray(u?.news_categories)
            ? u.news_categories
            : null
        ) as NewsTopicId[] | null;
        const dbSendTime =
          typeof u?.send_time === "string" && u.send_time
            ? u.send_time
            : typeof p?.sendTime === "string" && p.sendTime
            ? p.sendTime
            : "";

        if (dbWeather && dbWeather.length > 0) {
          setWeatherTopics(dbWeather.slice(0, 3));
        }
        if (dbNews && dbNews.length > 0) {
          setNewsTopics(dbNews.slice(0, 5));
        }

        setPrefs((prev) => {
          // Strictly protect existing city from being overwritten by fallback Seattle
          const resolvedCity =
            dbCity && dbCity !== "Seattle"
              ? dbCity
              : prev.city && prev.city !== "Seattle"
              ? prev.city
              : dbCity || prev.city || "";

          const resolvedCountry =
            dbCountry && dbCountry !== "US"
              ? dbCountry
              : prev.countryCode && prev.countryCode !== "US"
              ? prev.countryCode
              : dbCountry || prev.countryCode || "";

          const updated: Preferences = {
            ...prev,
            name: dbName || prev.name,
            city: resolvedCity,
            countryCode: resolvedCountry,
            deliveryHour: dbSendTime ? parseDeliveryHour(dbSendTime) : prev.deliveryHour,
            weatherTopics:
              dbWeather && dbWeather.length > 0
                ? dbWeather.slice(0, 3)
                : prev.weatherTopics,
            newsTopics:
              dbNews && dbNews.length > 0 ? dbNews.slice(0, 5) : prev.newsTopics,
          };
          savePreferences(updated);
          return updated;
        });
      })
      .catch((err) => {
        console.warn("Could not fetch remote preferences:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Weather topic toggle handler (cap 3)
  const toggleWeatherTopic = (topic: WeatherTopicId) => {
    if (weatherTopics.includes(topic)) {
      setWeatherTopics((prev) => prev.filter((t) => t !== topic));
      setErrorMessage(null);
    } else if (weatherTopics.length < 3) {
      setWeatherTopics((prev) =>
        WEATHER_TOPIC_ORDER.filter((t) => prev.includes(t) || t === topic).slice(0, 3)
      );
      setErrorMessage(null);
    }
  };

  // News topic toggle handler (cap 5)
  const toggleNewsTopic = (topic: NewsTopicId) => {
    if (newsTopics.includes(topic)) {
      setNewsTopics((prev) => prev.filter((t) => t !== topic));
      setErrorMessage(null);
    } else if (newsTopics.length < 5) {
      setNewsTopics((prev) =>
        NEWS_TOPIC_ORDER.filter((t) => prev.includes(t) || t === topic).slice(0, 5)
      );
      setErrorMessage(null);
    }
  };

  const totalTopics = weatherTopics.length + newsTopics.length;

  const handleSave = async () => {
    if (totalTopics === 0) {
      setErrorMessage("Please select at least one topic (weather or news) for your digest.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      // 1. Update localStorage immediately while strictly keeping the existing city & country
      const updatedPrefs: Preferences = {
        ...prefs,
        weatherTopics,
        newsTopics,
      };
      savePreferences(updatedPrefs);

      // 2. Dispatch to the n8n flow via /api/user/preferences
      // Explicitly pass existing city and countryCode if available to safeguard against any server-side fallback
      const cityToSend =
        prefs.city && prefs.city.trim() && prefs.city.trim() !== "Seattle"
          ? prefs.city.trim()
          : prefs.city && prefs.city.trim()
          ? prefs.city.trim()
          : undefined;

      const countryToSend =
        prefs.countryCode && prefs.countryCode.trim() && prefs.countryCode.trim() !== "US"
          ? prefs.countryCode.trim().toUpperCase()
          : prefs.countryCode && prefs.countryCode.trim()
          ? prefs.countryCode.trim().toUpperCase()
          : undefined;

      await savePreferencesViaApi({
        city: cityToSend,
        country_code: countryToSend,
        weather_categories: weatherTopics,
        news_categories: newsTopics,
      });

      setSaveSuccess(true);

      // 3. Return to the dashboard to view the updated profile with fresh load
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update preferences. Please try again.";
      setErrorMessage(msg);
      setSaving(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between items-center overflow-x-hidden">
        <CanvasA />
        <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
          <TopLeftLogo />
        </header>
        <main className="flex-grow flex items-center justify-center p-4 py-8 md:py-12 w-full">
          <div className="w-full max-w-[768px] h-[520px] bg-[#161616] border border-white/10 rounded-[32px] md:rounded-[40px] animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-x-hidden">
      <CanvasA />
      <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
        <TopLeftLogo />
      </header>
      <main className="flex-grow flex items-center justify-center p-4 py-8 md:py-12 w-full">

      <CardShell
        footer={
          <div className="w-full flex items-center justify-between gap-4 flex-wrap">
            <OutlineButton
              onClick={() => router.push("/dashboard")}
              disabled={saving}
            >
              Cancel
            </OutlineButton>

            <PrimaryButton
              onClick={handleSave}
              disabled={saving || totalTopics === 0}
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Saving...</span>
                </span>
              ) : saveSuccess ? (
                <span className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Saved!</span>
                </span>
              ) : (
                "Save preferences"
              )}
            </PrimaryButton>
          </div>
        }
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
            <Sliders className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            <span className="font-sans font-[600] text-[12px] uppercase tracking-wider text-white">
              Topic Preferences
            </span>
          </div>

          <Link
            href="/dashboard"
            className="font-sans font-[500] text-[13px] text-white/70 hover:text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-display font-[700] text-[28px] md:text-[34px] leading-tight text-white">
          Customize your briefing topics
        </h1>

        <p className="font-sans font-[400] text-[16px] md:text-[17px] leading-[25px] text-white/75 mt-1.5">
          Select up to 3 weather metrics and up to 5 editorial news categories. Your updates will be personalized to your selections.
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 p-4 rounded-[18px] bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2.5 font-sans text-[14px]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="h-6" />

        {/* Topic sections */}
        <div className="flex flex-col gap-5">
          {/* 1. Weather details */}
          <SectionCard>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-white" aria-hidden="true" />
                <h2 className="font-sans font-[600] text-[18px] text-white">
                  Your weather details
                </h2>
              </div>
              <span
                className={`font-sans font-[600] text-[14px] tabular-nums px-2.5 py-0.5 rounded-full ${
                  weatherTopics.length === 3 ? "bg-white text-black" : "bg-white/[0.06] text-white/70"
                }`}
              >
                {weatherTopics.length}/3
              </span>
            </div>
            <p className="font-sans font-[400] text-[14px] text-white/75 mb-4">
              Choose up to 3 weather telemetry points for {prefs.city || "your city"}.
            </p>

            <div
              role="group"
              aria-label="Weather metrics"
              className="flex flex-wrap gap-2"
            >
              {WEATHER_TOPIC_ORDER.map((topicId) => {
                const isActive = weatherTopics.includes(topicId);
                const isMax = weatherTopics.length >= 3 && !isActive;
                const IconComponent = WEATHER_ICONS[topicId];

                return (
                  <Chip
                    key={topicId}
                    size="onboarding"
                    active={isActive}
                    disabled={isMax}
                    onToggle={() => toggleWeatherTopic(topicId)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {IconComponent && <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{WEATHER_TOPIC_LABELS[topicId]}</span>
                    </span>
                  </Chip>
                );
              })}
            </div>

            {weatherTopics.length >= 3 && (
              <p className="text-[12px] text-white/70 mt-3">
                Maximum 3 weather points reached. Deselect one to add another.
              </p>
            )}
          </SectionCard>

          {/* 2. News categories */}
          <SectionCard>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                <h2 className="font-sans font-[600] text-[18px] text-white">
                  Your news categories
                </h2>
              </div>
              <span
                className={`font-sans font-[600] text-[14px] tabular-nums px-2.5 py-0.5 rounded-full ${
                  newsTopics.length === 5 ? "bg-white text-black" : "bg-white/[0.06] text-white/70"
                }`}
              >
                {newsTopics.length}/5
              </span>
            </div>
            <p className="font-sans font-[400] text-[14px] text-white/75 mb-4">
              Choose up to 5 editorial topics for your daily briefing.
            </p>

            <div
              role="group"
              aria-label="News categories"
              className="flex flex-wrap gap-2"
            >
              {NEWS_TOPIC_ORDER.map((topicId) => {
                const isActive = newsTopics.includes(topicId);
                const isMax = newsTopics.length >= 5 && !isActive;
                const IconComponent = NEWS_ICONS[topicId];

                return (
                  <Chip
                    key={topicId}
                    size="onboarding"
                    active={isActive}
                    disabled={isMax}
                    onToggle={() => toggleNewsTopic(topicId)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {IconComponent && <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{NEWS_TOPIC_LABELS[topicId]}</span>
                    </span>
                  </Chip>
                );
              })}
            </div>

            {newsTopics.length >= 5 && (
              <p className="text-[12px] text-white/70 mt-3">
                Maximum 5 news topics reached. Deselect one to add another.
              </p>
            )}
          </SectionCard>
        </div>
      </CardShell>
      </main>
    </div>
  );
};
