import React from "react";

export interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  topicName?: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  topicName,
}) => {
  const percent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full max-w-[672px] mx-auto mb-8">
      {/* 8px-high track (--track, radius full), lime fill */}
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--track)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            backgroundColor: "var(--lime)",
          }}
        />
      </div>

      {/* Row: topic name left and n/total right */}
      <div className="flex items-center justify-between mt-2 select-none">
        <span className="font-sans font-[400] text-[12px] text-[var(--text-muted-sm)]">
          {topicName || "Review"}
        </span>
        <span className="font-sans font-[700] text-[12px] text-[var(--text-muted-sm)] tabular-nums">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  );
};
