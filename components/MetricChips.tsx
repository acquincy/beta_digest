"use client";

import React from "react";
import { clsx } from "clsx";
import { AVAILABLE_METRICS, MetricKey } from "@/lib/types";
import { Chip } from "./primitives/Chip";

export interface MetricChipsProps {
  activeMetrics: MetricKey[];
  onChange: (metrics: MetricKey[]) => void;
  className?: string;
  label?: string;
}

export const MetricChips: React.FC<MetricChipsProps> = ({
  activeMetrics,
  onChange,
  className,
  label = "Select metrics to include in your preview",
}) => {
  const activeSet = new Set(activeMetrics);

  const toggleMetric = (key: MetricKey) => {
    if (activeSet.has(key)) {
      if (activeMetrics.length > 1) {
        onChange(activeMetrics.filter((m) => m !== key));
      }
    } else {
      onChange([...activeMetrics, key]);
    }
  };

  return (
    <div className={clsx("flex flex-col gap-2.5", className)}>
      {label && (
        <span className="font-sans font-[600] text-[13px] text-[var(--text-muted-sm)]">
          {label}
        </span>
      )}
      <div
        role="group"
        aria-label="Digest weather metric filters"
        className="flex flex-wrap gap-2 pt-1"
      >
        {AVAILABLE_METRICS.map((metric) => {
          const isActive = activeSet.has(metric.key);
          return (
            <Chip
              key={metric.key}
              active={isActive}
              onToggle={() => toggleMetric(metric.key)}
            >
              {metric.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};
