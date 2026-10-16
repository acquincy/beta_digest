import React from "react";
import { clsx } from "clsx";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  id,
}) => {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={clsx("flex items-center justify-between gap-4", className)}>
      {(label || description) && (
        <label
          htmlFor={toggleId}
          className={clsx(
            "flex flex-col cursor-pointer select-none font-sans",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label && <span className="font-[500] text-[#ededed] text-sm sm:text-base">{label}</span>}
          {description && (
            <span className="text-xs sm:text-sm text-[#8E9096]">{description}</span>
          )}
        </label>
      )}
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-white" : "bg-[#222222] border border-white/10"
        )}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        <span
          className={clsx(
            "pointer-events-none inline-block h-6 w-6 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5 bg-black" : "translate-x-0 bg-[#888888]"
          )}
        />
      </button>
    </div>
  );
};
