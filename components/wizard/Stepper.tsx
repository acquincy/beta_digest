import React from "react";
import { Check } from "lucide-react";

export interface StepperProps {
  currentStep: 1 | 2;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  // 4-dot Stepper centered: 32px circles joined by 40px x 2px connectors with 8px side margins
  // Active dot: bg #000, white 14px/700 number
  // Upcoming: bg --track, number #9A9A9A 14px/700
  // Completed: bg --lime with a black Check 14px, and the connector after it is --lime
  const steps = [1, 2, 3, 4];

  return (
    <div
      role="region"
      aria-label="Progress Stepper"
      className="flex items-center justify-center mb-8 select-none"
    >
      {steps.map((s, index) => {
        const isCompleted = s < currentStep;
        const isActive = s === currentStep;

        return (
          <React.Fragment key={s}>
            {/* Dot circle: 32px */}
            <div
              aria-current={isActive ? "step" : undefined}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-[700] text-[14px] transition-colors ${
                isCompleted
                  ? "bg-[var(--lime)] text-black"
                  : isActive
                  ? "bg-black text-white"
                  : "bg-[var(--track)] text-[#9A9A9A]"
              }`}
            >
              {isCompleted ? (
                <Check className="w-[14px] h-[14px] text-black stroke-[3]" aria-hidden="true" />
              ) : (
                s
              )}
            </div>

            {/* Connector line: 40px x 2px with 8px side margins */}
            {index < steps.length - 1 && (
              <div
                className="w-10 h-[2px] mx-2 transition-colors"
                style={{
                  backgroundColor:
                    s < currentStep ? "var(--lime)" : "var(--track)",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
