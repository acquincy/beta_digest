"use client";

import React, { useState } from "react";
import { DigestNewsItem, TopicCategory } from "@/lib/types";
import {
  ExternalLink,
  Sparkles,
  Cpu,
  Brain,
  Rocket,
  TrendingUp,
  FlaskConical,
  Globe,
  Trophy,
} from "lucide-react";

interface DigestFeedProps {
  newsItems: DigestNewsItem[];
  overview: string;
  source: string;
  onRefresh: () => void;
  loading: boolean;
}

const CATEGORY_META: Record<
  TopicCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  tech: {
    label: "Technology",
    icon: <Cpu className="h-3.5 w-3.5 text-blue-500" />,
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  ai: {
    label: "Artificial Intelligence",
    icon: <Brain className="h-3.5 w-3.5 text-purple-500" />,
    color: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },
  startups: {
    label: "Startups & VC",
    icon: <Rocket className="h-3.5 w-3.5 text-emerald-500" />,
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  business: {
    label: "Business",
    icon: <TrendingUp className="h-3.5 w-3.5 text-amber-500" />,
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
  science: {
    label: "Science",
    icon: <FlaskConical className="h-3.5 w-3.5 text-teal-500" />,
    color: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
  },
  world: {
    label: "World News",
    icon: <Globe className="h-3.5 w-3.5 text-rose-500" />,
    color: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  },
  sports: {
    label: "Sports",
    icon: <Trophy className="h-3.5 w-3.5 text-orange-500" />,
    color: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
  },
};

export function DigestFeed({
  newsItems,
  overview,
  source,
  onRefresh,
  loading,
}: DigestFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredItems =
    selectedFilter === "all"
      ? newsItems
      : newsItems.filter((i) => i.category === selectedFilter);

  return (
    <div className="space-y-4">
      {/* AI Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Executive Morning Synthesis
            </h2>
          </div>
          <span className="text-[11px] font-medium text-zinc-400">
            Pipeline: <span className="font-semibold text-zinc-600 dark:text-zinc-300">{source}</span>
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {overview}
        </p>
      </div>

      {/* Category Pills Filter & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedFilter === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            All Updates ({newsItems.length})
          </button>
          {Object.entries(CATEGORY_META).map(([catKey, meta]) => {
            const count = newsItems.filter((i) => i.category === catKey).length;
            if (count === 0) return null;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedFilter(catKey)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedFilter === catKey
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {meta.icon}
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs font-medium text-orange-600 hover:text-orange-700 disabled:opacity-50 dark:text-orange-400"
        >
          {loading ? "Refreshing..." : "Regenerate brief"}
        </button>
      </div>

      {/* Articles Stream */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const meta = CATEGORY_META[item.category] || CATEGORY_META.tech;
          return (
            <article
              key={item.id}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.color}`}
                >
                  {meta.icon}
                  {meta.label}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {item.source}
                </span>
              </div>

              <h3 className="text-base font-semibold tracking-tight text-zinc-900 group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  <span>{item.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-zinc-400" />
                </a>
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.summary}
              </p>

              {item.aiTakeaway && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-zinc-50 p-2.5 text-xs text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                  <span className="italic">{item.aiTakeaway}</span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
