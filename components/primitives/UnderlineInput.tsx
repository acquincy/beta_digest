import React, { useId } from "react";
import { clsx } from "clsx";

export interface UnderlineInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  height?: number | string;
}

export const UnderlineInput = React.forwardRef<HTMLInputElement, UnderlineInputProps>(
  (
    {
      label,
      error,
      rightElement,
      height = 48,
      className,
      id,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans font-[700] text-[20px] text-black mb-1 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            onBlur={onBlur}
            className={clsx(
              "w-full bg-transparent rounded-none font-sans font-[400] text-[18px] text-black placeholder-[#BDBDBD]",
              "border-0 border-b-[1.5px] border-black p-0 outline-none focus:outline-none focus:ring-0 focus:border-b-[2px] focus:border-black",
              error && "!border-b-[2px] !border-[var(--error)] text-[var(--error)]",
              className
            )}
            style={{
              height: typeof height === "number" ? `${height}px` : height,
            }}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="mt-1 text-[13px] leading-tight font-sans"
            style={{ color: "var(--error)" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

UnderlineInput.displayName = "UnderlineInput";
