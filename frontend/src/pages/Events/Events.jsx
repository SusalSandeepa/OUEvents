// src/pages/Events/Events.jsx
//
// EVENTS PAGE CONTAINER
// ---------------------
// This component is the main container for the /events route.
//
// It is responsible for:
// - Fetching events from the backend once (with retry).
// - Getting the global current time (`now`) from TimeTickerContext.
// - Filtering out expired events using `targetDateTime` (UTC):
//     * Only keep events where targetDateTime >= now.
//     * When the event's time is over, its card disappears automatically.
// - Applying search (by title / venue / description).
// - Applying sorting (A–Z by title OR by start time using targetDateTime).
// - Handling pagination.
// - Deciding which visual state to show:
//     * <EventsLoadingGrid />   while loading
//     * <EventsErrorState />    if fetch fails
//     * <EventsEmptyState />    if no events match current filters
//     * <EventsGrid /> + <EventsPagination /> when events exist
//
// IMPORTANT:
// - Navbar and Footer are NOT included here; they should be rendered
//   by the parent layout (e.g., HomePage).
// - This file assumes the following components already exist:
//     - EventsToolbar
//     - EventsGrid
//     - EventsPagination
//     - EventsLoadingGrid
//     - EventsErrorState
//     - EventsEmptyState
// - It also assumes TimeTickerProvider wraps this page higher in the tree,
//   so useTimeTicker() can be used safely.
//
// THEME:
// - Uses global CSS variables:
//     --color-accent:    #7a1e1e
//     --color-primary:   #faf7f2
//     --color-secondary: #2f3e4e

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

import { useTimeTicker } from "../../context/TimeTickerContext";

import EventsToolbar from "./EventsToolbar";
import EventsGrid from "./EventsGrid";
import EventsPagination from "./EventsPagination";
import EventsLoadingGrid from "./EventsLoadingGrid";
import EventsErrorState from "./EventsErrorState";
import EventsEmptyState from "./EventsEmptyState";

// TODO: Update this URL to match your actual backend route.
const EVENTS_API_URL = "/api/events";

// Number of events per page
const PAGE_SIZE = 8;

// Sorting keys used in this page
const SORT_BY = {
  TITLE: "title",
  START_TIME: "targetDateTime",
};

const Events = () => {
  // Global current time, updated every second by TimeTickerProvider
  const { now } = useTimeTicker();

  // Raw events fetched from the backend
  const [events, setEvents] = useState([]);

  // Loading and error flags for the fetch
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // UI state: search, sort, pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(SORT_BY.START_TIME);
  const [currentPage, setCurrentPage] = useState(1);

  // Token to re-trigger fetch when user taps "Retry"
  const [reloadToken, setReloadToken] = useState(0);

  // === Fetch events from backend (on mount + when reloadToken changes) ===
  //
  // This version uses axios instead of fetch:
  // - axios.get(EVENTS_API_URL) → { data, status, ... }
  // - Still supports abort via AbortController (axios v1+).
  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Axios request with abort signal
        const res = await axios.get(EVENTS_API_URL, {
          signal: controller.signal,
        });

        const data = res.data;

        // Allow both API shapes:
        //  - Bare array: [ {...}, {...} ]
        //  - Wrapped:   { events: [ {...}, {...} ] }
        const fetchedEvents = Array.isArray(data) ? data : data.events || [];

        if (!isSubscribed) return;

        setEvents(fetchedEvents);
      } catch (err) {
        // Ignore abort-related cancellation errors
        if (!isSubscribed) return;
        if (axios.isCancel?.(err)) return; // Handles both old and new Axios
        if (err.name === "CanceledError") return;
        console.error("Error fetching events:", err);
        setIsError(true);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [reloadToken]);

  // === 1) Time-based filtering using only targetDateTime (UTC) ===
  //
  // Keep only events whose targetDateTime is in the future or now:
  //   targetDateTime >= now
  //
  // If targetDateTime is missing or invalid, we choose to drop that event
  // to avoid showing broken data.
  const upcomingEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    return events.filter((event) => {
      const rawTarget = event?.targetDateTime;
      if (!rawTarget) return false;

      const target = new Date(rawTarget);
      if (Number.isNaN(target.getTime())) return false;

      // Keep only events where targetDateTime is still in the future
      return target >= now;
    });
  }, [events, now]);

  // === 2) Search filter (by title / venue / description) ===
  const searchedEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return upcomingEvents;

    return upcomingEvents.filter((event) => {
      const title = (event.title || "").toLowerCase();
      const venue = (event.venue || "").toLowerCase();
      const description = (event.description || "").toLowerCase();

      return (
        title.includes(q) ||
        venue.includes(q) ||
        description.includes(q)
      );
    });
  }, [searchQuery, upcomingEvents]);

  // === 3) Sorting (A–Z by title OR by start time using targetDateTime) ===
  const sortedEvents = useMemo(() => {
    const eventsCopy = [...searchedEvents];

    if (sortBy === SORT_BY.TITLE) {
      eventsCopy.sort((a, b) => {
        const aTitle = (a.title || "").toLowerCase();
        const bTitle = (b.title || "").toLowerCase();
        return aTitle.localeCompare(bTitle);
      });
    } else if (sortBy === SORT_BY.START_TIME) {
      eventsCopy.sort((a, b) => {
        const aTime = a.targetDateTime
          ? new Date(a.targetDateTime).getTime()
          : 0;
        const bTime = b.targetDateTime
          ? new Date(b.targetDateTime).getTime()
          : 0;
        return aTime - bTime;
      });
    }

    return eventsCopy;
  }, [searchedEvents, sortBy]);

  // === 4) Pagination ===
  const totalItems = sortedEvents.length;
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / PAGE_SIZE);

  // Ensure currentPage is always within valid range when list size changes
  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev < 1) return 1;
      if (prev > totalPages) return totalPages;
      return prev;
    });
  }, [totalPages]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sortedEvents.slice(startIndex, endIndex);
  }, [sortedEvents, currentPage]);

  // === Handlers passed to child components ===

  // Search input change (from EventsToolbar)
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1); // reset to first page when search changes
  }, []);

  // Sort dropdown change (from EventsToolbar)
  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    setCurrentPage(1); // reset to first page when sort changes
  }, []);

  // Retry button (from EventsErrorState)
  const handleRetry = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  // Page change (from EventsPagination)
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // === RENDER ===
  // This content is meant to be wrapped by a parent layout that already
  // includes <Navbar /> and <Footer />.

  return (
    <section className="relative bg-[var(--color-primary)] py-8 sm:py-10 lg:py-12">
      {/* Subtle gradient at the top for depth */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32
                   bg-gradient-to-b from-[rgba(122,30,30,0.06)] to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-secondary)]">
            All Events
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600">
            Explore enriching opportunities across our vibrant academic community
          </p>
        </header>

        {/* Toolbar (search + order-by) */}
        {/* Expected props:
           - searchQuery: string
           - onSearchChange(value: string): void
           - sortBy: one of SORT_BY.TITLE / SORT_BY.START_TIME
           - onSortChange(value: string): void
        */}
        <EventsToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Main content: loading / error / empty / grid + pagination */}
        <div className="mt-8 sm:mt-10 lg:mt-12">
          {isLoading ? (
            // 1) Loading: skeleton grid (keeps layout stable)
            <EventsLoadingGrid />
          ) : isError ? (
            // 2) Error: two-column panel with message + Retry + robot illustration
            <EventsErrorState onRetry={handleRetry} />
          ) : totalItems === 0 ? (
            // 3) Empty: two-column panel with "No events found" + message + robot
            <EventsEmptyState searchQuery={searchQuery} />
          ) : (
            // 4) Normal: grid of upcoming events + pagination
            <>
              {/* Events grid receives the already filtered & paginated list */}
              <EventsGrid events={paginatedEvents} />

              {/* Pagination is shown only if there is more than one page */}
              {totalPages > 1 && (
                <div className="mt-8 sm:mt-10">
                  {/* Expected props:
                     - currentPage: number
                     - totalPages: number
                     - onPageChange(page: number): void
                  */}
                  <EventsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;