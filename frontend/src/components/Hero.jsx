import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import heroImage from "../assets/heroimage2.jpeg";
import EventCard from "./EventCard/EventCard";
import { useTimeTicker } from "../context/TimeTickerContext";

const EVENTS_API_URL = "/api/events";
const MAX_UPCOMING_EVENTS = 4;

const Hero = () => {
  const { now } = useTimeTicker();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch events from backend
  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await axios.get(EVENTS_API_URL, {
          signal: controller.signal,
        });

        const data = res.data;
        const roughEvents = Array.isArray(data) ? data : data.events || [];

        // Map backend fields to frontend expectations
        const mappedEvents = roughEvents.map((evt) => ({
          ...evt,
          _id: evt.eventID || evt._id,
          imageUrl: evt.image || evt.imageUrl,
          venue: evt.location || evt.venue,
          startDateTime: evt.eventDateTime || evt.startDateTime,
          targetDateTime: evt.eventDateTime || evt.targetDateTime,
        }));

        if (!isSubscribed) return;
        setEvents(mappedEvents);
      } catch (err) {
        if (!isSubscribed) return;
        if (axios.isCancel?.(err)) return;
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
  }, []);

  // Filter and sort upcoming events
  const upcomingEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    // Filter for future events only
    const futureEvents = events.filter((event) => {
      const rawTarget = event?.targetDateTime;
      if (!rawTarget) return false;

      const target = new Date(rawTarget);
      if (Number.isNaN(target.getTime())) return false;

      return target >= now;
    });

    // Sort by date (earliest first)
    futureEvents.sort((a, b) => {
      const aTime = a.targetDateTime ? new Date(a.targetDateTime).getTime() : 0;
      const bTime = b.targetDateTime ? new Date(b.targetDateTime).getTime() : 0;
      return aTime - bTime;
    });

    // Return only the first N events
    return futureEvents.slice(0, MAX_UPCOMING_EVENTS);
  }, [events, now]);

  // Loading skeleton for event cards
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="overflow-hidden border border-gray-200 shadow-lg bg-white rounded-xl animate-pulse"
        >
          <div className="h-36 sm:h-40 lg:h-48 bg-gray-200"></div>
          <div className="p-3 pt-6 sm:p-4 sm:pt-8">
            <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state when no events
  const EmptyState = () => (
    <div className="text-center py-12">
      <p className="text-gray-600 text-lg">No upcoming events at the moment.</p>
      <p className="text-gray-500 mt-2">Check back soon for new events!</p>
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="text-center py-12">
      <p className="text-red-600 text-lg">Failed to load events.</p>
      <p className="text-gray-500 mt-2">Please try again later.</p>
    </div>
  );

  return (
    <section className="w-full">
      {/* HERO TOP (2-column only) */}
      <div className="grid items-center grid-cols-1 gap-12 px-8 my-12 md:grid-cols-2">
        {/* Text */}
        <div>
          <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl text-[#2f3e4e]">
            Discover & Join <span className="text-[#7a1d1a]">OUSL Events</span>
          </h1>

          <p className="mt-4 text-lg tracking-wide text-gray-600">
            Your central hub for all workshops, seminars, and activities
            happening at the Open University of Sri Lanka. Browse, register, and
            stay updated.
          </p>

          <Link
            to="/events"
            className="tracking-wide inline-flex items-center px-6 py-3 mt-8 font-medium text-white transition-all rounded-lg shadow-md bg-[#7a1d1a] hover:bg-[#641519] transition-colors duration-300"
          >
            Browse Events →
          </Link>
        </div>

        {/* Image */}
        <div className="items-center justify-center hidden bg-white border-2 border-gray-300 rounded-lg md:flex h-96">
          <img
            src={heroImage}
            alt="OUEvents Hero"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="w-full px-8 mt-20 mb-24">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#2f3e4e]">
              Upcoming Events
            </h2>
            <p className="mt-2 text-slate-600">
              Handpicked opportunities starting soon
            </p>
          </div>
          <Link
            to="/events"
            className="text-[#7a1d1a] hover:text-[#641519] font-medium transition-colors duration-300"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <ErrorState />
        ) : upcomingEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingEvents.map((event) => {
              const key = event._id || event.id || JSON.stringify(event);
              return <EventCard key={key} event={event} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
