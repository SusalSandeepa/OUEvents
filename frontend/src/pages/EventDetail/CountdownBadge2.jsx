// src/pages/EventDetail/CountdownBadge2.jsx
//
// Detailed animated countdown for Event page.
// - Uses useCountdown(targetDateTime).
// - Shows up to 4 contiguous segments in descending power order:
//   [Years, Months, Weeks, Days, Hours, Min, Sec].
// - Window rule:
//   * Find a start unit S such that all upper units are 0 (Years is always allowed).
//   * From S, extend to the right (toward smaller units) to include up to 4 units.
//   * If near the end and we don't reach 4, prepend units on the left
//     (still contiguous) to get up to 4 total.
//   * 0 values inside the 4 boxes are allowed.
// - Wrapper: fade-in + move-up animation.
// - Each box: fixed size, top colored moving line, number animation, reset pulse.

import React, { memo, useEffect, useState } from "react";
import { useCountdown } from "../../hooks/useCountdown";

const UNIT_ORDER = [
  { key: "years", label: "Years" },
  { key: "months", label: "Months" },
  { key: "weeks", label: "Weeks" },
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

/**
 * CountdownNumberBox
 *
 * One unit box: fixed size, animated number.
 * Props:
 * - label: string
 * - value: number
 */
const CountdownNumberBox = memo(({ label, value }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [animating, setAnimating] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setAnimating(true);

      if (value === 0) {
        setResetAnimation(true);
      }

      // Keep duration in sync with .animate-number-change / .animate-reset-pulse
      const timeout = setTimeout(() => {
        setAnimating(false);
        setResetAnimation(false);
        setPrevValue(value);
      }, 350);

      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  const numberAnimationClass = animating ? "animate-number-change" : "";
  const resetClass = resetAnimation ? "animate-reset-pulse" : "";

  return (
    <div className="relative flex flex-col items-center mx-1.5 sm:mx-2 md:mx-3 mb-3 sm:mb-0">
      {/* Box */}
      <div
        className={`
          relative
          w-14 h-14
          sm:w-16 sm:h-16
          md:w-20 md:h-20
          lg:w-24 lg:h-24
          rounded-xl
          flex items-center justify-center
          overflow-hidden
          shadow-md sm:shadow-lg
          ${resetClass}
        `}
        style={{
          backgroundColor: "var(--color-secondary)",
          color: "var(--color-primary)",
        }}
      >
        {/* Slow moving colored line at top (#FF3366-ish), bright in the middle */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div
            className="w-full h-full animate-line-slow"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, #FF3366 50%, transparent 100%)",
            }}
          />
        </div>

        {/* Animated number wrapper */}
        <div
          className={`
            relative
            flex flex-col items-center justify-center
            ${numberAnimationClass}
          `}
        >
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-none">
            {value}
          </span>
        </div>
      </div>

      {/* Label */}
      <span
        className="
          mt-1.5 sm:mt-2
          text-[10px] sm:text-xs md:text-sm
          uppercase tracking-wide
        "
        style={{ color: "rgba(255, 255, 255, 0.6)" }}
      >
        {label}
      </span>
    </div>
  );
});

const CountdownBadge2 = ({ targetDateTime }) => {
  const countdown = useCountdown(targetDateTime);

  const {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  } = countdown;

  const valuesByKey = {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };

  // Build units array with current values
  const units = UNIT_ORDER.map(({ key, label }) => ({
    key,
    label,
    value: valuesByKey[key],
  }));

  // Helper: check if all units "above" index i are zero.
  // For Years (i === 0), this is always true.
  const allUpperZero = (i) => {
    if (i === 0) return true;
    for (let j = 0; j < i; j += 1) {
      if (units[j].value !== 0) return false;
    }
    return true;
  };

  // 1) Find startIndex:
  //    We want the highest-power unit where all upper units are 0,
  //    and we prefer one that is non-zero if possible.
  let startIndex = 0;
  let foundNonZeroStart = false;

  // First pass: find the first non-zero from the top that satisfies allUpperZero
  for (let i = 0; i < units.length; i += 1) {
    if (!allUpperZero(i)) continue;
    if (units[i].value > 0) {
      startIndex = i;
      foundNonZeroStart = true;
      break;
    }
  }

  // Second pass (fallback): if no such non-zero, pick the last index where allUpperZero is true.
  if (!foundNonZeroStart) {
    for (let i = units.length - 1; i >= 0; i -= 1) {
      if (allUpperZero(i)) {
        startIndex = i;
        break;
      }
    }
  }

  // 2) Build a window to the right starting from startIndex.
  //    Target width = 4 units (if possible).
  const targetWidth = 4;
  const lastIndex = units.length - 1;

  let rightEnd = Math.min(lastIndex, startIndex + (targetWidth - 1));
  let displayUnits = units.slice(startIndex, rightEnd + 1);

  // 3) If we still have fewer than 4 units, prepend units on the left
  //    while keeping them contiguous in descending power.
  if (displayUnits.length < targetWidth) {
    let remaining = targetWidth - displayUnits.length;
    let leftIndex = startIndex - 1;

    while (remaining > 0 && leftIndex >= 0) {
      displayUnits.unshift(units[leftIndex]);
      leftIndex -= 1;
      remaining -= 1;
    }
  }

  return (
    <div
      className="
        flex justify-center items-center
        mb-8 sm:mb-10 md:mb-12
        opacity-0 translate-y-5
        animate-countdown-fade-in
      "
    >
      <div
        className="
          flex flex-wrap
          items-center justify-center
          max-w-[320px] sm:max-w-none
        "
      >
        {displayUnits.map((unit) => (
          <CountdownNumberBox
            key={unit.key}
            label={unit.label}
            value={unit.value}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(CountdownBadge2);