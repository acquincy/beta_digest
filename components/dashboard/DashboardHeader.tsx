"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal, LogOut } from "lucide-react";
import { clsx } from "clsx";

export interface DashboardHeaderProps {
  name?: string;
  dateLabel?: string;
  readOnly?: boolean;
  onSignOut?: () => void;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  name,
  dateLabel = "Daily Digest",
  readOnly = false,
  onSignOut,
  className,
}) => {
  return (
    <header
      className={clsx(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-7 mb-8 border-b border-white/10",
        className
      )}
    >
      <div>
        <p className="font-sans text-[13px] text-white/60 mb-1">{dateLabel}</p>
        <h1 className="font-display font-[600] text-[28px] sm:text-[36px] tracking-tight text-white leading-tight">
          {name ? (
            <>
              Good morning,{" "}
              <span className="bg-gradient-to-r from-[#6b62f2] to-[#8a7cfb] bg-clip-text text-transparent">
                {name}
              </span>
            </>
          ) : (
            "Good morning"
          )}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {readOnly ? (
          <>
            <div
              className="h-[40px] px-5 rounded-full bg-white/[0.04] border border-white/10 text-white text-[13px] font-medium flex items-center gap-2 select-none"
              aria-hidden="true"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/70" />
              <span>Edit preferences</span>
            </div>
            <div
              className="h-[40px] px-5 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-[13px] font-medium flex items-center gap-2 select-none"
              aria-hidden="true"
            >
              <LogOut className="w-3.5 h-3.5 text-white/70" />
              <span>Sign out</span>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/preferences"
              className="h-[40px] px-5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-[13px] font-medium transition-all duration-150 hover:-translate-y-[1px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb] flex items-center gap-2 select-none cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
              <span>Edit preferences</span>
            </Link>

            <button
              type="button"
              onClick={onSignOut}
              className="h-[40px] px-5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-[13px] font-medium transition-all duration-150 hover:-translate-y-[1px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb] flex items-center gap-2 select-none cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
