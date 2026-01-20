import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  LuUsers,
  LuCalendar,
  LuClipboardList,
  LuCalendarCheck,
  LuArrowRight,
  LuPlus,
  LuRefreshCw,
  LuTrendingUp,
  LuShieldCheck,
} from "react-icons/lu";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

// Colors for pie chart slices for 7 categories of events
const CHART_COLORS = [
  "#7a1e1e", // accent/maroon
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
];

// Main dashboard component - displays admin statistics and charts
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend API
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "api/stats/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  // Run fetchStats when component loads and auto-refresh every 10 seconds
  useEffect(() => {
    fetchStats();
  }, []);

  // Format date to readable string like "Jan 15, 2026"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time to readable string like "02:30 PM"
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state - display spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state - display error message with retry button
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <LuCalendar className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <LuRefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Stat cards configuration - each card has title, value, icon, and colors
  const statCards = [
    {
      title: "Users",
      value: stats?.totalUsers || 0,
      icon: LuUsers,
      color: "#3b82f6", // icon color (blue)
      bgLight: "bg-blue-50", // background color
    },
    {
      title: "Admins",
      value: stats?.totalAdmins || 0,
      icon: LuShieldCheck,
      color: "#ef4444", // red
      bgLight: "bg-red-50",
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: LuCalendar,
      color: "#10b981", // green
      bgLight: "bg-emerald-50",
    },
    {
      title: "Registrations",
      value: stats?.totalRegistrations || 0,
      icon: LuClipboardList,
      color: "#8b5cf6", // purple
      bgLight: "bg-violet-50",
    },
    {
      title: "Today's Registrations",
      value: stats?.todaysRegistrations || 0,
      icon: LuTrendingUp,
      color: "#f59e0b", // orange
      bgLight: "bg-amber-50",
    },
  ];

  // Convert backend data for pie chart
  const categoryChartData =
    stats?.eventsByCategory?.map((cat) => ({
      name: cat._id, // category name
      value: cat.count, // count of events in each category
    })) || [];

  // User engagement data for line chart - comes directly from backend
  // example: [{ day: "Mon", date: "2026-01-14", registrations: 5 }, ...]
  const engagementChartData = stats?.userEngagement || [];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LuRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stat cards grid for: Users, Admins, Total Events, Registrations, Today's Registrations*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${card.bgLight} flex items-center justify-center`}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - events grouped by category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Events by Category
          </h2>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // donut hole size
                  outerRadius={100} // pie radius
                  paddingAngle={2} // gap between slices
                  dataKey="value"
                >
                  {/* Assign color to each slice from CHART_COLORS array */}
                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              No category data available
            </div>
          )}
        </div>

        {/* Line Chart - user engagement (registrations over last 7 days) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Engagement
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Registrations over the last 7 days
          </p>
          {engagementChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={engagementChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.date || label
                  }
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#7a1e1e"
                  strokeWidth={3}
                  dot={{ fill: "#7a1e1e", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#7a1e1e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No engagement data available
            </div>
          )}
        </div>
      </div>

      {/* Lists section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming events list - next 5 events */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Upcoming Events
            </h2>
            <Link
              to="/admin/events"
              className="flex items-center gap-1 text-sm text-accent font-medium hover:underline"
            >
              View All <LuArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.upcomingEvents?.length > 0 ? (
              stats.upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Event image */}
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />

                    {/* Event details */}
                    <div className="flex-1 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 truncate">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.location}
                        </p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {event.category}
                        </span>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(event.eventDateTime)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatTime(event.eventDateTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <LuCalendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent registrations list - last 5 registrations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Registrations
            </h2>
            <Link
              to="/admin/registrations"
              className="flex items-center gap-1 text-sm text-accent font-medium hover:underline"
            >
              View All <LuArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentRegistrations?.length > 0 ? (
              stats.recentRegistrations.map((reg, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {reg.eventTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {reg.userEmail}
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-sm text-gray-600">
                        {formatDate(reg.registrationDate)}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                        {reg.faculty}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <LuClipboardList className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No recent registrations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
