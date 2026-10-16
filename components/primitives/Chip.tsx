import React from "react";
import { clsx } from "clsx";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onToggle?: () => void;
  size?: "onboarding" | "landing";
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onToggle,
  size = "onboarding",
  className,
  children,
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
    onToggle?.();
  };

  const isLanding = size === "landing";

  return (
    <button
      type="button"
      role="button"
      aria-pressed={active}
      aria-disabled={disabled ? true : undefined}
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-sans select-none transition-all duration-150 whitespace-nowrap",
        isLanding
          ? "h-[38px] px-[16px] text-[14px]"
          : "h-[34px] px-[14px] text-[13px]",
        active
          ? "bg-white text-black font-medium border border-white shadow-[0_2px_10px_rgba(255,255,255,0.15)]"
          : "bg-[#1c1c1c] text-[#c2c2c2] border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/[0.06]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0a0a]",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
