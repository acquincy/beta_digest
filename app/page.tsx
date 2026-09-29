"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { WeatherWidget } from "@/components/WeatherWidget";
import { DigestFeed } from "@/components/DigestFeed";
import { PreferencesModal } from "@/components/PreferencesModal";
import { N8nIntegrationGuide } from "@/components/N8nIntegrationGuide";
import { LandingPage } from "@/components/LandingPage";
import {
  WeatherData,
  DigestNewsItem,
  UserPreferences,
} from "@/lib/types";
import { MapPin, Tag, ArrowLeft } from "lucide-react";

const DEFAULT_PREFERENCES: UserPreferences = {
  name: "Subscriber",
  email: "reader@betadigest.app",
  city: "San Francisco",
  latitude: 37.7749,
  longitude: -122.4194,
  topics: ["tech", "ai", "startups"],
  deliveryTime: "07:00",
  emailEnabled: true,
  pushEnabled: false,
};

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [activeTab, setActiveTab] = useState<"digest" | "n8n">("digest");
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [newsItems, setNewsItems] = useState<DigestNewsItem[]>([]);
  const [overview, setOverview] = useState<string>("");
  const [source, setSource] = useState<string>("local_pipeline");

  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingDigest, setLoadingDigest] = useState(false);

  // Load weather data
  const loadWeather = useCallback(async (lat: number, lon: number, city: string) => {
    setLoadingWeather(true);
    try {
      const res = await fetch(
        `/api/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`
      );
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  // Load digest
  const loadDigest = useCallback(
    async (prefs: UserPreferences) => {
      setLoadingDigest(true);
      try {
        const res = await fetch("/api/digest/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: prefs.city,
            latitude: prefs.latitude,
            longitude: prefs.longitude,
            topics: prefs.topics,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.digest) {
            setNewsItems(data.digest.newsItems);
            setOverview(data.digest.overview);
            setSource(data.digest.generatedBy);
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoadingDigest(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadWeather(preferences.latitude, preferences.longitude, preferences.city);
    loadDigest(preferences);
  }, [loadWeather, loadDigest, preferences]);

  const handleSavePreferences = (updated: UserPreferences) => {
    setPreferences(updated);
    loadWeather(updated.latitude, updated.longitude, updated.city);
    loadDigest(updated);
  };

  // If viewing landing page
  if (currentView === "landing") {
    return (
      <LandingPage
        initialPreferences={preferences}
        onPreferencesChange={handleSavePreferences}
        onEnterDashboard={() => setCurrentView("dashboard")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      {/* Return to Landing Page navigation bar banner */}
      <div className="border-b border-zinc-200/80 bg-zinc-100/80 px-4 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-1.5 font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← Back to Bio-Responsive Landing Page</span>
          </button>
          <span className="text-zinc-500">Reader Dashboard View</span>
        </div>
      </div>

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenN8nGuide={() => setActiveTab("n8n")}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "digest" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Sidebar: Weather Widget + User Context */}
            <div className="space-y-6 lg:col-span-4">
              <WeatherWidget
                weather={weather}
                loading={loadingWeather}
                onRefresh={() =>
                  loadWeather(
                    preferences.latitude,
                    preferences.longitude,
                    preferences.city
                  )
                }
                onOpenLocationChange={() => setIsPreferencesOpen(true)}
              />

              {/* Active Profile Context Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Active Digest Profile
                  </h3>
                  <button
                    onClick={() => setIsPreferencesOpen(true)}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
                  >
                    Edit
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>{preferences.city}</span>
                  </div>

                  <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300">
                    <Tag className="mt-0.5 h-4 w-4 text-orange-500" />
                    <div className="flex flex-wrap gap-1">
                      {preferences.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Column: Digest Feed */}
            <div className="lg:col-span-8">
              <DigestFeed
                newsItems={newsItems}
                overview={
                  overview ||
                  "Generating your curated morning digest based on selected feeds and live weather..."
                }
                source={source}
                onRefresh={() => loadDigest(preferences)}
                loading={loadingDigest}
              />
            </div>
          </div>
        ) : (
          <N8nIntegrationGuide />
        )}
      </main>

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </div>
  );
}
