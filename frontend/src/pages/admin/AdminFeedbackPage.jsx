import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchFeedback();
    fetchEvents();
  }, []);

  const fetchFeedback = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}api/feedback`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFeedback(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}api/events`);
      const eventMap = {};
      (res.data || []).forEach((event) => {
        eventMap[event.eventID] = event.title;
      });
      setEvents(eventMap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Feedback deleted successfully");
      setFeedback((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete feedback");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${
              index <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ))}
      </div>
    );
  };

  // Get unique event IDs for filter dropdown
  const uniqueEventIds = [...new Set(feedback.map((f) => f.eventID))];

  // Filter feedback
  const filteredFeedback = filter
    ? feedback.filter((f) => f.eventID === filter)
    : feedback;

  // Calculate stats
  const totalFeedback = feedback.length;
  const avgRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Feedback Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage user feedback for all events
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
          <p className="text-blue-600 text-sm font-medium mb-1">
            Total Feedback
          </p>
          <p className="text-3xl font-bold text-blue-900">{totalFeedback}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5">
          <p className="text-yellow-600 text-sm font-medium mb-1">
            Average Rating
          </p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-yellow-900">{avgRating}</p>
            <span className="text-yellow-400">★</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5">
          <p className="text-green-600 text-sm font-medium mb-1">
            Events with Feedback
          </p>
          <p className="text-3xl font-bold text-green-900">
            {uniqueEventIds.length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label
          htmlFor="event-filter"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Filter by Event
        </label>
        <select
          id="event-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        >
          <option value="">All Events</option>
          {uniqueEventIds.map((eventId) => (
            <option key={eventId} value={eventId}>
              {events[eventId] || eventId}
            </option>
          ))}
        </select>
      </div>

      {/* Feedback Table */}
      {filteredFeedback.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-gray-500">No feedback found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFeedback.map((fb) => (
                  <tr
                    key={fb._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                        {events[fb.eventID] || fb.eventID}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-[150px]">
                        {fb.userEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">{renderStars(fb.rating)}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {fb.comment || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {formatDate(fb.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(fb._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
