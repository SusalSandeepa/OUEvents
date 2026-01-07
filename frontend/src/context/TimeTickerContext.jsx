// src/context/TimeTickerContext.jsx
//
// GLOBAL TIME TICKER (SCAFFOLD)
//
// This file provides a single global "now" Date value that updates once per
// second. All countdown logic (via useCountdown) should depend on this, so
// you do NOT create individual setInterval timers in every component.
//
// HOW TO USE (when other pieces are ready):
// ----------------------------------------
// 1) Wrap your app (or at least all event-related routes) with
//    <TimeTickerProvider> in App.jsx or a layout component:
//
//    import { TimeTickerProvider } from "./context/TimeTickerContext";
//
//    function App() {
//      return (
//        <TimeTickerProvider>
//          <YourRouterOrLayout />
//        </TimeTickerProvider>
//      );
//    }
//
// 2) In countdown-related code (e.g., useCountdown hook), call:
//
//    import { useTimeTicker } from "../context/TimeTickerContext";
//
//    const { now } = useTimeTicker();
//
//    // Then compute differences between `now` and targetDateTime.
//
// FUTURE TASKS (TO-DO):
// ---------------------
// 1) Performance tuning:
//    - Currently, `now` is a new Date object every second. Components that
//      read `now` will re-render every second.
//    - For very large trees, consider:
//      * Deriving countdown values in a custom hook and memoizing.
//      * Potentially storing `now` as a timestamp (number) instead of Date
//        if that plays better with your calculations.
// 2) Configurable tick interval:
//    - If you ever want a different resolution (e.g., 500ms or lower),
//      make the interval duration configurable or constant-defined.
// 3) Server-side rendering (if you add SSR later):
//    - Ensure this provider behaves correctly when rendered on the server:
//      * Avoid using window-specific APIs in here.
// 4) Testing utilities:
//    - Optionally create a mock provider for tests that allows you to
//      manually set `now` rather than relying on a real interval.
// 5) Pause / resume control (advanced):
//    - If you ever want to pause countdown updates (e.g., when a modal
//      is open or the tab is hidden), you can expose pause/resume in context
//      and wire that up to visibility APIs.
//
// NOTE ABOUT OTHER FILES (NO CHANGES NEEDED YET):
// -----------------------------------------------
// - EventCard.jsx and CountdownBadge1.jsx do NOT directly depend on this
//   context yet. Only the future useCountdown hook will.
// - Once useCountdown.js is created and wired to this context, you will:
//   * Use useCountdown inside CountdownBadge1 and CountdownBadge2.
//   * Use the parent filtering rule (now >= endDateTime) in Home.jsx and
//     EventDigest.jsx by getting `now` from useTimeTicker() there.

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

const TimeTickerContext = createContext(null);

/**
 * TimeTickerProvider
 *
 * Provides:
 * - now: Date object, updated once per second.
 */
export const TimeTickerProvider = ({ children }) => {
  const [now, setNow] = useState(() => new Date());
  const intervalRef = useRef(null);

  useEffect(() => {
    // Set up a single global timer
    intervalRef.current = setInterval(() => {
      // Update to current time once every second
      setNow(new Date());
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const value = { now };

  return (
    <TimeTickerContext.Provider value={value}>
      {children}
    </TimeTickerContext.Provider>
  );
};

/**
 * useTimeTicker
 *
 * Hook to access the current global time.
 *
 * Returns:
 * - { now } where now is a Date instance updated every second.
 */
export const useTimeTicker = () => {
  const context = useContext(TimeTickerContext);
  if (!context) {
    // Helpful error if someone forgets to wrap with TimeTickerProvider
    throw new Error(
      "useTimeTicker must be used within a TimeTickerProvider"
    );
  }
  return context;
};