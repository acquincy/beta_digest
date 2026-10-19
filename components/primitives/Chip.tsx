import React from "react";
import { clsx } from "clsx";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onToggle?: () => void;
  onLockedClick?: () => void;
  size?: "onboarding" | "landing";
  shaking?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onToggle,
  onLockedClick,
  size = "onboarding",
  shaking = false,
  className,
  children,
  onClick,
  onKeyDown,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (disabled) {
      e.preventDefault();
      onLockedClick?.();
      return;
    }
    onToggle?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.key === " " || e.key === "Enter") {
      if (disabled) {
        e.preventDefault();
        onLockedClick?.();
      }
    }
  };

  const isLanding = size === "landing";

  return (
    <button
      type="button"
      role="button"
      aria-pressed={active}
      aria-disabled={disabled ? true : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-sans select-none whitespace-nowrap transition-all duration-150 ease-out",
        isLanding
          ? "h-[38px] px-[16px] text-[14px]"
          : "h-[36px] px-[14px] text-[13px] md:text-[14px]",
        // Selected vs Unselected vs Locked styling
        active
          ? "bg-white text-black font-semibold border border-white shadow-[0_0_16px_rgba(255,255,255,0.22)] hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.32)] hover:-translate-y-[1px] active:scale-[0.97] cursor-pointer"
          : disabled
          ? "opacity-55 cursor-not-allowed border border-white/10 text-white/70 bg-white/[0.02] shadow-none hover:translate-y-0"
          : "bg-white/[0.04] text-white/90 border border-white/15 backdrop-blur-md hover:border-white/30 hover:bg-white/[0.08] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)] active:scale-[0.97] cursor-pointer",
        // Focus state
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a7cfb] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141418]",
        // Shake animation on locked tap
        shaking && "animate-chip-shake",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
