import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { LuSearch, LuX, LuRefreshCw, LuClipboardList } from "react-icons/lu";

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [regRes, eventRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + "api/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(import.meta.env.VITE_API_URL + "api/events", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRegistrations(regRes.data || []);

      // Build a map of eventID -> event title
      const eventMap = {};
      (eventRes.data || []).forEach((e) => {
        eventMap[e.eventID] = e.title;
      });
      setEvents(eventMap);
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    } finally {
      setLoading(false);
    }
  }

  // Get unique event IDs that actually have registrations, for the filter dropdown
  const registeredEventIds = useMemo(() => {
    return [...new Set(registrations.map((r) => r.eventID))];
  }, [registrations]);

  // Apply search and event filter
  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchesEvent = eventFilter ? r.eventID === eventFilter : true;
      const query = searchQuery.toLowerCase();
      const matchesSearch = query
        ? r.userEmail.toLowerCase().includes(query) ||
          r.regNo.toLowerCase().includes(query) ||
          (events[r.eventID] || r.eventID).toLowerCase().includes(query)
        : true;
      return matchesEvent && matchesSearch;
    });
  }, [registrations, searchQuery, eventFilter, events]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl text-secondary font-bold">
            Event Registrations
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            View all registrations across events.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LuRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, reg no, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <LuX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Event Filter */}
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white sm:min-w-[200px] cursor-pointer"
        >
          <option value="">All Events</option>
          {registeredEventIds.map((id) => (
            <option key={id} value={id}>
              {events[id] || id}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-3">
          Showing {filtered.length} of {registrations.length} registrations
        </p>
      )}

      {/* Table / States */}
      {loading ? (
        <div className="text-center py-14 text-gray-500">
          Loading registrations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <LuClipboardList className="w-12 h-12 mb-3 opacity-40" />
          <p>No registrations found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Event", "Email", "Reg No", "Year", "Faculty", "Date", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-sm font-semibold text-secondary whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => (
                  <tr
                    key={reg._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-secondary max-w-[180px] truncate">
                      {events[reg.eventID] || reg.eventID}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">
                      {reg.userEmail}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {reg.regNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {reg.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {reg.faculty}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(reg.registrationDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          reg.status === "registered"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {reg.status}
                      </span>
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
