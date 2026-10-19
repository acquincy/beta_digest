"use client";

import React from "react";
import {
  Thermometer,
  ArrowUpDown,
  CloudRain,
  CloudLightning,
  Cloud,
  Sun,
  Wind,
  Compass,
  Droplets,
  Sunrise,
  Clock,
  Calendar,
  AlertTriangle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { WeatherWidgetIcon } from "../WeatherWidgetIcon";
import { SectionCard } from "../primitives/SectionCard";
import { CityWeatherData, WeatherTopicId } from "@/lib/types";

export interface CompactMetricConfig {
  icon: LucideIcon;
  label: string;
  isAvailable?: (w: CityWeatherData) => boolean;
  getValue: (w: CityWeatherData) => React.ReactNode;
  getSecondary?: (w: CityWeatherData) => React.ReactNode;
}

export const COMPACT_METRICS: Record<string, CompactMetricConfig> = {
  "current-temperature": {
    icon: Thermometer,
    label: "Feels like",
    isAvailable: (w) => typeof w.feelsLike === "number",
    getValue: (w) => `${w.feelsLike}${w.tempUnit}`,
    getSecondary: (w) => {
      if (typeof w.feelsLike !== "number") return null;
      const diff = w.feelsLike - w.currentTemp;
      if (diff > 0) return `${diff}° above actual`;
      if (diff < 0) return `${Math.abs(diff)}° below actual`;
      return "Same as actual";
    },
  },
  "high-low": {
    icon: ArrowUpDown,
    label: "Day's High / Low",
    getValue: (w) => `${w.high}° / ${w.low}°`,
    getSecondary: (w) => `Daily range (${w.tempUnit})`,
  },
  "rain-chance": {
    icon: CloudRain,
    label: "Rain chance",
    getValue: (w) => `${w.rainProb}%`,
    getSecondary: (w) => (w.rainProb > 40 ? "Precipitation likely" : "Low precipitation risk"),
  },
  "thunderstorm-chance": {
    icon: CloudLightning,
    label: "Thunderstorm",
    getValue: (w) => `${w.thunderstormProb || 0}%`,
    getSecondary: (w) =>
      (w.thunderstormProb || 0) > 30 ? "Storm warning" : "Minimal storm activity",
  },
  cloudiness: {
    icon: Cloud,
    label: "Cloudiness",
    getValue: (w) => `${w.cloudiness}%`,
    getSecondary: (w) =>
      w.cloudiness > 70
        ? "Overcast skies"
        : w.cloudiness > 30
        ? "Scattered clouds"
        : "Clear skies",
  },
  "uv-index": {
    icon: Sun,
    label: "UV index",
    getValue: (w) => `${w.uvIndex}`,
    getSecondary: (w) => (w.uvDescription ? `(${w.uvDescription})` : null),
  },
  "air-quality": {
    icon: Wind,
    label: "Air quality",
    getValue: (w) => `AQI ${w.airQuality ?? 0}`,
    getSecondary: (w) => {
      const aqi = w.airQuality ?? 0;
      const color =
        aqi <= 50 ? "text-emerald-400" : aqi <= 100 ? "text-amber-400" : "text-rose-400";
      return (
        <span className={clsx("font-semibold", color)}>
          {w.airQualityDescription || "Moderate"}
        </span>
      );
    },
  },
  wind: {
    icon: Compass,
    label: "Wind",
    getValue: (w) => `${w.windSpeed} ${w.windUnit}`,
    getSecondary: (w) => (w.windDirection ? `Direction: ${w.windDirection}` : null),
  },
  humidity: {
    icon: Droplets,
    label: "Humidity",
    getValue: (w) => `${w.humidity}%`,
    getSecondary: (w) =>
      w.humidity > 70 ? "Humid" : w.humidity < 35 ? "Dry" : "Comfortable",
  },
  "sun-times": {
    icon: Sunrise,
    label: "Sun times",
    getValue: (w) => `${w.sunrise} / ${w.sunset}`,
    getSecondary: () => "Sunrise & sunset",
  },
};

export interface DashboardWeatherCardProps {
  weather: CityWeatherData;
  cityName?: string;
  countryName?: string;
  selectedWeatherTopics?: WeatherTopicId[];
  isLoading?: boolean;
  error?: string | null;
  lastUpdated?: string;
  onRetry?: () => void;
  readOnly?: boolean;
  isSticky?: boolean;
  className?: string;
}

export const DashboardWeatherCard: React.FC<DashboardWeatherCardProps> = ({
  weather,
  cityName,
  countryName,
  selectedWeatherTopics = [],
  isLoading = false,
  error = null,
  lastUpdated,
  onRetry,
  readOnly = false,
  isSticky = true,
  className,
}) => {
  const compactItems = selectedWeatherTopics.filter((t) => {
    if (t === "hourly-3h" || t === "forecast-3day") return false;
    const config = COMPACT_METRICS[t];
    if (!config) return false;
    if (config.isAvailable && !config.isAvailable(weather)) return false;
    return true;
  });

  const showHourlySection = selectedWeatherTopics.includes("hourly-3h");
  const showForecastSection = selectedWeatherTopics.includes("forecast-3day");

  return (
    <aside
      className={clsx(
        "w-full flex flex-col space-y-3",
        isSticky && !readOnly && "lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-48px)]",
        className
      )}
    >
      <div className="flex items-center justify-between px-1 shrink-0">
        <h2 className="font-sans font-[600] text-[18px] text-white">Your weather</h2>
      </div>

      {/* Weather Content Card */}
      <SectionCard className="p-6 flex-1 min-h-0 lg:overflow-y-auto thin-scrollbar">
        {isLoading && !weather ? (
          /* Loading Skeleton */
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-36 bg-white/10 rounded-full" />
            <div className="h-20 w-full bg-white/[0.04] rounded-2xl" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-24 bg-white/[0.03] rounded-[20px]" />
              <div className="h-24 bg-white/[0.03] rounded-[20px]" />
            </div>
          </div>
        ) : error && !weather ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="w-7 h-7 text-amber-400 mb-2" aria-hidden="true" />
            <p className="font-sans text-[14px] font-medium text-white mb-1">
              Weather data unavailable
            </p>
            <p className="font-sans text-[12px] text-white/60 mb-4 max-w-xs">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="h-[36px] px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-[12px] font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : (
          /* Loaded Weather Content */
          <div className="space-y-5">
            {/* Hero Block: Location, Condition Icon, Condition Text, Temp, High/Low */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-sans text-[13px] font-medium text-white/60 truncate">
                  {cityName || weather.city || "Seattle"},{" "}
                  {countryName || weather.country || "United States"}
                </div>
                <div className="font-sans font-[600] text-[16px] text-white capitalize mt-0.5">
                  {weather.condition}
                </div>
                <div className="font-sans text-[12px] text-white/60 tabular-nums mt-1">
                  H: <strong className="text-white font-medium">{weather.high}°</strong>
                  {" · "}
                  L: <strong className="text-white font-medium">{weather.low}°</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right shrink-0">
                <div className="p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0">
                  <WeatherWidgetIcon condition={weather.condition} size={42} />
                </div>
                <div className="font-sans font-[700] text-[36px] sm:text-[40px] text-white tracking-tight leading-none tabular-nums">
                  {weather.currentTemp}
                  {weather.tempUnit}
                </div>
              </div>
            </div>

            {/* Tiles under divider with no heading */}
            {(compactItems.length > 0 ||
              (showHourlySection && weather.hourly?.length) ||
              (showForecastSection && weather.threeDay?.length)) && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                {/* 2-Column Grid of Compact Tiles */}
                {compactItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {compactItems.map((topId, index) => {
                      const config = COMPACT_METRICS[topId];
                      if (!config) return null;
                      const Icon = config.icon;
                      const secondary = config.getSecondary ? config.getSecondary(weather) : null;
                      const isOddLast =
                        compactItems.length % 2 !== 0 && index === compactItems.length - 1;
                      const spanClass =
                        isOddLast || compactItems.length === 1 ? "sm:col-span-2" : "";

                      return (
                        <div
                          key={topId}
                          className={clsx(
                            "p-4 sm:p-5 rounded-[20px] bg-white/[0.04] border border-white/10 flex flex-col justify-between transition-all hover:border-white/20",
                            spanClass
                          )}
                        >
                          <div className="flex items-center gap-2 text-white/60 text-[13px] font-sans font-medium">
                            <Icon className="w-4 h-4 text-[#8a7cfb] shrink-0" aria-hidden="true" />
                            <span className="truncate">{config.label}</span>
                          </div>
                          <div className="mt-2.5">
                            <div className="font-sans font-[700] text-[24px] sm:text-[26px] text-white tracking-tight leading-none tabular-nums">
                              {config.getValue(weather)}
                            </div>
                            {secondary && (
                              <div className="font-sans text-[12px] text-white/50 font-normal mt-1.5 leading-snug">
                                {secondary}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Complex: 3-Hour Breakdown */}
                {showHourlySection && weather.hourly && weather.hourly.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-[20px] bg-white/[0.04] border border-white/10 transition-all hover:border-white/20 space-y-3">
                    <div className="flex items-center gap-2 text-white/60 text-[13px] font-sans font-medium">
                      <Clock className="w-4 h-4 text-[#8a7cfb] shrink-0" aria-hidden="true" />
                      <span>3-hour breakdown</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {weather.hourly.slice(0, 4).map((h, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-[14px] bg-white/[0.03] border border-white/5 flex flex-col items-center"
                        >
                          <span className="font-sans text-[11px] text-white/60 tabular-nums">
                            {h.time}
                          </span>
                          <WeatherWidgetIcon condition={h.condition} size={22} className="my-1.5" />
                          <span className="font-sans text-[13px] font-bold text-white tabular-nums">
                            {h.temp}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complex: 3-Day Forecast */}
                {showForecastSection && weather.threeDay && weather.threeDay.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-[20px] bg-white/[0.04] border border-white/10 transition-all hover:border-white/20 space-y-3">
                    <div className="flex items-center gap-2 text-white/60 text-[13px] font-sans font-medium">
                      <Calendar className="w-4 h-4 text-[#8a7cfb] shrink-0" aria-hidden="true" />
                      <span>3-day forecast</span>
                    </div>
                    <div className="divide-y divide-white/[0.08]">
                      {weather.threeDay.map((d, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-[13px]"
                        >
                          <span className="font-sans font-medium text-white/90 w-[70px]">
                            {d.day}
                          </span>
                          <div className="flex items-center gap-1.5 flex-1 justify-center">
                            <WeatherWidgetIcon condition={d.condition} size={20} />
                            <span className="font-sans text-[11px] text-white/60 capitalize truncate max-w-[85px] hidden sm:inline">
                              {d.condition}
                            </span>
                          </div>
                          <span className="font-sans text-[12px] text-white/70 tabular-nums text-right w-[80px]">
                            <strong className="text-white font-semibold">{d.high}°</strong> /{" "}
                            {d.low}°
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If user selected no details */}
            {selectedWeatherTopics.length === 0 && (
              <div className="pt-3 border-t border-white/10 text-center py-2">
                <p className="font-sans text-[13px] text-white/60">No extra details selected.</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 font-sans text-[12px] text-white/50">
              Last updated {lastUpdated || "Just now"}
            </div>
          </div>
        )}
      </SectionCard>
    </aside>
  );
};
