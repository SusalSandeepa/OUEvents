// MyEvents.jsx
// Shows user's registered events - upcoming and past
// Past events have option to add feedback

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  LuCalendar,
  LuMapPin,
  LuClock,
  LuStar,
  LuMessageSquare,
} from "react-icons/lu";

export default function MyEvents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "past"

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Fetch user's registered events
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login to view your events");
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_API_URL + "api/registrations/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching my events:", err);
        toast.error("Failed to load your events");
        setLoading(false);
      });
  }, [navigate]);

  // Get current time
  const now = new Date();

  // Split events into upcoming and past
  const upcomingEvents = events.filter((item) => {
    if (!item.event?.eventDateTime) return false;
    return new Date(item.event.eventDateTime) >= now;
  });

  const pastEvents = events.filter((item) => {
    if (!item.event?.eventDateTime) return false;
    return new Date(item.event.eventDateTime) < now;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open feedback modal
  const openFeedbackModal = (event) => {
    setFeedbackEvent(event);
    setRating(0);
    setComment("");
    setShowFeedbackModal(true);
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingFeedback(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "api/feedback",
        {
          eventID: feedbackEvent.eventID,
          rating: rating,
          comment: comment,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Feedback submitted successfully!");
      setShowFeedbackModal(false);

      // Mark this event as having feedback submitted
      setEvents((prev) =>
        prev.map((item) =>
          item.event?.eventID === feedbackEvent.eventID
            ? { ...item, feedbackSubmitted: true }
            : item,
        ),
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Event card component
  const EventCard = ({ item, isPast }) => {
    const event = item.event;
    if (!event) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Event Image */}
        <div className="h-40 bg-gray-100">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <LuCalendar size={48} />
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <LuCalendar size={14} className="text-[#7a1d1a]" />
              <span>{formatDate(event.eventDateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <LuClock size={14} className="text-[#7a1d1a]" />
              <span>{formatTime(event.eventDateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <LuMapPin size={14} className="text-[#7a1d1a]" />
              <span className="line-clamp-1">{event.location || "TBA"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Link
              to={`/events/${event.eventID}`}
              className="flex-1 text-center py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              View Details
            </Link>

            {isPast && !item.feedbackSubmitted && (
              <button
                onClick={() => openFeedbackModal(event)}
                className="flex items-center gap-1 py-2 px-3 bg-[#7a1d1a] text-white rounded-lg text-sm font-medium hover:bg-[#5a1515] transition"
              >
                <LuMessageSquare size={14} />
                Feedback
              </button>
            )}

            {isPast && item.feedbackSubmitted && (
              <span className="flex items-center gap-1 py-2 px-3 bg-green-100 text-green-700 rounded-lg text-sm">
                <LuStar size={14} />
                Submitted
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 px-4 min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto flex-1">
        {/* Page Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          My Events
        </h1>
        <p className="text-gray-600 mb-6">
          View events you have registered for
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition ${
              activeTab === "upcoming"
                ? "border-[#7a1d1a] text-[#7a1d1a]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition ${
              activeTab === "past"
                ? "border-[#7a1d1a] text-[#7a1d1a]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Past ({pastEvents.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : activeTab === "upcoming" ? (
          upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <LuCalendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No upcoming events</p>
              <Link
                to="/events"
                className="inline-block mt-4 text-[#7a1d1a] hover:underline"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((item) => (
                <EventCard
                  key={item._id}
                  item={item}
                  isPast={false}
                />
              ))}
            </div>
          )
        ) : pastEvents.length === 0 ? (
          <div className="text-center py-12">
            <LuCalendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No past events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((item) => (
              <EventCard
                key={item._id}
                item={item}
                isPast={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Rate Your Experience
            </h2>
            <p className="text-gray-600 text-sm mb-4">{feedbackEvent?.title}</p>

            {/* Star Rating */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-3xl transition hover:scale-110"
                >
                  {star <= rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience (optional)"
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7a1d1a]/20"
            />

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 py-2 px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback}
                className="flex-1 py-2 px-4 bg-[#7a1d1a] text-white rounded-lg hover:bg-[#5a1515] transition disabled:opacity-50"
              >
                {submittingFeedback ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
