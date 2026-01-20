import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LuPencil,
  LuTrash2,
  LuSearch,
  LuArrowUpDown,
  LuFilter,
  LuX,
  LuPlus,
  LuCalendar,
  LuRefreshCw,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function EventDeleteConfirm(props) {
  const eventID = props.eventID;
  const close = props.close;
  const refresh = props.refresh;

  function deleteEvent() {
    const token = localStorage.getItem("token");
    axios
      .delete(import.meta.env.VITE_API_URL + "api/events/" + eventID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        close();
        refresh();
        toast.success("Event deleted successfully");
      })
      .catch((error) => {
        console.error("Failed to delete event:", error);
        toast.error("Failed to delete event");
      });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
      <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-secondary mb-2">
          Delete Event
        </h3>
        <p className="text-secondary/70 text-sm mb-6">
          Are you sure you want to delete {eventID} event? This action cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={close}
            className="px-4 py-2 text-sm font-medium text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={deleteEvent}
            className="px-4 py-2 text-sm font-medium text-white bg-accent hover:opacity-90 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminEventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "past"

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Sort state
  const [sortConfig, setSortConfig] = useState({
    key: "eventDateTime",
    direction: "asc",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      fetchEvents();
    }
  }, [loading]);

  async function fetchEvents() {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "api/events",
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(events.map((event) => event.category)),
    ];
    return uniqueCategories.filter(Boolean).sort();
  }, [events]);

  // Filter and sort events
  const processedEvents = useMemo(() => {
    const now = new Date();

    // First filter by tab (upcoming/past)
    let result = events.filter((event) => {
      const eventDate = new Date(event.eventDateTime);
      return activeTab === "upcoming" ? eventDate >= now : eventDate < now;
    });

    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.eventID.toLowerCase().includes(query),
      );
    }

    // Then filter by category
    if (categoryFilter) {
      result = result.filter((event) => event.category === categoryFilter);
    }

    // Finally, sort
    result.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === "eventDateTime") {
        aValue = new Date(a.eventDateTime);
        bValue = new Date(b.eventDateTime);
      } else if (sortConfig.key === "title") {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      } else if (sortConfig.key === "category") {
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [events, activeTab, searchQuery, categoryFilter, sortConfig]);

  // For tab counts (before search/category filters)
  const now = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDateTime) >= now,
  );
  const pastEvents = events.filter(
    (event) => new Date(event.eventDateTime) < now,
  );

  return (
    <div>
      {isDeleteModalOpen && (
        <EventDeleteConfirm
          refresh={() => {
            setLoading(true);
          }}
          eventID={eventToDelete}
          close={() => {
            setIsDeleteModalOpen(false);
          }}
        />
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl text-secondary font-bold">
            Event Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Create, update, and manage all your events in one place.
          </p>
        </div>
        <Link
          to="/admin/events/create"
          className="flex items-center gap-2 text-white font-medium text-base bg-accent px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          <LuPlus className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "upcoming"
              ? "bg-accent text-white"
              : "bg-gray-100 text-secondary hover:bg-gray-200"
          }`}
        >
          Upcoming Events
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20">
            {upcomingEvents.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "past"
              ? "bg-accent text-white"
              : "bg-gray-100 text-secondary hover:bg-gray-200"
          }`}
        >
          Past Events
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20">
            {pastEvents.length}
          </span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
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

        {/* Category Filter */}
        <div className="relative">
          <LuFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white min-w-[160px] appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <LuArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key, direction });
            }}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white min-w-[180px] appearance-none cursor-pointer"
          >
            <option value="eventDateTime-asc">Date (Oldest First)</option>
            <option value="eventDateTime-desc">Date (Newest First)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="category-asc">Category (A-Z)</option>
            <option value="category-desc">Category (Z-A)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || categoryFilter) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("");
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LuX className="w-4 h-4" />
            Clear Filters
          </button>
        )}

        {/* Refresh Button */}
        <button
          onClick={() => setLoading(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh events"
        >
          <LuRefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="text-sm text-gray-500 mb-3">
          Showing {processedEvents.length} of{" "}
          {activeTab === "upcoming" ? upcomingEvents.length : pastEvents.length}{" "}
          {activeTab} events
        </div>
      )}

      {/* Events Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading events...</div>
      ) : processedEvents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchQuery || categoryFilter
            ? "No events match your search criteria."
            : activeTab === "upcoming"
              ? "No upcoming events found. Create your first event!"
              : "No past events found."}
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
                  <div className="flex items-center gap-1.5">
                    <LuCalendar className="w-4 h-4" />
                    Date & Time
                  </div>
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
              {processedEvents.map((event) => (
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
                        activeTab === "past"
                          ? "bg-gray-100 text-gray-600"
                          : event.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {activeTab === "past" ? "inactive" : event.status}
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
                      <button
                        onClick={() => {
                          setEventToDelete(event.eventID);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
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
