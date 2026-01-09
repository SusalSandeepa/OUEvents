// src/pages/Events/EventsLoadingGrid.jsx
//
// EVENTS LOADING GRID
// -------------------
// This component shows a skeleton/grid placeholder while events are loading.
// It is purely presentational and does NOT:
// - Fetch data
// - Manage any state
//
// DESIGN GOAL:
// - Visually mimic the EventCard layout so the page doesn't "jump" when
//   real data loads.
// - Use a pulsing animation (animate-pulse) so users see it is loading.
// - Responsive grid:
//     * Mobile: 1 column
//     * Small:  2 columns
//     * Large+: 3 columns
//
// PROPS (optional):
// - count: number
//     How many placeholder cards to render. Default: 8.

import React from "react";

const EventsLoadingGrid = ({ count = 8 }) => {
  const placeholders = Array.from({ length: count });

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
    >
      {placeholders.map((_, index) => (
        <div
          key={index}
          className="
            bg-white
            rounded-lg sm:rounded-xl
            shadow-md sm:shadow-lg
            overflow-hidden
            animate-pulse
          "
        >
          {/* Image area skeleton (matches EventCard image height) */}
          <div className="h-36 sm:h-40 lg:h-48 bg-slate-200" />

          {/* Content area skeleton */}
          <div className="p-3 pt-6 sm:p-4 sm:pt-8 space-y-3">
            {/* Title line */}
            <div className="h-4 sm:h-5 bg-slate-200 rounded w-3/4" />

            {/* Date line */}
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-slate-200" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>

            {/* Venue line */}
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-slate-200" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsLoadingGrid;