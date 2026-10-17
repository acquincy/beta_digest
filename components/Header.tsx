"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Menu, X } from "lucide-react";

export interface HeaderProps {
  className?: string;
  variant?: "floating" | "simple";
}

export const Header: React.FC<HeaderProps> = ({ className = "", variant = "floating" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-4 md:top-6 z-50 w-full px-4 sm:px-6 flex flex-col items-center pointer-events-none ${className}`}>
      <div className="pointer-events-auto max-w-[980px] w-full h-[58px] px-3.5 sm:px-5 rounded-full bg-[#161616]/85 backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.12)] flex items-center justify-between transition-all duration-200">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full px-1.5 py-1 select-none shrink-0"
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

        {/* Desktop Nav Links */}
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
            className="hidden sm:inline-flex text-[13px] sm:text-[14px] font-medium text-[#c2c2c2] hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-[12px] sm:text-[14px] font-medium text-black bg-white hover:bg-[#ededed] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(255,255,255,0.12)] whitespace-nowrap"
          >
            <span>Get your digest</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" aria-hidden="true" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-full text-[#c2c2c2] hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 text-[#ededed]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden w-full max-w-[980px] mt-2 p-4 rounded-[24px] bg-[#161616]/95 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-[15px] font-medium text-[#ededed] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-[15px] font-medium text-[#ededed] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-[15px] font-medium text-[#ededed] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            FAQ
          </Link>
          <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] font-medium text-[#c2c2c2] hover:text-white py-1 transition-colors"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
