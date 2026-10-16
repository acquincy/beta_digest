"use client";

import React from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export interface HeaderProps {
  className?: string;
  variant?: "floating" | "simple";
}

export const Header: React.FC<HeaderProps> = ({ className = "", variant = "floating" }) => {
  return (
    <header className={`sticky top-4 md:top-6 z-50 w-full px-4 sm:px-6 flex justify-center pointer-events-none ${className}`}>
      <div className="pointer-events-auto max-w-[980px] w-full h-[58px] px-3 sm:px-5 rounded-full bg-[#161616]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex items-center justify-between transition-all">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full px-2 py-1 select-none"
          aria-label="BetaDigest Home"
        >
          <div className="relative w-[26px] h-[26px] shrink-0" aria-hidden="true">
            <Mail className="w-[26px] h-[26px] text-white stroke-[1.75]" aria-hidden="true" />
            <div
              className="absolute -top-[2px] -right-[2px] w-[8px] h-[8px] rounded-full bg-[#6b62f2] shadow-[0_0_8px_#6b62f2]"
            />
          </div>

          <span
            className="font-display font-[600] text-[18px] sm:text-[20px] leading-none text-[#ededed] group-hover:text-white transition-colors tracking-tight"
          >
            BetaDigest
          </span>
        </Link>

        {/* Desktop Nav Links (hidden on compact mobile) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 text-[14px] text-[#c2c2c2]">
          <Link
            href="/#features"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#faq"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="text-[13px] sm:text-[14px] font-medium text-[#c2c2c2] hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-black bg-white hover:bg-[#ededed] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(255,255,255,0.12)] whitespace-nowrap"
          >
            <span>Get your digest</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
};
