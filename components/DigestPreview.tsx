"use client";

import React from "react";
import { clsx } from "clsx";
import { CityWeatherData, EditorialStory, WeatherTopicId } from "@/lib/types";
import { deriveDigestText } from "@/lib/digest-derivation";
import { Mail } from "lucide-react";

export interface DigestPreviewProps {
  city: CityWeatherData;
  weatherTopics: WeatherTopicId[];
  stories: EditorialStory[];
  className?: string;
}

export const DigestPreview: React.FC<DigestPreviewProps> = ({
  city,
  weatherTopics,
  stories,
  className,
}) => {
  const previewText = deriveDigestText({
    city,
    weatherTopics,
    stories,
  });

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className="relative w-full flex items-center justify-center p-2 sm:p-4">
        <article
          aria-label="Email Digest Preview"
          className="relative z-10 w-full max-w-[490px] p-6 sm:p-7 rounded-[32px] border border-[var(--line)] bg-white shadow-sm transition-all duration-200"
        >
          <div className="flex flex-col gap-1.5 pb-3 border-b border-[var(--line)] text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted-sm)] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                From: <strong className="text-black font-semibold">BetaDigest</strong> &lt;dispatch@betadigest.com&gt;
              </span>
              <span className="tabular-nums text-[var(--text-muted-sm)] font-medium">
                07:00 AM
              </span>
            </div>
            <div className="text-black font-medium">
              Subject: Your morning digest · {city.city} ({city.currentTemp}{city.tempUnit})
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-black">
              DAILY DIGEST
            </div>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-black font-normal">
              {previewText}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
