// src/pages/Events/EventsPagination.jsx
//
// EVENTS PAGINATION (ELLIPSIS VERSION)
// ------------------------------------
// This component renders the pagination controls at the bottom of the Events
// grid. Compared to the simple version, this one:
// - Shows all pages when totalPages is small.
// - Uses "..." ellipsis when totalPages is large, so the UI does not overflow.
//
// EXAMPLES:
// - totalPages = 5:
//     1  2  3  4  5
//
// - totalPages = 20, currentPage = 2:
//     Prev  1  2  3  4  5  ...  20  Next
//
// - totalPages = 20, currentPage = 10:
//     Prev  1  ...  9  10  11  ...  20  Next
//
// - totalPages = 20, currentPage = 19:
//     Prev  1  ...  16  17  18  19  20  Next
//
// PROPS:
// - currentPage: number (1-based index of the current page).
// - totalPages: number (>= 1).
// - onPageChange: (page: number) => void
//     Called when user clicks a page or prev/next.
//
// NOTE:
// - Purely presentational + callbacks; all logic for loading the correct page
//   lives in Event.jsx.

import React from "react";

// Helper to build a compact page list with ellipsis markers
// Returns an array of tokens where each token is either:
// - a number (page index), or
// - the string "ellipsis"
const buildPageItems = (currentPage, totalPages) => {
  const items = [];

  if (totalPages <= 7) {
    // Small number of pages: show all of them
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }

  const firstPage = 1;
  const lastPage = totalPages;

  const showLeftRange = currentPage <= 4;
  const showRightRange = currentPage >= totalPages - 3;

  if (showLeftRange) {
    // Near the beginning: 1 2 3 4 5 ... last
    items.push(1, 2, 3, 4, 5, "ellipsis", lastPage);
    return items;
  }

  if (showRightRange) {
    // Near the end: 1 ... last-4 last-3 last-2 last-1 last
    items.push(
      firstPage,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      lastPage
    );
    return items;
  }

  // In the middle: 1 ... current-1 current current+1 ... last
  items.push(
    firstPage,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    lastPage
  );

  return items;
};

const EventsPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const goPrev = () => goToPage(currentPage - 1);
  const goNext = () => goToPage(currentPage + 1);

  const items = buildPageItems(currentPage, totalPages);

  return (
    <nav
      className="flex justify-center"
      aria-label="Events pagination"
    >
      <div
        className="
          inline-flex items-center gap-1.5 sm:gap-2
          bg-white
          rounded-full
          shadow-sm
          px-2 py-1
        "
      >
        {/* PREVIOUS BUTTON */}
        <button
          type="button"
          onClick={goPrev}
          disabled={currentPage === 1}
          className={`
            inline-flex items-center justify-center
            rounded-full
            px-2 py-1
            text-xs sm:text-sm
            border border-transparent
            text-slate-500
            hover:bg-slate-100
            disabled:opacity-40
            disabled:hover:bg-transparent
          `}
        >
          <span className="sr-only">Previous page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* PAGE ITEMS (numbers + ellipsis) */}
        {items.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-xs sm:text-sm text-slate-400 select-none"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const page = item;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-current={isActive ? "page" : undefined}
              className={`
                inline-flex items-center justify-center
                rounded-full
                px-2.5 sm:px-3
                py-1
                text-xs sm:text-sm
                font-medium
                border
                transition
                ${
                  isActive
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        {/* NEXT BUTTON */}
        <button
          type="button"
          onClick={goNext}
          disabled={currentPage === totalPages}
          className={`
            inline-flex items-center justify-center
            rounded-full
            px-2 py-1
            text-xs sm:text-sm
            border border-transparent
            text-slate-500
            hover:bg-slate-100
            disabled:opacity-40
            disabled:hover:bg-transparent
          `}
        >
          <span className="sr-only">Next page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default EventsPagination;