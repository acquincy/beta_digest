"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import { SectionCard } from "../primitives/SectionCard";
import { EditorialStory } from "@/lib/types";

export interface DashboardNewsListProps {
  stories: EditorialStory[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onStoryClick?: (index: number) => void;
  readOnly?: boolean;
  maxStories?: number;
  triggerButtonRefs?: React.MutableRefObject<(HTMLElement | null)[]>;
  className?: string;
}

export const DashboardNewsList: React.FC<DashboardNewsListProps> = ({
  stories,
  isLoading = false,
  error = null,
  onRetry,
  onStoryClick,
  readOnly = false,
  maxStories = 5,
  triggerButtonRefs,
  className,
}) => {
  const displayedStories = stories.slice(0, maxStories);

  return (
    <section className={clsx("w-full space-y-4", className)}>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="font-sans font-[600] text-[18px] text-white">Top 5 stories</h2>
        <span className="font-sans text-[13px] text-white/60">Curated morning dispatch</span>
      </div>

      {/* News List Container */}
      <SectionCard className="p-6 sm:p-8">
        {isLoading && stories.length === 0 ? (
          /* Loading Skeleton */
          <div className="divide-y divide-white/10 space-y-5 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="pt-5 first:pt-0 space-y-2.5">
                <div className="h-4 w-32 bg-white/10 rounded-full" />
                <div className="h-6 w-4/5 bg-white/[0.06] rounded-xl" />
                <div className="h-4 w-full bg-white/[0.04] rounded-md" />
              </div>
            ))}
          </div>
        ) : error && stories.length === 0 ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" aria-hidden="true" />
            <p className="font-sans text-[15px] font-medium text-white mb-1">
              Unable to load stories
            </p>
            <p className="font-sans text-[13px] text-white/60 mb-4 max-w-sm">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="h-[38px] px-5 rounded-full bg-white text-black font-semibold text-[13px] inline-flex items-center gap-2 transition hover:bg-white/90 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : displayedStories.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="font-sans text-[15px] font-medium text-white mb-1">
              No stories found for your selected topics
            </p>
            <p className="font-sans text-[13px] text-white/60 mb-4">
              Try adding more categories in your preferences.
            </p>
            {!readOnly && (
              <Link
                href="/preferences"
                className="h-[38px] px-5 rounded-full bg-white text-black font-semibold text-[13px] inline-flex items-center gap-2 hover:bg-white/90 transition"
              >
                <span>Choose topics</span>
              </Link>
            )}
          </div>
        ) : (
          /* News Stories List */
          <div className="divide-y divide-white/10">
            {displayedStories.map((story, i) => {
              if (readOnly) {
                return (
                  <div
                    key={story.id || i}
                    className="py-5 first:pt-0 last:pb-0 -mx-3 px-3 rounded-2xl group select-none"
                  >
                    {/* Meta row: Index, Category Pill, Source, Timestamp */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-sans text-[12px] font-medium text-white/40 tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="h-[24px] px-2.5 rounded-full text-[11px] font-medium bg-white/[0.06] border border-white/10 text-white/90 select-none inline-flex items-center">
                        {story.topicLabel}
                      </span>
                      <span className="font-sans text-[12px] text-white/50">· {story.source}</span>
                      <span className="font-sans text-[12px] text-white/40">
                        · {story.timestamp}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-sans font-[600] text-[17px] sm:text-[19px] text-white leading-snug mb-2">
                      {story.headline}
                    </h3>

                    {/* Summary */}
                    <p className="font-sans font-[400] text-[13.5px] leading-relaxed text-white/70 line-clamp-2 mb-3">
                      {story.summary}
                    </p>

                    {/* Read full story action (inert) */}
                    <div className="font-sans font-[500] text-[13px] text-white/80 inline-flex items-center gap-1.5">
                      <span>Read full story</span>
                      <ExternalLink className="w-3 h-3 text-white/60" aria-hidden="true" />
                    </div>
                  </div>
                );
              }

              return (
                <article
                  key={story.id || i}
                  role="button"
                  tabIndex={0}
                  ref={(el) => {
                    if (triggerButtonRefs) {
                      triggerButtonRefs.current[i] = el;
                    }
                  }}
                  onClick={() => onStoryClick?.(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onStoryClick?.(i);
                    }
                  }}
                  className="py-5 first:pt-0 last:pb-0 -mx-3 px-3 rounded-2xl group cursor-pointer transition-all duration-150 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb]"
                  aria-label={`Open story: ${story.headline}`}
                >
                  {/* Meta row: Index, Category Pill, Source, Timestamp */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-sans text-[12px] font-medium text-white/40 tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="h-[24px] px-2.5 rounded-full text-[11px] font-medium bg-white/[0.06] border border-white/10 text-white/90 select-none inline-flex items-center">
                      {story.topicLabel}
                    </span>
                    <span className="font-sans text-[12px] text-white/50">· {story.source}</span>
                    <span className="font-sans text-[12px] text-white/40">· {story.timestamp}</span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-sans font-[600] text-[17px] sm:text-[19px] text-white leading-snug group-hover:text-white/90 transition-colors mb-2">
                    {story.headline}
                  </h3>

                  {/* Summary */}
                  <p className="font-sans font-[400] text-[13.5px] leading-relaxed text-white/70 line-clamp-2 mb-3">
                    {story.summary}
                  </p>

                  {/* Read full story action */}
                  <div className="font-sans font-[500] text-[13px] text-white/80 group-hover:text-white inline-flex items-center gap-1.5 transition-colors">
                    <span>Read full story</span>
                    <ExternalLink
                      className="w-3 h-3 text-white/60 group-hover:text-white transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>
    </section>
  );
};
