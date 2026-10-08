export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formatted: string;
}

/**
 * Returns formatted 12-hour string for an hour 0-23.
 * e.g. 0 -> "12:00 AM", 7 -> "7:00 AM", 12 -> "12:00 PM", 23 -> "11:00 PM"
 */
export function formatHourOption(hour: number): string {
  const normalized = Math.max(0, Math.min(23, Math.floor(hour)));
  const period = normalized >= 12 ? "PM" : "AM";
  const displayHour = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${displayHour}:00 ${period}`;
}

export const HOURLY_OPTIONS: { value: number; label: string }[] = Array.from(
  { length: 24 },
  (_, i) => ({
    value: i,
    label: formatHourOption(i),
  })
);

/**
 * Calculates time remaining until the next scheduled dispatch in a given timezone.
 * Pure and deterministic: accepts an optional `now` timestamp for testability.
 */
export function getTimeUntilNextDispatch(
  targetTime: string | number = 7,
  timeZone: string = "UTC",
  now: Date = new Date()
): TimeRemaining {
  let targetH = 7;
  let targetM = 0;

  if (typeof targetTime === "number") {
    targetH = Math.max(0, Math.min(23, targetTime));
    targetM = 0;
  } else if (typeof targetTime === "string") {
    const parts = targetTime.split(":");
    targetH = parseInt(parts[0], 10) || 0;
    targetM = parseInt(parts[1], 10) || 0;
  }

  // Safely extract current date/time parts in the destination timezone
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  } catch {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  }

  const parts = formatter.formatToParts(now);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = parseInt(part.value, 10);
    }
  }

  const curHour = (map.hour === 24 ? 0 : map.hour) || 0;
  const curMinute = map.minute || 0;
  const curSecond = map.second || 0;

  const currentSecondsInDay = curHour * 3600 + curMinute * 60 + curSecond;
  const targetSecondsInDay = targetH * 3600 + targetM * 60;

  let deltaSeconds: number;
  if (currentSecondsInDay < targetSecondsInDay) {
    // Dispatch is later today
    deltaSeconds = targetSecondsInDay - currentSecondsInDay;
  } else {
    // Dispatch is tomorrow
    deltaSeconds = 86400 - currentSecondsInDay + targetSecondsInDay;
  }

  const hours = Math.floor(deltaSeconds / 3600);
  const minutes = Math.floor((deltaSeconds % 3600) / 60);
  const seconds = deltaSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds: deltaSeconds,
    formatted,
  };
}

/**
 * Returns a human-friendly label for current local time in timezone.
 */
export function formatCurrentTimeInZone(timeZone: string, now: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
  } catch {
    return "06:00";
  }
}
