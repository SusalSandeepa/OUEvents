// src/components/EventCard/CountdownBadge1.jsx

import React, { memo } from "react";
import { useCountdown } from "../../hooks/useCountdown"; // path from components/EventCard

/**
 * Decide the display label based on countdown units.
 *
 * Rules:
 * - If target is invalid/missing → all units 0 and isPast=false → show "N/A".
 * - If isPast=true → "Started".
 * - Else, show highest non-zero unit in the order:
 *   Years, Months, Weeks, Days, Hours, Minutes, Seconds.
 */
const buildLabel = ({
  years,
  months,
  weeks,
  days,
  hours,
  minutes,
  seconds,
  isPast,
}) => {
  // Invalid / unknown date → treat as N/A
  const allZero =
    years === 0 &&
    months === 0 &&
    weeks === 0 &&
    days === 0 &&
    hours === 0 &&
    minutes === 0 &&
    seconds === 0;

  if (allZero && !isPast) {
    return "N/A";
  }

  if (isPast) {
    return "Started";
  }

  if (years > 0) {
    return `${years} ${years === 1 ? "Year" : "Years"}`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? "Month" : "Months"}`;
  }
  if (weeks > 0) {
    return `${weeks} ${weeks === 1 ? "Week" : "Weeks"}`;
  }
  if (days > 0) {
    return `${days} ${days === 1 ? "Day" : "Days"}`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
  }
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "Minute" : "Minutes"}`;
  }
  if (seconds > 0) {
    return `${seconds} ${seconds === 1 ? "Second" : "Seconds"}`;
  }

  // Fallback
  return "Started";
};

/**
 * CountdownBadge1
 *
 * Props:
 * - targetDateTime: ISO string / Date / timestamp (event startDateTime)
 */
const CountdownBadge1 = ({ targetDateTime }) => {
  const countdown = useCountdown(targetDateTime);
  const label = buildLabel(countdown);

  return (
    <div
      className="
        w-24 sm:w-28 lg:w-32
        h-8 sm:h-10 lg:h-11
        px-2 sm:px-3 lg:px-4
        rounded-full
        shadow-md sm:shadow-lg
        flex items-center justify-center
        text-[10px] sm:text-xs lg:text-sm
        font-medium sm:font-semibold
        text-white
      "
      style={{ backgroundColor: "#7a1e1e" }} // accent color
    >
      <span className="truncate">{label}</span>
    </div>
  );
};

export default memo(CountdownBadge1);