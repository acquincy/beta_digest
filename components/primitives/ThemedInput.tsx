import React, { useId } from "react";
import { clsx } from "clsx";

export interface ThemedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  height?: number | string;
  variant?: "rounded" | "underline";
  containerClassName?: string;
}

/**
 * ThemedInput
 * Accessible dark-glass themed text input matching the BetaDigest design tokens
 * and the city/country dropdowns.
 * Features:
 * - Rounded corners (rounded-xl) matching modal and selects
 * - Translucent dark background with subtle border
 * - Soft brand accent glow on focus-visible (no sharp white outline)
 * - Themed placeholder, error, disabled, and autofill states
 */
export const ThemedInput = React.forwardRef<HTMLInputElement, ThemedInputProps>(
  (
    {
      label,
      error,
      rightElement,
      height = 46,
      variant = "rounded",
      className,
      containerClassName,
      id,
      disabled,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    const isUnderline = variant === "underline";

    return (
      <div className={clsx("w-full flex flex-col", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block font-sans font-[500] text-[14px] text-[#ededed] mb-1.5 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            onBlur={onBlur}
            className={clsx(
              "w-full font-sans transition-all duration-200 outline-none text-[#ededed] placeholder:text-white/40 placeholder:font-normal",
              isUnderline
                ? "bg-transparent rounded-none border-0 border-b-[1.5px] border-white/20 p-0 text-[18px] focus:outline-none focus:ring-0 focus:border-b-[2px] focus:border-white"
                : "themed-input h-[46px] rounded-xl bg-[#202020]/90 hover:bg-[#252525] border border-white/10 hover:border-white/20 px-4 text-[14px] md:text-[15px] font-medium disabled:opacity-50 disabled:cursor-not-allowed",
              error &&
                (isUnderline
                  ? "!border-b-[2px] !border-[var(--error)] text-[var(--error)]"
                  : "themed-input-error !border-[var(--error)] focus:!border-[var(--error)]"),
              className
            )}
            style={{
              height:
                typeof height === "number"
                  ? `${height}px`
                  : height || undefined,
            }}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="mt-1.5 text-[13px] leading-tight font-sans"
            style={{ color: "var(--error, #E64D51)" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

ThemedInput.displayName = "ThemedInput";
export const TextInput = ThemedInput;
export const UnderlineInput = ThemedInput;
