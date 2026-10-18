"use client";

import React, { useId } from "react";

interface WeatherWidgetIconProps {
  condition?: string;
  size?: number;
  className?: string;
}

/**
 * WeatherWidgetIcon
 * Renders rich multi-toned vector weather artwork inspired by weatherwidget.org
 * Featuring layered gradients (sun amber-gold, cloud white-silver, rain cyan, lightning coral).
 */
export const WeatherWidgetIcon: React.FC<WeatherWidgetIconProps> = ({
  condition = "clear",
  size = 48,
  className = "",
}) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  const sunGradId = `ww_sun_${uid}`;
  const sunGlowId = `ww_glow_${uid}`;
  const cloudFrontId = `ww_cfront_${uid}`;
  const cloudBackId = `ww_cback_${uid}`;
  const cloudStormId = `ww_cstorm_${uid}`;
  const rainGradId = `ww_rain_${uid}`;
  const lightningGradId = `ww_light_${uid}`;

  const normalized = condition.toLowerCase();

  const isThunder =
    normalized.includes("thunder") ||
    normalized.includes("storm") ||
    normalized.includes("lightning");

  const isRain =
    !isThunder &&
    (normalized.includes("rain") ||
      normalized.includes("drizzle") ||
      normalized.includes("shower"));

  const isSnow =
    normalized.includes("snow") ||
    normalized.includes("hail") ||
    normalized.includes("sleet") ||
    normalized.includes("flurry");

  const isCloudy =
    normalized.includes("cloud") ||
    normalized.includes("overcast") ||
    normalized.includes("fog") ||
    normalized.includes("mist") ||
    normalized.includes("haze");

  const isPartlyCloudy =
    normalized.includes("partly") ||
    normalized.includes("scattered") ||
    normalized.includes("mainly clear") ||
    normalized.includes("breeze") ||
    (normalized.includes("clear") && normalized.includes("cloud"));

  const isClear =
    !isThunder &&
    !isRain &&
    !isSnow &&
    (normalized.includes("clear") ||
      normalized.includes("sun") ||
      normalized.includes("fair") ||
      (!isCloudy && !isPartlyCloudy));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label={condition}
      role="img"
    >
      <defs>
        {/* Sun Gradient */}
        <radialGradient id={sunGradId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="55%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF9800" />
        </radialGradient>

        {/* Ambient Sun Glow */}
        <filter id={sunGlowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Front Cloud Gradient */}
        <linearGradient id={cloudFrontId} x1="10" y1="16" x2="28" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="85%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Back Cloud Gradient (for overcast) */}
        <linearGradient id={cloudBackId} x1="16" y1="10" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Storm Cloud Gradient */}
        <linearGradient id={cloudStormId} x1="12" y1="14" x2="30" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="80%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Raindrop Cyan Gradient */}
        <linearGradient id={rainGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Lightning Bolt Coral/Gold Gradient */}
        <linearGradient id={lightningGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* --- 1. THUNDERSTORM --- */}
      {isThunder && (
        <g>
          {/* Storm Cloud */}
          <path
            d="M48 38H18a10 10 0 0 1-1.8-19.8A14 14 0 0 1 43.4 19 9.5 9.5 0 0 1 48 38z"
            fill={`url(#${cloudStormId})`}
            filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
          />
          {/* Sharp Lightning Bolt */}
          <path
            d="M33 32l-5 11h6l-3 11 11-13h-6l5-9h-8z"
            fill={`url(#${lightningGradId})`}
            filter="drop-shadow(0px 0px 6px rgba(245,158,11,0.6))"
          />
        </g>
      )}

      {/* --- 2. RAIN / SHOWERS --- */}
      {isRain && (
        <g>
          {/* Base Cloud */}
          <path
            d="M50 34H18a11 11 0 0 1-2-21.8A15 15 0 0 1 45.4 13 10.5 10.5 0 0 1 50 34z"
            fill={`url(#${cloudFrontId})`}
            filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.25))"
          />
          {/* Angled Rain Drops */}
          <path
            d="M21 40l-3 9"
            stroke={`url(#${rainGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M31 40l-3 9"
            stroke={`url(#${rainGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M41 40l-3 9"
            stroke={`url(#${rainGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* --- 3. SNOW / SLEET --- */}
      {isSnow && (
        <g>
          <path
            d="M50 34H18a11 11 0 0 1-2-21.8A15 15 0 0 1 45.4 13 10.5 10.5 0 0 1 50 34z"
            fill={`url(#${cloudFrontId})`}
            filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.25))"
          />
          {/* Snow Flake Dots */}
          <circle cx="21" cy="44" r="2.5" fill="#E0F2FE" />
          <circle cx="32" cy="47" r="2.5" fill="#E0F2FE" />
          <circle cx="43" cy="44" r="2.5" fill="#E0F2FE" />
        </g>
      )}

      {/* --- 4. PARTLY CLOUDY (Sun + Cloud) --- */}
      {!isThunder && !isRain && !isSnow && isPartlyCloudy && (
        <g>
          {/* Sun behind */}
          <circle
            cx="40"
            cy="23"
            r="12"
            fill={`url(#${sunGradId})`}
            filter={`url(#${sunGlowId})`}
          />
          {/* Sun Rays */}
          <path
            d="M40 7v3M40 36v3M56 23h-3M27 23h-3M51.3 11.7l-2.1 2.1M49.2 32.2l2.1 2.1M28.7 11.7l2.1 2.1"
            stroke="#FFB300"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Foreground Cloud */}
          <path
            d="M48 46H18a11 11 0 0 1-2.2-21.8A15 15 0 0 1 43.6 25 10.5 10.5 0 0 1 48 46z"
            fill={`url(#${cloudFrontId})`}
            filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.3))"
          />
        </g>
      )}

      {/* --- 5. OVERCAST / CLOUDY --- */}
      {!isThunder && !isRain && !isSnow && !isPartlyCloudy && isCloudy && (
        <g>
          {/* Back Cloud */}
          <path
            d="M52 33H26a10 10 0 0 1-1.8-19.8A14 14 0 0 1 47.4 15 9.5 9.5 0 0 1 52 33z"
            fill={`url(#${cloudBackId})`}
            opacity="0.9"
          />
          {/* Main Front Cloud */}
          <path
            d="M46 47H16a11 11 0 0 1-2.2-21.8A15 15 0 0 1 41.6 26 10.5 10.5 0 0 1 46 47z"
            fill={`url(#${cloudFrontId})`}
            filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.25))"
          />
        </g>
      )}

      {/* --- 6. CLEAR / SUNNY --- */}
      {isClear && !isCloudy && !isPartlyCloudy && (
        <g filter={`url(#${sunGlowId})`}>
          {/* Radiant Sun Core */}
          <circle cx="32" cy="32" r="14" fill={`url(#${sunGradId})`} />
          {/* Dynamic Sun Rays */}
          <path
            d="M32 9v6M32 49v6M55 32h-6M15 32H9M48.3 15.7l-4.2 4.2M19.9 44.1l-4.2 4.2M48.3 48.3l-4.2-4.2M19.9 19.9l-4.2-4.2"
            stroke="#FFB300"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Center specular highlight */}
          <ellipse cx="28" cy="27" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.45" />
        </g>
      )}
    </svg>
  );
};
