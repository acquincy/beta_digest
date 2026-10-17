"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export interface HeaderProps {
  className?: string;
  variant?: "floating" | "simple";
}

export const Header: React.FC<HeaderProps> = ({ className = "", variant = "floating" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-4 md:top-6 z-50 w-full px-4 sm:px-6 flex flex-col items-center pointer-events-none ${className}`}>
      <div className="pointer-events-auto max-w-[980px] w-full h-[58px] px-3.5 sm:px-5 rounded-full bg-[#141418]/80 hover:bg-white/[0.08] backdrop-blur-2xl border border-white/15 hover:border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_24px_rgba(255,255,255,0.1),inset_0_1px_0_0_rgba(255,255,255,0.25)] flex items-center justify-between transition-all duration-200">
        {/* Brand / Logo */}
        <a
          href="/"
          className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full px-2 py-1 select-none shrink-0 cursor-pointer transition-all duration-150"
          aria-label="BetaDigest Home"
        >
          <div className="relative w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] shrink-0" aria-hidden="true">
            <Image
              src="/logo-mark.png"
              alt="BetaDigest Logo"
              width={30}
              height={30}
              priority
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <span
            className="font-display font-[600] text-[18px] sm:text-[20px] leading-none text-[#ededed] group-hover:text-white transition-colors tracking-tight"
          >
            BetaDigest
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 text-[14px] text-[#c2c2c2]">
          <Link
            href="/#features"
            className="px-3.5 py-1.5 rounded-full border border-transparent hover:border-white hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] transition-all duration-150"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="px-3.5 py-1.5 rounded-full border border-transparent hover:border-white hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] transition-all duration-150"
          >
            How It Works
          </Link>
          <Link
            href="/#faq"
            className="px-3.5 py-1.5 rounded-full border border-transparent hover:border-white hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] transition-all duration-150"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-[13px] sm:text-[14px] font-medium text-[#c2c2c2] hover:text-white px-3.5 py-1.5 rounded-full border border-transparent hover:border-white hover:bg-white/[0.08] hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] transition-all duration-150"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center text-[12px] sm:text-[14px] font-medium text-white bg-white/[0.08] backdrop-blur-xl border border-white hover:bg-white hover:text-black hover:border-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 active:scale-[0.98] select-none whitespace-nowrap cursor-pointer"
          >
            <span>Get your Beta Digest</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-full border border-transparent hover:border-white hover:bg-white/[0.08] text-[#c2c2c2] hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
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
        <div className="pointer-events-auto md:hidden w-full max-w-[980px] mt-2 p-4 rounded-[24px] bg-[#141418]/90 hover:bg-white/[0.08] backdrop-blur-2xl border border-white/15 hover:border-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.12)] flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150 transition-all">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-transparent hover:border-white hover:bg-white/[0.08] text-[15px] font-medium text-[#ededed] hover:text-white transition-all"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-transparent hover:border-white hover:bg-white/[0.08] text-[15px] font-medium text-[#ededed] hover:text-white transition-all"
          >
            How It Works
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-transparent hover:border-white hover:bg-white/[0.08] text-[15px] font-medium text-[#ededed] hover:text-white transition-all"
          >
            FAQ
          </Link>
          <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] font-medium text-[#c2c2c2] hover:text-white px-3 py-1.5 rounded-xl border border-transparent hover:border-white hover:bg-white/[0.08] transition-all"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
