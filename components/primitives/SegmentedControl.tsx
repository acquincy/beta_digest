import React from "react";
import { clsx } from "clsx";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  name?: string;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  name = "segmented-control",
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel || name}
      className={clsx(
        "inline-flex p-1 bg-[var(--chip-off)] rounded-full border border-[var(--line)] gap-1",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={clsx(
              "inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-sans font-medium rounded-full transition-all duration-150 cursor-pointer select-none min-h-[36px]",
              isSelected
                ? "bg-[var(--lime)] text-black font-semibold shadow-sm"
                : "text-[var(--text-muted-sm)] hover:text-black bg-transparent"
            )}
          >
            {opt.icon && <span className="w-4 h-4 flex items-center justify-center">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
