// src/pages/Events/EventsErrorState.jsx
//
// EVENTS ERROR STATE
// ------------------
// This component displays when the events fetch fails.
// It shows a friendly error message with a retry option.
//
// LAYOUT:
// - Desktop: Two-column layout
//     * Left column:  Icon + Title + Message + Retry button
//     * Right column: robot.png illustration
// - Mobile: Single column, stacked
//     * Top:    robot.png (centered, prominent)
//     * Bottom: Icon + Title + Message + Retry button (centered)
//
// DESIGN NOTES:
// - Background has a soft maroon tint (using --color-accent at low opacity)
// - Icon uses --color-accent (#7a1e1e) for the error indication
// - Title uses --color-secondary (#2f3e4e) for readability
// - No secondary links or additional actions (just the Retry button)
//
// PROPS:
// - onRetry: () => void
//     Callback function triggered when user clicks the "Retry" button.
//     This should re-fetch the events from the backend.
//
// THEME:
// - --color-accent:    #7a1e1e (error icon, retry button background)
// - --color-primary:   #faf7f2 (page background)
// - --color-secondary: #2f3e4e (title text)

import React from "react";

// Import the robot illustration
// NOTE: Adjust this path based on your actual asset location
import robotImage from "../../assets/robot.png";

const EventsErrorState = ({ onRetry }) => {
  return (
    // =================================================================
    // OUTER CONTAINER
    // =================================================================
    // - Centered panel with max width
    // - Soft maroon-tinted background to indicate error state
    // - Rounded corners and subtle shadow for card-like appearance
    // - Generous padding for breathing room
    <div
      className="
        mx-auto
        max-w-4xl
        rounded-2xl
        bg-[rgba(122,30,30,0.04)]
        shadow-sm
        border
        border-[rgba(122,30,30,0.08)]
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
            - Soft background shape behind robot for visual separation */}
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
                from-[rgba(122,30,30,0.06)]
                to-transparent
                rounded-full
                scale-110
              "
              aria-hidden="true"
            />

            {/* Robot illustration */}
            <img
              src={robotImage}
              alt="Robot illustration indicating an error occurred"
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
            LEFT COLUMN (Text Content + Retry Button)
            =============================================================
            - On mobile: appears SECOND (below robot) due to flex order
            - On desktop: appears on the LEFT side
            - Contains: Icon, Title, Message, Retry button
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
              ERROR ICON
              ---------------------------------------------------------
              - Circular badge with alert/warning icon
              - Background: pale maroon tint
              - Icon color: --color-accent (#7a1e1e) */}
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
              bg-[rgba(122,30,30,0.1)]
              mb-4
              sm:mb-5
            "
          >
            {/* Alert Triangle Icon (Lucide-style) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="
                w-7
                h-7
                sm:w-8
                sm:h-8
                text-[var(--color-accent)]
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Triangle shape */}
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              {/* Exclamation mark */}
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          {/* ---------------------------------------------------------
              TITLE
              ---------------------------------------------------------
              - Text: "Unable to load events"
              - Bold, medium-large size
              - Color: --color-secondary (#2f3e4e) */}
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
            Unable to load events
          </h2>

          {/* ---------------------------------------------------------
              BODY MESSAGE
              ---------------------------------------------------------
              - Text: "Please check your connection and try again."
              - Softer color than title (slate-600)
              - 1-2 lines max for clarity */}
          <p
            className="
              text-sm
              sm:text-base
              text-slate-600
              max-w-xs
              sm:max-w-sm
              mb-6
              sm:mb-8
            "
          >
            Please check your connection and try again.
          </p>

          {/* ---------------------------------------------------------
              RETRY BUTTON
              ---------------------------------------------------------
              - Triggers onRetry callback to re-fetch events
              - Background: --color-accent (#7a1e1e)
              - Text: white
              - Rounded with hover effect
              - Wide enough for easy thumb tapping on mobile */}
          <button
            type="button"
            onClick={onRetry}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-6
              sm:px-8
              py-2.5
              sm:py-3
              bg-[var(--color-accent)]
              text-white
              text-sm
              sm:text-base
              font-semibold
              rounded-lg
              shadow-md
              transition-all
              duration-200
              hover:bg-[#691919]
              hover:shadow-lg
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--color-accent)]
              focus:ring-offset-2
              active:scale-[0.98]
            "
          >
            {/* Refresh/Retry Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsErrorState;