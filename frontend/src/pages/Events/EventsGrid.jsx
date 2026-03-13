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