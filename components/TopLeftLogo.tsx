"use client";

import React from "react";
import Image from "next/image";

export interface TopLeftLogoProps {
  className?: string;
  showText?: boolean;
}

export const TopLeftLogo: React.FC<TopLeftLogoProps> = ({
  className = "",
  showText = true,
}) => {
  return (
    <a
      href="/"
      aria-label="BetaDigest - Return to landing page"
      className={`inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full px-2 py-1 select-none transition-all duration-150 active:scale-95 cursor-pointer ${className}`}
    >
      <div
        className="relative w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] shrink-0"
        aria-hidden="true"
      >
        <Image
          src="/logo-mark.png"
          alt="BetaDigest Logo"
          width={32}
          height={32}
          priority
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {showText && (
        <span className="font-display font-[600] text-[18px] sm:text-[20px] leading-none text-[#ededed] group-hover:text-white transition-colors tracking-tight">
          BetaDigest
        </span>
      )}
    </a>
  );
};
