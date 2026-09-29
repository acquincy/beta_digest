"use client";

import React from "react";
import { Sparkles, SlidersHorizontal, Workflow, Bell } from "lucide-react";

interface HeaderProps {
  onOpenPreferences: () => void;
  onOpenN8nGuide: () => void;
  activeTab: "digest" | "n8n";
  setActiveTab: (tab: "digest" | "n8n") => void;
}

export function Header({
  onOpenPreferences,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Beta Digest
              </span>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {todayFormatted} • Daily Weather & Intelligent Brief
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
            <button
              onClick={() => setActiveTab("digest")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "digest"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Today&apos;s Digest</span>
            </button>
            <button
              onClick={() => setActiveTab("n8n")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "n8n"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Workflow className="h-3.5 w-3.5 text-orange-500" />
              <span>n8n Pipeline</span>
            </button>
          </div>

          <button
            onClick={onOpenPreferences}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Edit Preferences"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Preferences</span>
          </button>
        </div>
      </div>
    </header>
  );
}
