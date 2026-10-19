"use client";

import React from "react";
import { clsx } from "clsx";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardWeatherCard } from "./DashboardWeatherCard";
import { DashboardNewsList } from "./DashboardNewsList";
import { CityWeatherData, EditorialStory, WeatherTopicId } from "@/lib/types";

export interface DashboardBoardProps {
  userName?: string;
  dateLabel?: string;
  weather: CityWeatherData;
  cityName?: string;
  countryName?: string;
  weatherTopics?: WeatherTopicId[];
  stories: EditorialStory[];
  weatherLastUpdated?: string;
  weatherLoading?: boolean;
  weatherError?: string | null;
  newsLoading?: boolean;
  newsError?: string | null;
  onRetryWeather?: () => void;
  onRetryNews?: () => void;
  onStoryClick?: (index: number) => void;
  onSignOut?: () => void;
  readOnly?: boolean;
  forceSingleColumn?: boolean;
  maxStories?: number;
  triggerButtonRefs?: React.MutableRefObject<(HTMLElement | null)[]>;
  className?: string;
}

export const DashboardBoard: React.FC<DashboardBoardProps> = ({
  userName,
  dateLabel,
  weather,
  cityName,
  countryName,
  weatherTopics = [],
  stories,
  weatherLastUpdated,
  weatherLoading = false,
  weatherError = null,
  newsLoading = false,
  newsError = null,
  onRetryWeather,
  onRetryNews,
  onStoryClick,
  onSignOut,
  readOnly = false,
  forceSingleColumn = false,
  maxStories = 5,
  triggerButtonRefs,
  className,
}) => {
  return (
    <div
      className={clsx(
        "bg-[#141418]/85 border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl transition-all duration-200",
        forceSingleColumn
          ? "p-4 sm:p-5 rounded-[24px]"
          : "rounded-[32px] md:rounded-[40px] p-6 sm:p-9 lg:p-10",
        className
      )}
    >
      {/* Header Row */}
      <DashboardHeader
        name={userName}
        dateLabel={dateLabel}
        readOnly={readOnly}
        onSignOut={onSignOut}
      />

      {/* Grid or Single-Column Layout */}
      <div
        className={clsx(
          forceSingleColumn
            ? "flex flex-col gap-6"
            : "grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-8 items-start"
        )}
      >
        <DashboardWeatherCard
          weather={weather}
          cityName={cityName}
          countryName={countryName}
          selectedWeatherTopics={weatherTopics}
          isLoading={weatherLoading}
          error={weatherError}
          lastUpdated={weatherLastUpdated}
          onRetry={onRetryWeather}
          readOnly={readOnly}
          isSticky={!forceSingleColumn && !readOnly}
        />

        <DashboardNewsList
          stories={stories}
          isLoading={newsLoading}
          error={newsError}
          onRetry={onRetryNews}
          onStoryClick={onStoryClick}
          readOnly={readOnly}
          maxStories={maxStories}
          triggerButtonRefs={triggerButtonRefs}
        />
      </div>
    </div>
  );
};
