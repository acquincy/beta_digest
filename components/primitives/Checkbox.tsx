import React from "react";
import { clsx } from "clsx";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  ariaLabel?: string;
  id?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className,
  ariaLabel,
  id,
  disabled = false,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
      className={clsx(
        "w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0 cursor-pointer select-none",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        backgroundColor: checked ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
        border: checked ? "1.5px solid #ffffff" : "1.5px solid rgba(255, 255, 255, 0.25)",
      }}
    >
      {checked && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};
