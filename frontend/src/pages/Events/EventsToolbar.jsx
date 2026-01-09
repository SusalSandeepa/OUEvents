// src/pages/Events/EventsToolbar.jsx
//
// EVENTS TOOLBAR
// --------------
// This component sits at the top of the Events page content and provides:
// - A search input (always visible, even when results are shown).
// - An "Order by" dropdown (A–Z by title OR by start time).
//
// RESPONSIBILITIES:
// - Purely presentational: it does NOT fetch data or filter events itself.
// - It only calls the callbacks given via props when the user types or changes sort.
// - Layout:
//   * Mobile: stacked vertically (search on top, sort below).
//   * Desktop: horizontal row (search left, sort right).
//
// PROPS:
// - searchQuery: string
//     Current value of the search term.
// - onSearchChange: (value: string) => void
//     Called whenever the search input changes.
// - sortBy: string
//     Current sort key. Expected values (aligned with Event.jsx):
//       "targetDateTime"  → Order by start time
//       "title"          → Order by title (A–Z)
// - onSortChange: (value: string) => void
//     Called whenever the sort option changes.
//
// THEME:
// - Uses global CSS variables:
//     --color-accent:    #7a1e1e
//     --color-primary:   #faf7f2
//     --color-secondary: #2f3e4e
//
// FIXES & OPTIMIZATIONS (v2):
// - Changed input type from "search" to "text" to remove native browser X button
// - This prevents the double X mark issue (native + custom clear button)
// - Added explicit cursor-pointer to clear button for better UX
// - Improved hover/focus states for better accessibility
// - Fixed nested div issue in sort dropdown wrapper

import React from "react";

const SORT_OPTIONS = [
  {
    value: "targetDateTime",
    label: "Start time (soonest first)",
  },
  {
    value: "title",
    label: "Title (A–Z)",
  },
];

const EventsToolbar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  // Handle change in the search text box
  const handleSearchInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  // Clear the current search text
  const handleClearSearch = () => {
    onSearchChange("");
  };

  // Handle change in the "Order by" dropdown
  const handleSortSelectChange = (e) => {
    onSortChange(e.target.value);
  };

  // Check if search has content (for showing clear button)
  const hasSearchContent = searchQuery.trim().length > 0;

  return (
    <div
      className="
        flex flex-col gap-4
        md:flex-row md:items-center md:gap-6
      "
    >
      {/* ===============================================================
          SEARCH INPUT
          ===============================================================
          - type="text" instead of "search" to prevent native browser X
          - Custom clear button appears only when there's text
          - Left icon (magnifying glass) is always visible */}
      <div className="relative flex-1">
        <input
          type="text"
          aria-label="Search events by title or keyword"
          placeholder="Search events by title or keyword..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="
            w-full
            rounded-lg
            border border-slate-300
            bg-white
            pl-11 pr-10
            py-2.5 sm:py-3
            text-sm sm:text-base
            text-slate-800
            placeholder:text-slate-400
            shadow-sm
            transition-all
            duration-200
            hover:border-slate-400
            focus:border-transparent
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--color-accent)]
          "
        />

        {/* Left search icon (always visible) */}
        <div
          className="
            pointer-events-none
            absolute inset-y-0 left-0
            flex items-center justify-center
            pl-3
            text-slate-400
          "
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>
        </div>

        {/* Right clear button (only when search has text) */}
        {hasSearchContent && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="
              absolute inset-y-0 right-0
              flex items-center justify-center
              pr-3
              cursor-pointer
              text-slate-400
              transition-colors
              duration-200
              hover:text-[var(--color-accent)]
              focus:outline-none
              focus:text-[var(--color-accent)]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ===============================================================
          SORT / ORDER-BY DROPDOWN
          ===============================================================
          - Fixed: removed unnecessary nested div
          - Custom chevron icon for consistent styling
          - Same hover/focus states as search input */}
      <div className="relative w-full md:w-56">
        <select
          aria-label="Order events"
          value={sortBy}
          onChange={handleSortSelectChange}
          className="
            w-full
            appearance-none
            cursor-pointer
            rounded-lg
            border border-slate-300
            bg-white
            py-2.5 sm:py-3
            pl-3 pr-10
            text-sm sm:text-base
            text-slate-800
            shadow-sm
            transition-all
            duration-200
            hover:border-slate-400
            focus:border-transparent
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--color-accent)]
          "
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown chevron icon */}
        <div
          className="
            pointer-events-none
            absolute inset-y-0 right-0
            flex items-center justify-center
            pr-3
            text-slate-400
          "
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EventsToolbar;