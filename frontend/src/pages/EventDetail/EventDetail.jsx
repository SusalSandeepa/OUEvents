// src/pages/EventDetail/EventDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CountdownBadge2 from "./CountdownBadge2";

// --- Helpers ---------------------------------------------------------

const formatDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (isoString) => {
  if (!isoString) return "-";

  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrganizerInitials = (name) => {
  if (!name || typeof name !== "string") return "?";

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    const word = parts[0];
    if (word.length === 1) return word[0].toUpperCase();
    return (word[0] + word[word.length - 1]).toUpperCase();
  }

  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
};

// --- Main Page Component --------------------------------------------

const EventDetail = () => {
  const { id } = useParams(); // /events/:id
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true; // to avoid setting state if unmounted

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        // Adjust this URL to match  backend.
        // If you have a baseURL configured in axios, just use `/events/${id}`.
        const res = await axios.get(`/api/events/${id}`);

        // Adjust this depending on  API response shape:
        //  - If your backend returns { data: { ...event } }, use res.data.data
        //  - If it returns { ...event }, use res.data
        const data = res.data?.data || res.data;

        if (!isMounted) return;

        if (!data) {
          setLoadError("Event not found.");
          setEvent(null);
        } else {
          // Map backend fields to frontend expectations
          const mappedEvent = {
            ...data,
            _id: data.eventID || data._id,
            imageUrl: data.image || data.imageUrl,
            venue: data.location || data.venue,
            startDateTime: data.eventDateTime || data.startDateTime,
            targetDateTime: data.eventDateTime || data.targetDateTime,
            organizerName: data.organizer || data.organizerName,
          };
          setEvent(mappedEvent);
        }
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setLoadError("Unable to load event details.");
        setEvent(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBackToEvents = () => {
    navigate("/events");
  };

  const handleRegisterClick = () => {
    // Navigate to EventRegistration page for this event
    navigate(`/events/${id}/register`);
  };

  const pageBgClass =
    "bg-[var(--color-page-bg,#faf7f2)] text-[var(--color-text,#111827)]";

  return (
    <div className={`min-h-screen flex flex-col ${pageBgClass}`}>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBackToEvents}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--color-accent,#7a1d1a)] mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Events
          </button>

          {/* Loading / Error / Content */}
          {loading ? (
            <div className="bg-white rounded-3xl shadow-md p-8 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading event details…</p>
            </div>
          ) : loadError || !event ? (
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <p className="text-gray-800 font-semibold mb-2">
                {loadError || "Event not found"}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                The event you are looking for may have been removed or does not
                exist.
              </p>
              <button
                type="button"
                onClick={handleBackToEvents}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-accent,#7a1d1a)] text-white hover:bg-[#5e1512] transition-colors"
              >
                Go to Events
              </button>
            </div>
          ) : (
            <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Banner Image */}
              <div className="relative h-56 md:h-80 w-full overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-10">
                {/* Title + optional category text */}
                <div className="mb-6 md:mb-8">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                    {event.title}
                  </h1>
                  {event.category && (
                    <p className="mt-2 text-sm text-gray-500">
                      {event.category}
                    </p>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-10 pb-8 border-b border-gray-100">
                  {/* Date */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 bg-[var(--color-page-bg,#faf7f2)] rounded-2xl flex items-center justify-center text-[var(--color-accent,#7a1d1a)] shrink-0">
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
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">
                        Date
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {formatDate(event.startDateTime)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 bg-[var(--color-page-bg,#faf7f2)] rounded-2xl flex items-center justify-center text-[var(--color-accent,#7a1d1a)] shrink-0">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">
                        Time
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {formatTime(event.startDateTime)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 bg-[var(--color-page-bg,#faf7f2)] rounded-2xl flex items-center justify-center text-[var(--color-accent,#7a1d1a)] shrink-0">
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
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">
                        Location
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {event.venue}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 bg-[var(--color-page-bg,#faf7f2)] rounded-2xl flex items-center justify-center text-[var(--color-accent,#7a1d1a)] shrink-0">
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
                        <path d="M20.59 13.41 11 4H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z" />
                        <circle cx="7.5" cy="7.5" r="1.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">
                        Category
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {event.category || "General"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Countdown Section with semi-transparent background */}
                <section
                  className="relative mb-8 md:mb-10 rounded-3xl px-4 py-6 md:px-8 md:py-8 text-center overflow-hidden"
                  style={{ backgroundColor: "rgba(47, 62, 78, 0.94)" }} // dark with opacity
                >
                  <h3 className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-white/60 mb-4 md:mb-6">
                    Time Remaining
                  </h3>
                  <CountdownBadge2 targetDateTime={event.startDateTime} />
                </section>

                {/* About Section */}
                <section className="mb-8 md:mb-10">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                    About the Event
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {event.description ||
                      "Details for this event will be updated soon."}
                  </p>
                </section>

                {/* Organizer Strip (no Contact button) */}
                <section className="flex items-center justify-between p-4 md:p-6 bg-[var(--color-page-bg,#faf7f2)] rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: "var(--color-accent,#7a1d1a)" }}
                    >
                      {getOrganizerInitials(
                        event.organizerName || event.organizedBy
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        Organized by
                      </p>
                      <p className="text-sm md:text-base text-gray-900 font-semibold">
                        {event.organizerName ||
                          event.organizedBy ||
                          "Event Organizer"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Register Button */}
                <section className="mt-8 md:mt-10">
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="w-full bg-[var(--color-accent,#7a1d1a)] hover:bg-[#5e1512] text-white py-4 md:py-5 rounded-2xl font-semibold text-base md:text-lg shadow-lg shadow-red-900/20 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Register Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <p className="text-center text-gray-400 text-xs mt-3">
                    <span className="inline-flex items-center justify-center mr-1 align-middle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </span>
                    Registration is free for all university students.
                  </p>
                </section>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetail;