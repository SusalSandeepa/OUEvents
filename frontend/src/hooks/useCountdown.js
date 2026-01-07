// src/hooks/useCountdown.js
//
// SHARED COUNTDOWN HOOK
// ----------------------
// This hook centralizes all countdown logic for your app.
// It uses the global "now" from TimeTickerProvider and a targetDateTime
// (usually the event's startDateTime) to compute:
//
// - years, months, weeks, days, hours, minutes, seconds
// - isPast (true when now >= target)
//
// IMPORTANT:
// - This file does NOT create any timers itself.
//   It only reacts to changes in `now` from TimeTickerContext, which
//   already runs a single global timer.
//
// FUTURE TASKS / IMPROVEMENTS (OPTIONAL):
// --------------------------------------
// 1) Performance tuning:
//    - If countdown calculations become expensive with many components,
//      you can simplify or further optimize diffFromNowToTarget.
// 2) Calendar precision:
//    - Currently uses Date arithmetic (setFullYear/setMonth) so it respects
//      real month lengths and leap years.
// 3) Error handling in UI:
//    - This hook returns all zeros and isPast=false when the target is
//      invalid/missing. Badges can treat that as "N/A" instead of "Started".
// 4) Testing:
//    - Add unit tests with edge cases: leap years, month boundaries, etc.
// 5) Timezone handling:
//    - If events have specific timezones, normalize targetDateTime before
//      passing it into this hook.

import { useTimeTicker } from "../context/TimeTickerContext";

/**
 * Safely converts an input (Date | string | number) into a Date.
 * Returns null if invalid.
 */
const toValidDate = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Core difference calculation between now and target.
 *
 * Returns an object:
 * {
 *   years, months, weeks, days, hours, minutes, seconds,
 *   isPast
 * }
 *
 * NOTE:
 * - Uses Date arithmetic to handle leap years and month lengths.
 * - Strategy:
 *   1) If target <= now => everything 0, isPast=true.
 *   2) Otherwise:
 *      - Increment a cursor date year-by-year, month-by-month
 *        to compute calendar-accurate years & months.
 *      - Remaining difference is converted into days/hours/minutes/seconds.
 *      - weeks = Math.floor(days / 7), days = days % 7.
 */
const diffFromNowToTarget = (now, target) => {
  const targetDate = toValidDate(target);
  const nowDate = toValidDate(now);

  // If either is invalid, treat as "unknown", not "past".
  // - All units 0
  // - isPast = false
  // UI components (badges) can show "N/A" or similar.
  if (!targetDate || !nowDate) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
    };
  }

  // If target time is already passed
  if (targetDate <= nowDate) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    };
  }

  // Clone nowDate to avoid mutating it
  let cursor = new Date(nowDate.getTime());

  let years = 0;
  let months = 0;

  // Count full years
  // Move cursor forward year-by-year while the next year step is <= target
  while (true) {
    const nextYear = new Date(cursor.getTime());
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    if (nextYear <= targetDate) {
      years += 1;
      cursor = nextYear;
    } else {
      break;
    }
  }

  // Count full months
  while (true) {
    const nextMonth = new Date(cursor.getTime());
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth <= targetDate) {
      months += 1;
      cursor = nextMonth;
    } else {
      break;
    }
  }

  // Remaining diff in ms after subtracting full years & months
  const remainingMs = targetDate.getTime() - cursor.getTime();

  const totalSeconds = Math.floor(remainingMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  };
};

/**
 * useCountdown
 *
 * @param {Date|string|number} targetDateTime - Target datetime (usually event startDateTime).
 *
 * @returns {{
 *   years: number;
 *   months: number;
 *   weeks: number;
 *   days: number;
 *   hours: number;
 *   minutes: number;
 *   seconds: number;
 *   isPast: boolean;
 * }}
 *
 * Usage:
 * - CountdownBadge1 (EventCard):
 *   * Show only the largest non-zero unit, or "Started" when isPast is true.
 *   * If all units are 0 AND isPast is false → treat as "N/A".
 * - CountdownBadge2 (Event.jsx):
 *   * Build the multi-box display using all units.
 */
export const useCountdown = (targetDateTime) => {
  const { now } = useTimeTicker();

  // We simply compute on each render; TimeTicker updates `now` once per second,
  // so this function runs once per second per hook usage, which is fine for
  // typical event volumes.
  return diffFromNowToTarget(now, targetDateTime);
};