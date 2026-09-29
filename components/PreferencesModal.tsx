"use client";

import React, { useState } from "react";
import { TopicCategory, UserPreferences } from "@/lib/types";
import {
  X,
  MapPin,
  Mail,
  Bell,
  Check,
  Search,
  Loader2,
} from "lucide-react";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (updated: UserPreferences) => void;
}

const ALL_TOPICS: { id: TopicCategory; label: string; desc: string }[] = [
  { id: "tech", label: "Technology", desc: "Software, hardware, developer tools" },
  { id: "ai", label: "Artificial Intelligence", desc: "LLMs, robotics, ML research" },
  { id: "startups", label: "Startups & VC", desc: "Early stage funding, product launches" },
  { id: "business", label: "Business & Markets", desc: "Economy, corporate strategy, trade" },
  { id: "science", label: "Science & Space", desc: "Astrophysics, biotech, climate tech" },
  { id: "world", label: "World Affairs", desc: "Global headlines and geopolitical trends" },
];

export function PreferencesModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: PreferencesModalProps) {
  const [formData, setFormData] = useState<UserPreferences>(preferences);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; country: string; latitude: number; longitude: number }[]
  >([]);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch {
      // Ignore search error
    } finally {
      setSearching(false);
    }
  };

  const selectCity = (city: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      city: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
    }));
    setSearchResults([]);
    setSearchQuery("");
  };

  const toggleTopic = (topic: TopicCategory) => {
    setFormData((prev) => {
      const exists = prev.topics.includes(topic);
      const updated = exists
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic];
      return { ...prev, topics: updated.length > 0 ? updated : [topic] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Digest & Subscription Preferences
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Customize your location for weather alerts and select your curated interest topics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Primary Location (Weather Context)
            </label>
            <div className="mb-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Current: {formData.city} ({formData.latitude.toFixed(2)}, {formData.longitude.toFixed(2)})
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search city (e.g., Tokyo, London, Austin)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
              <button
                type="button"
                onClick={handleCitySearch}
                disabled={searching}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white p-1 text-xs shadow-md dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
                {searchResults.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectCity(city)}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900"
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

          {/* Topics Checklist */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Digest Topics
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_TOPICS.map((topic) => {
                const selected = formData.topics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                      selected
                        ? "border-orange-500/80 bg-orange-50/50 dark:border-orange-500/60 dark:bg-orange-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-md border ${
                        selected
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {topic.label}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {topic.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Automated Delivery Channels
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Daily Email Brief
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Formatted HTML summary sent at 07:00 AM
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailEnabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailEnabled: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded text-orange-500 accent-orange-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-zinc-500" />
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Web Push Notifications
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Browser notification when weather alerts or digests arrive
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.pushEnabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pushEnabled: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded text-orange-500 accent-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-medium text-white shadow-md shadow-orange-600/20 hover:bg-orange-500"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
