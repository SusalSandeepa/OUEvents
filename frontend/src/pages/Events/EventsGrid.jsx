// src/pages/Events/EventsGrid.jsx
//
// EVENTS GRID
// -----------
// This component is responsible ONLY for laying out the EventCard components
// in a responsive grid. It does NOT:
// - Fetch data
// - Filter by time
// - Search or sort
// - Handle pagination
//
// All of that logic lives in Event.jsx. This grid simply receives a list of
// already-filtered and paginated events via props and renders them.
//
// DESIGN:
// - Mobile:   1 column
// - Small:    2 columns
// - Large+:   3 or more columns (here we use 3 to keep cards readable)
// - No extra side illustration when events are available (by your request).
//
// PROPS:
// - events: Array of event objects, each expected to at least have:
//     - _id: string
//     - title, imageUrl, targetDateTime, venue, etc. (used by EventCard)

import React from "react";
import EventCard from "../../components/EventCard/EventCard";

const EventsGrid = ({ events }) => {
  // Guard: if events is missing or empty, render nothing here.
  // Note: Event.jsx already shows EventsEmptyState when totalItems === 0,
  // so this is just a safety check.
  if (!events || events.length === 0) {
    return null;
  }

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
      {events.map((event) => {
        // Prefer a stable unique key; usually _id from the backend.
        const key = event._id || event.id || JSON.stringify(event);

        return <EventCard key={key} event={event} />;
      })}
    </div>
  );
};

export default EventsGrid;