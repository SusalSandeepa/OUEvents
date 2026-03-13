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