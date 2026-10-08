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
        "inline-flex items-center justify-center rounded-full font-sans font-[400] text-black select-none transition-all duration-150 whitespace-nowrap",
        isLanding
          ? "h-[36px] px-[14px] text-[14px]"
          : "h-[32px] px-[13px] text-[13px]",
        active
          ? "border border-transparent font-medium"
          : "border border-transparent hover:border-[#555555] focus-visible:border-[#555555]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1",
        disabled ? "opacity-45 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      style={{
        backgroundColor: active ? "var(--lime)" : "var(--chip-off)",
      }}
      {...props}
    >
      {children}
    </button>
  );
};
