import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "outline";
  size?: "default" | "cta" | "sm";
  showArrow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      showArrow,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Disabled button spec: bg #858585, text white, cursor not-allowed
    if (disabled) {
      return (
        <button
          ref={ref}
          disabled
          aria-disabled="true"
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] rounded-full select-none cursor-not-allowed whitespace-nowrap min-w-max",
            "bg-[#858585] text-white",
            size === "cta"
              ? "h-[76px] px-8 text-[20px]"
              : size === "sm"
              ? "h-[44px] px-6 text-[15px]"
              : "h-[57px] px-8 text-[18px]",
            className
          )}
          {...props}
        >
          {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {(rightIcon || showArrow) && (
            <span className="ml-2 shrink-0">
              {rightIcon || <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />}
            </span>
          )}
        </button>
      );
    }

    if (variant === "outline") {
      // OutlineButton (Back): height 58px, padding 0 28px, bg white, 1px solid #000, text black, ArrowLeft 16px leading
      return (
        <button
          ref={ref}
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] text-[18px] text-black bg-white border border-black rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
            "h-[58px] px-[28px] gap-2 active:scale-[0.98] transition-transform duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
            className
          )}
          {...props}
        >
          {leftIcon !== undefined ? (
            leftIcon
          ) : (
            <ArrowLeft className="w-[16px] h-[16px] text-black shrink-0" aria-hidden="true" />
          )}
          <span>{children}</span>
          {rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
        </button>
      );
    }

    if (variant === "dark") {
      // DarkButton: same size (57px, px 32px, text 18px), bg #000, text white. Hover #222.
      // Landing CTA size: 76px high, 312px wide min, 20px text.
      const isCta = size === "cta";
      const hasArrow = showArrow ?? true;

      return (
        <button
          ref={ref}
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] text-white bg-black hover:bg-[#222222] rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
            "active:scale-[0.98] transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
            isCta
              ? "h-[76px] px-8 text-[20px]"
              : size === "sm"
              ? "h-[44px] px-6 text-[15px]"
              : "h-[57px] px-[32px] text-[18px]",
            className
          )}
          {...props}
        >
          {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {hasArrow && (
            <span className="ml-2 shrink-0">
              {rightIcon || <ArrowRight className="w-[18px] h-[18px] text-white" aria-hidden="true" />}
            </span>
          )}
        </button>
      );
    }

    // PrimaryButton (lime): bg --lime, text black, height 57px, padding 0 32px, radius full, Inter 500 18px, trailing ArrowRight icon 18px with 8px gap. Hover bg --lime-hover. Active scale .98. Focus-visible: 2px solid black ring, 2px offset.
    // Landing CTA size: 76px high, 312px wide min, 20px text
    const isCta = size === "cta";
    const hasArrow = showArrow ?? true;

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-sans font-[500] text-black rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
          "active:scale-[0.98] transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
          isCta
            ? "h-[76px] px-8 text-[20px]"
            : size === "sm"
            ? "h-[44px] px-6 text-[15px]"
            : "h-[57px] px-[32px] text-[18px]",
          className
        )}
        style={{
          backgroundColor: "var(--lime)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--lime-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--lime)";
        }}
        {...props}
      >
        {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {hasArrow && (
          <span className="ml-2 shrink-0">
            {rightIcon || <ArrowRight className="w-[18px] h-[18px] text-black" aria-hidden="true" />}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export const PrimaryButton = Button;

export const DarkButton: React.FC<ButtonProps> = (props) => (
  <Button variant="dark" {...props} />
);

export const OutlineButton: React.FC<ButtonProps> = (props) => (
  <Button variant="outline" {...props} />
);
