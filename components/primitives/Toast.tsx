import React from "react";
import { clsx } from "clsx";

export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  visible: boolean;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  actionLabel,
  onAction,
  onClose,
  visible,
  className,
}) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "fixed bottom-6 right-6 z-50 flex items-center justify-between gap-4 px-5 py-3 rounded-full bg-black text-white shadow-lg border border-[rgba(255,255,255,0.15)] text-sm max-w-[90vw] sm:max-w-md transition-all duration-200 ease-out",
        className
      )}
    >
      <span className="font-sans font-medium text-xs sm:text-sm">{message}</span>
      <div className="flex items-center gap-2 shrink-0">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-black hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "var(--lime)" }}
          >
            {actionLabel}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="text-white/70 hover:text-white p-1 text-sm cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
