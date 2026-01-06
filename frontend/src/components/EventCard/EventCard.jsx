// src/components/EventCard/EventCard.jsx
//
// SCAFFOLD VERSION (no countdown yet, no View button).
// This assumes:
//
// - You have or will have:
//   - TimeTickerProvider at a high level (e.g., in App.jsx).
//   - useCountdown hook using the global ticker.
//   - CountdownBadge1 component in this folder.
// - Parent pages (Home, EventDigest) will:
//   - Fetch events from backend.
//   - Filter out expired events using now >= endDateTime.
//   - Pass a well-formed `event` object to this card.
//
// TODO (future steps):
// 1) Implement and import CountdownBadge1, then overlay it on the image
//    using startDateTime as the target.
// 2) Confirm the event detail route (e.g. `/events/:id` or `/event/:id`)
//    and update handleNavigate route path if needed.
// 3) Optionally move date formatting into a shared utility
//    (e.g., src/utils/dateHelpers.js).
// 4) Fine-tune Tailwind styles to match your exact design system.

import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
// FUTURE: import CountdownBadge1 once implemented
// import CountdownBadge1 from "./CountdownBadge1";

// Simple date formatter; consider centralizing later(TEMP: basic date formatting; consider moving to src/utils/dateHelpers.js later)
const formatEventDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

/**
 * EventCard
 *
 * Expected event shape:
 * - event: {
 *     _id: string,
 *     title: string,
 *     imageUrl: string,
 *     startDateTime: string (ISO),  // main date used here
 *     endDateTime?: string (ISO),   // used in parent filtering, not here
 *     venue: string,
 *   }
 *
 * Responsibilities:
 * - Display image, title, date, venue.
 * - Entire card is clickable (navigates to event details).
 * - No internal logic for removing/hiding on expiry; parent does that via filtering.
 */
const EventCard = ({ event }) => {
  const navigate = useNavigate();

  if (!event) return null;

  const {
    _id,
    title,
    imageUrl,
    startDateTime,
    venue,
  } = event;

  // Guard: ensure required fields exist
  if (!_id || !title || !imageUrl || !startDateTime || !venue) {
    // Optional: console.warn here during development if you want to detect bad data.
    return null;
  }

  const formattedDate = formatEventDate(startDateTime);

  const handleNavigate = useCallback(() => {
    // TODO: adjust this path to match your routing config if needed.
    navigate(`/events/${_id}`);
  }, [_id, navigate]);

  return (
    <div
      onClick={handleNavigate}
      className="
        cursor-pointer
        bg-white rounded-lg sm:rounded-xl
        shadow-md sm:shadow-lg
        overflow-hidden
        transition-all duration-300
        hover:shadow-xl sm:hover:shadow-2xl 
        hover:-translate-y-1 
        hover:scale-[1.02] sm:hover:scale-[1.03]
        active:scale-95 active:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        w-full
      "
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNavigate();
        }
      }}
    >
      {/* Image / Header Area */}
      <div className="relative h-36 sm:h-40 lg:h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* 
          TODO (future):
          - Once CountdownBadge1 is implemented, uncomment and use:

          <div className="absolute bottom-0 right-4 translate-y-1/2">
            <CountdownBadge1 targetDateTime={startDateTime} />
          </div>
        */}
      </div>

      {/* Content Area */}
      <div className="p-3 pt-6 sm:p-4 sm:pt-8 flex flex-col gap-1.5 sm:gap-2">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
          {title}
        </h3>

        {/* Date */}
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          {/* Calendar icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <span>{formattedDate}</span>
        </div>

        {/* Venue */}
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          {/* Location icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{venue}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(EventCard);