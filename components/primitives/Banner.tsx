import React from "react";
import { clsx } from "clsx";

export type BannerVariant = "action_required" | "attention" | "paused";

export interface BannerProps {
  variant: BannerVariant;
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  const labelText =
    variant === "action_required"
      ? "ACTION REQUIRED"
      : variant === "attention"
      ? "ATTENTION"
      : "PAUSED";

  return (
    <div
      role="alert"
      className={clsx(
        "w-full bg-black text-white rounded-[24px] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span
          className="font-sans font-[700] text-[12px] px-3 py-1 rounded-full uppercase shrink-0"
          style={{
            backgroundColor: "var(--lime)",
            color: "#000000",
          }}
        >
          {labelText}
        </span>
        <div className="flex flex-col">
          {title && <span className="font-semibold text-[15px] text-white">{title}</span>}
          <span className="font-sans font-[400] text-[15px] text-white leading-snug">
            {description}
          </span>
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="h-[38px] px-4 rounded-full bg-white hover:bg-[#E5E5E5] text-black font-sans font-[600] text-[13px] self-start sm:self-auto cursor-pointer transition-colors shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
