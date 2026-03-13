

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


const diffFromNowToTarget = (now, target) => {
  const targetDate = toValidDate(target);
  const nowDate = toValidDate(now);

  
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

export const useCountdown = (targetDateTime) => {
  const { now } = useTimeTicker();

  return diffFromNowToTarget(now, targetDateTime);
};