"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sliders,
  Sparkles,
  ArrowLeft,
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
import { loadPreferences, savePreferences, INITIAL_PREFERENCES } from "@/lib/wizard-store";
import { savePreferencesViaApi, fetchPreferencesViaApi } from "@/lib/n8n";

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
        if (data.preferences) {
          const freshWeather = Array.isArray(data.preferences.weatherTopics)
            ? (data.preferences.weatherTopics as WeatherTopicId[])
            : null;
          const freshNews = Array.isArray(data.preferences.newsTopics)
            ? (data.preferences.newsTopics as NewsTopicId[])
            : null;

          if (freshWeather && freshWeather.length > 0) {
            setWeatherTopics(freshWeather.slice(0, 3));
          }
          if (freshNews && freshNews.length > 0) {
            setNewsTopics(freshNews.slice(0, 5));
          }

          if (data.user) {
            setPrefs((prev) => ({
              ...prev,
              name: data.user?.name || prev.name,
              city: data.user?.city || prev.city,
              countryCode: data.user?.country_code || prev.countryCode,
              send_time: data.user?.send_time || prev.deliveryHour,
            }));
          }
        }
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
      // 1. Update localStorage immediately
      const updatedPrefs: Preferences = {
        ...prefs,
        weatherTopics,
        newsTopics,
      };
      savePreferences(updatedPrefs);

      // 2. Dispatch to the n8n flow via /api/user/preferences
      await savePreferencesViaApi({
        weather_categories: weatherTopics,
        news_categories: newsTopics,
      });

      setSaveSuccess(true);

      // 3. Return to the dashboard to view the updated profile
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update preferences. Please try again.";
      setErrorMessage(msg);
      setSaving(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-8 md:py-12 overflow-x-hidden">
        <CanvasA />
        <div className="w-full max-w-[768px] h-[520px] bg-white rounded-[32px] md:rounded-[40px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 py-8 md:py-12 overflow-x-hidden">
      <CanvasA />

      <CardShell
        footer={
          <div className="w-full flex items-center justify-between gap-4 flex-wrap">
            <OutlineButton
              onClick={() => router.push("/dashboard")}
              disabled={saving}
              leftIcon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6FFDD] border border-[rgba(0,0,0,0.08)]">
            <Sliders className="w-3.5 h-3.5 text-black" aria-hidden="true" />
            <span className="font-sans font-[600] text-[12px] uppercase tracking-wider text-black">
              Topic Preferences
            </span>
          </div>

          <Link
            href="/dashboard"
            className="font-sans font-[500] text-[13px] text-[#666] hover:text-black transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-display font-[700] text-[28px] md:text-[34px] leading-tight text-black">
          Customize your briefing topics
        </h1>

        <p className="font-sans font-[400] text-[16px] md:text-[17px] leading-[25px] text-[var(--text-muted)] mt-1.5">
          Select up to 3 weather metrics and up to 5 editorial news categories. Your updates will be personalized to your selections.
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 p-4 rounded-[18px] bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 font-sans text-[14px]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
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
                <Sun className="w-4 h-4 text-black" aria-hidden="true" />
                <h2 className="font-sans font-[600] text-[18px] text-black">
                  Your weather details
                </h2>
              </div>
              <span
                className={`font-sans font-[600] text-[14px] tabular-nums px-2.5 py-0.5 rounded-full ${
                  weatherTopics.length === 3 ? "bg-[var(--lime)] text-black" : "bg-neutral-100 text-[#666]"
                }`}
              >
                {weatherTopics.length}/3
              </span>
            </div>
            <p className="font-sans font-[400] text-[14px] text-[var(--text-muted-sm)] mb-4">
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
              <p className="text-[12px] text-[var(--text-muted-sm)] mt-3">
                Maximum 3 weather points reached. Deselect one to add another.
              </p>
            )}
          </SectionCard>

          {/* 2. News categories */}
          <SectionCard>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-black" aria-hidden="true" />
                <h2 className="font-sans font-[600] text-[18px] text-black">
                  Your news categories
                </h2>
              </div>
              <span
                className={`font-sans font-[600] text-[14px] tabular-nums px-2.5 py-0.5 rounded-full ${
                  newsTopics.length === 5 ? "bg-[var(--lime)] text-black" : "bg-neutral-100 text-[#666]"
                }`}
              >
                {newsTopics.length}/5
              </span>
            </div>
            <p className="font-sans font-[400] text-[14px] text-[var(--text-muted-sm)] mb-4">
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
              <p className="text-[12px] text-[var(--text-muted-sm)] mt-3">
                Maximum 5 news topics reached. Deselect one to add another.
              </p>
            )}
          </SectionCard>
        </div>
      </CardShell>
    </div>
  );
};
