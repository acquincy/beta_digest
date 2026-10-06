export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formatted: string;
}

/**
 * Calculates time remaining until the next scheduled dispatch in a given timezone.
 * Pure and deterministic: accepts an optional `now` timestamp for testability.
 */
export function getTimeUntilNextDispatch(
  targetTimeHHMM: string = "06:00",
  timeZone: string = "UTC",
  now: Date = new Date()
): TimeRemaining {
  const [targetH, targetM] = targetTimeHHMM
    .split(":")
    .map((v) => parseInt(v, 10) || 0);

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
