// src/pages/Events/EventsEmptyState.jsx
//
// EVENTS EMPTY STATE
// ------------------
// This component displays when no events match the current search/filter.
// It shows a friendly informational message without any action buttons.
//
// LAYOUT:
// - Desktop: Two-column layout
//     * Left column:  Icon + Title + Message (no buttons)
//     * Right column: robot.png illustration
// - Mobile: Single column, stacked
//     * Top:    robot.png (centered, prominent)
//     * Bottom: Icon + Title + Message (centered)
//
// DESIGN NOTES:
// - Background has a soft secondary tint (using --color-secondary at low opacity)
// - Icon uses --color-secondary (#2f3e4e) for a calm, neutral feel
// - Title uses --color-secondary (#2f3e4e) for readability
// - NO action buttons (no "Clear search", no "View all events")
// - This is purely informational with text and robot illustration
//
// PROPS:
// - searchQuery: string (optional)
//     The current search term. Can be used for context, but the message
//     displayed is always the same: "We couldn't find any events matching your search."
//
// THEME:
// - --color-accent:    #7a1e1e (not used prominently here)
// - --color-primary:   #faf7f2 (page background)
// - --color-secondary: #2f3e4e (icon, title text, background tint)

import React from "react";

// Import the robot illustration
// NOTE: Adjust this path based on your actual asset location
import robotImage from "../../assets/robot.png";

const EventsEmptyState = ({ searchQuery }) => {
  return (
    // =================================================================
    // OUTER CONTAINER
    // =================================================================
    // - Centered panel with max width
    // - Soft secondary-tinted background (neutral, calm feel)
    // - Rounded corners and subtle shadow for card-like appearance
    // - Generous padding for breathing room
    <div
      className="
        mx-auto
        max-w-4xl
        rounded-2xl
        bg-[rgba(47,62,78,0.04)]
        shadow-sm
        border
        border-[rgba(47,62,78,0.08)]
        overflow-hidden
      "
    >
      {/* ===============================================================
          INNER LAYOUT WRAPPER
          ===============================================================
          - Mobile:  flex-col (stacked vertically)
          - Desktop: flex-row (two columns side by side)
          - Items centered for proper alignment */}
      <div
        className="
          flex
          flex-col
          md:flex-row
          items-center
        "
      >
        {/* =============================================================
            RIGHT COLUMN (Robot Illustration)
            =============================================================
            - On mobile: appears FIRST (top) due to flex order
            - On desktop: appears on the RIGHT side
            - Contains robot.png centered with padding
            - Robot looks "searching" or "idle" (same image, different context) */}
        <div
          className="
            w-full
            md:w-1/2
            flex
            items-center
            justify-center
            p-6
            sm:p-8
            md:p-10
            order-1
            md:order-2
          "
        >
          {/* Robot image container with subtle circular background */}
          <div
            className="
              relative
              flex
              items-center
              justify-center
            "
          >
            {/* Soft circular gradient behind the robot for depth */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-[rgba(47,62,78,0.06)]
                to-transparent
                rounded-full
                scale-110
              "
              aria-hidden="true"
            />

            {/* Robot illustration */}
            <img
              src={robotImage}
              alt="Robot illustration indicating no events were found"
              className="
                relative
                w-40
                h-40
                sm:w-48
                sm:h-48
                md:w-56
                md:h-56
                lg:w-64
                lg:h-64
                object-contain
                drop-shadow-md
              "
            />
          </div>
        </div>

        {/* =============================================================
            LEFT COLUMN (Text Content - No Buttons)
            =============================================================
            - On mobile: appears SECOND (below robot) due to flex order
            - On desktop: appears on the LEFT side
            - Contains: Icon, Title, Message
            - NO action buttons in empty state
            - Mobile: center-aligned text
            - Desktop: left-aligned text */}
        <div
          className="
            w-full
            md:w-1/2
            flex
            flex-col
            items-center
            md:items-start
            text-center
            md:text-left
            p-6
            sm:p-8
            md:p-10
            lg:p-12
            order-2
            md:order-1
          "
        >
          {/* ---------------------------------------------------------
              EMPTY STATE ICON
              ---------------------------------------------------------
              - Circular badge with search/magnifier icon
              - Background: pale secondary tint (neutral, calm)
              - Icon color: --color-secondary (#2f3e4e) */}
          <div
            className="
              flex
              items-center
              justify-center
              w-14
              h-14
              sm:w-16
              sm:h-16
              rounded-full
              bg-[rgba(47,62,78,0.1)]
              mb-4
              sm:mb-5
            "
          >
            {/* Search/Magnifier Icon with question or empty indication */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="
                w-7
                h-7
                sm:w-8
                sm:h-8
                text-[var(--color-secondary)]
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Magnifying glass circle */}
              <circle cx="11" cy="11" r="8" />
              {/* Magnifying glass handle */}
              <path d="m21 21-4.3-4.3" />
              {/* X mark inside to indicate "not found" */}
              <path d="m8 8 6 6" />
              <path d="m14 8-6 6" />
            </svg>
          </div>

          {/* ---------------------------------------------------------
              TITLE
              ---------------------------------------------------------
              - Text: "No events found"
              - Bold, medium-large size
              - Color: --color-secondary (#2f3e4e)
              - Softer tone than error title */}
          <h2
            className="
              text-xl
              sm:text-2xl
              lg:text-3xl
              font-bold
              text-[var(--color-secondary)]
              mb-2
              sm:mb-3
            "
          >
            No events found
          </h2>

          {/* ---------------------------------------------------------
              BODY MESSAGE
              ---------------------------------------------------------
              - Text: "We couldn't find any events matching your search."
              - Softer color than title (slate-600)
              - 1-2 lines max for clarity
              - No action buttons below this text */}
          <p
            className="
              text-sm
              sm:text-base
              text-slate-600
              max-w-xs
              sm:max-w-sm
            "
          >
            We couldn't find any events matching your search.
          </p>

          {/* ---------------------------------------------------------
              NO BUTTONS / ACTIONS
              ---------------------------------------------------------
              As per requirements:
              - No "Clear search" button
              - No "View all events" link
              - This state is purely informational
              - The robot illustration fills the visual space instead */}
        </div>
      </div>
    </div>
  );
};

export default EventsEmptyState;