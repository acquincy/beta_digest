"use client";

import React from "react";
import { WeatherData } from "@/lib/types";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Compass,
  MapPin,
} from "lucide-react";

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  onRefresh: () => void;
  onOpenLocationChange: () => void;
}

export function WeatherWidget({
  weather,
  loading,
  onRefresh,
  onOpenLocationChange,
}: WeatherWidgetProps) {
  if (loading || !weather) {
    return (
      <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
        <div className="h-12 w-24 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
        <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  const getWeatherIcon = (code: number) => {
    if ([0, 1].includes(code)) return <Sun className="h-8 w-8 text-amber-500 animate-spin-slow" />;
    if ([2, 3].includes(code)) return <Cloud className="h-8 w-8 text-slate-400" />;
    if ([45, 48].includes(code)) return <CloudFog className="h-8 w-8 text-zinc-400" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return <CloudRain className="h-8 w-8 text-sky-500" />;
    if ([71, 73, 75].includes(code))
      return <CloudSnow className="h-8 w-8 text-indigo-300" />;
    if ([95, 96, 99].includes(code))
      return <CloudLightning className="h-8 w-8 text-yellow-500" />;
    return <Cloud className="h-8 w-8 text-slate-400" />;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-orange-50/30 p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-orange-950/20">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onOpenLocationChange}
            className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            <MapPin className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span>
              {weather.city}
              {weather.country ? `, ${weather.country}` : ""}
            </span>
          </button>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {weather.temperature}°C
            </span>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Feels like {weather.apparentTemperature}°C
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {weather.conditionText}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100/60 p-2 dark:bg-orange-950/40">
            {getWeatherIcon(weather.weatherCode)}
          </div>
          <button
            onClick={onRefresh}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            Update now
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-zinc-200/80 pt-4 text-center dark:border-zinc-800">
        <div className="rounded-lg bg-zinc-100/70 p-2 dark:bg-zinc-800/50">
          <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <Wind className="h-3 w-3 text-sky-500" /> Wind
          </div>
          <div className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {weather.windSpeed} km/h
          </div>
        </div>

        <div className="rounded-lg bg-zinc-100/70 p-2 dark:bg-zinc-800/50">
          <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <Droplets className="h-3 w-3 text-cyan-500" /> Humidity
          </div>
          <div className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {weather.humidity}%
          </div>
        </div>

        <div className="rounded-lg bg-zinc-100/70 p-2 dark:bg-zinc-800/50">
          <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <Compass className="h-3 w-3 text-amber-500" /> UV Index
          </div>
          <div className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {weather.uvIndex ?? 2}
          </div>
        </div>
      </div>

      {/* Lifestyle advisory banner */}
      {weather.lifestyleAdvice && (
        <div className="mt-4 rounded-xl border border-orange-200/60 bg-orange-50/70 p-3 text-xs leading-relaxed text-orange-900 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-200">
          <strong className="font-semibold">Daily Advisory:</strong>{" "}
          {weather.lifestyleAdvice}
        </div>
      )}

      {/* 3-Day Forecast mini-cards */}
      {weather.dailyForecast && weather.dailyForecast.length > 0 && (
        <div className="mt-4 border-t border-zinc-200/80 pt-3 dark:border-zinc-800">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Upcoming Forecast
          </div>
          <div className="grid grid-cols-3 gap-2">
            {weather.dailyForecast.map((day) => {
              const dayName = new Date(day.date).toLocaleDateString("en-US", {
                weekday: "short",
              });
              return (
                <div
                  key={day.date}
                  className="rounded-lg border border-zinc-200/60 bg-white/70 p-2 text-center text-xs dark:border-zinc-800 dark:bg-zinc-900/70"
                >
                  <div className="font-medium text-zinc-500 dark:text-zinc-400">
                    {dayName}
                  </div>
                  <div className="my-1 font-bold text-zinc-800 dark:text-zinc-200">
                    {day.maxTemp}° / {day.minTemp}°
                  </div>
                  <div className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                    {day.conditionText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
