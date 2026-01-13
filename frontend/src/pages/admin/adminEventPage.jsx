import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function AdminEventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "api/events"
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-secondary font-semibold">
          Event Management
        </h2>
        <Link
          to="/admin/events/create"
          className="text-white font-medium text-base bg-accent px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          Create Event
        </Link>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No events found. Create your first event!
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Image
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Event ID
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Date & Time
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.eventID}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {event.eventID}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-secondary">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(event.eventDateTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate("/admin/events/update", { state: event })
                        } // state is used to identify the event to be updated
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <LuPencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
