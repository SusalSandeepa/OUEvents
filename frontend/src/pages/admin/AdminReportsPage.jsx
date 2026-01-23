import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  LuCalendar,
  LuUsers,
  LuClipboardList,
  LuMessageSquare,
  LuRotateCcw,
  LuSearch,
  LuFileJson,
  LuFileSpreadsheet,
  LuFileText,
  LuMapPin,
  LuStar,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuCircleX,
  LuCirclePlay,
  LuCirclePause,
  LuUserCheck,
  LuUserCog,
  LuTicket,
  LuX,
  LuSmile,
} from "react-icons/lu";

export default function AdminReportsPage() {
  // State
  const [currentTab, setCurrentTab] = useState("events");
  const [generalStats, setGeneralStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    avgRating: "0.0",
  });
  const [reportData, setReportData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicFilters, setDynamicFilters] = useState({
    categories: [],
    faculties: [],
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    category: "All Categories",
    status: "All Status",
    role: "All Roles",
    faculty: "All Faculties",
    rating: "All Ratings",
  });

  // Configuration for different report types
  const reportConfigs = {
    events: {
      title: "Events",
      icon: <LuCalendar className="mr-2" />,
      filterOptions: {
        category: ["All Categories", ...dynamicFilters.categories],
        status: ["All Status", "Active", "Inactive"],
      },
      headers: [
        "#",
        "Event ID",
        "Title",
        "Category",
        "Date & Time",
        "Location",
        "Organizer",
        "Status",
      ],
    },
    users: {
      title: "Users",
      icon: <LuUsers className="mr-2" />,
      filterOptions: {
        role: ["All Roles", "User", "Organizer", "Admin"],
        status: ["All Status", "Active", "Blocked"],
      },
      headers: ["#", "Email", "Full Name", "Role", "Verified", "Status"],
    },
    registrations: {
      title: "Registrations",
      icon: <LuClipboardList className="mr-2" />,
      filterOptions: {
        faculty: ["All Faculties", ...dynamicFilters.faculties],
        status: ["All Status", "Registered", "Attended", "Cancelled"],
      },
      headers: [
        "#",
        "Event ID",
        "User Email",
        "Reg. No",
        "Faculty",
        "Date",
        "Status",
      ],
    },
    feedback: {
      title: "Feedback",
      icon: <LuMessageSquare className="mr-2" />,
      filterOptions: {
        rating: [
          "All Ratings",
          "5 Stars",
          "4 Stars",
          "3 Stars",
          "2 Stars",
          "1 Star",
        ],
      },
      headers: ["#", "Event ID", "User Email", "Rating", "Comment", "Date"],
    },
  };

  useEffect(() => {
    fetchGeneralStats();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchReportsData();
    setCurrentPage(1); // Reset to first page on tab change
  }, [currentTab]);

  const fetchGeneralStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}api/reports/stats`,
      );
      setGeneralStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}api/reports/filters`,
      );
      setDynamicFilters(res.data);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.category !== "All Categories")
        params.append("category", filters.category);
      if (filters.status !== "All Status")
        params.append("status", filters.status);
      if (filters.role !== "All Roles") params.append("role", filters.role);
      if (filters.faculty !== "All Faculties")
        params.append("faculty", filters.faculty);
      if (filters.rating !== "All Ratings")
        params.append("rating", filters.rating);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}api/reports/data/${currentTab}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setReportData(res.data.data);
      setMetrics(res.data.metrics);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to load ${currentTab} reports`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    const resetObj = {
      search: "",
      startDate: "",
      endDate: "",
      category: "All Categories",
      status: "All Status",
      role: "All Roles",
      faculty: "All Faculties",
      rating: "All Ratings",
    };
    setFilters(resetObj);
    // We'll call fetch after state updates in a real app, but for now we rely on the generate button
  };

  // Export Functions
  const exportToJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `OUEvents_${currentTab}_report.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("JSON Report exported");
  };

  const exportToCSV = () => {
    if (reportData.length === 0) return;
    const headers = Object.keys(reportData[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const row of reportData) {
      const values = headers.map((header) => {
        const val = row[header];
        return `"${val}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `OUEvents_${currentTab}_report.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Excel/CSV Report exported");
  };

  const exportToPDF = () => {
    window.print();
  };

  // Pagination Logic
  const totalPages = Math.ceil(reportData.length / pageSize);
  const paginatedData = reportData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Icon mapping for metrics coming from backend
  const metricIconMap = (color) => ({
    "fa-calendar": <LuCalendar className="w-6 h-6" color={color} />,
    "fa-play-circle": <LuCirclePlay className="w-6 h-6" color={color} />,
    "fa-pause-circle": <LuCirclePause className="w-6 h-6" color={color} />,
    "fa-users": <LuUsers className="w-6 h-6" color={color} />,
    "fa-user-check": <LuUserCheck className="w-6 h-6" color={color} />,
    "fa-user-tie": <LuUserCog className="w-6 h-6" color={color} />,
    "fa-ticket": <LuTicket className="w-6 h-6" color={color} />,
    "fa-xmark": <LuX className="w-6 h-6" color={color} />,
    "fa-comments": <LuMessageSquare className="w-6 h-6" color={color} />,
    "fa-star": <LuStar className="w-6 h-6" color={color} />,
    "fa-face-smile": <LuSmile className="w-6 h-6" color={color} />,
  });

  const renderSecondaryCard = (
    label,
    value,
    icon,
    colorClass = "bg-blue-50",
    iconColor = "#3b82f6",
  ) => {
    // Clone icon with color and size classes to match dashboard exactly
    const coloredIcon = React.cloneElement(icon, {
      className: "w-6 h-6",
      color: iconColor,
    });

    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {value.toLocaleString()}
            </p>
          </div>
          <div
            className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}
          >
            {coloredIcon}
          </div>
        </div>
      </div>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <LuStar
            key={s}
            size={12}
            className={
              s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-full space-y-8">
      {/* Printable View Styles */}
      <style>
        {`
                    @media print {
                        @page { size: landscape; margin: 10mm; }
                        
                        /* Reset global layout from AdminPage.jsx */
                        html, body { 
                            height: auto !important; 
                            overflow: visible !important;
                            background: white !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }

                        /* Disable h-screen and overflow-hidden on all parent containers */
                        .h-screen, .h-full { height: auto !important; }
                        .overflow-hidden, .overflow-y-auto, .overflow-x-auto { 
                            overflow: visible !important; 
                        }
                        
                        /* Hide Sidebar completely in print */
                        .w-\\[280px\\] { display: none !important; }
                        
                        /* Reset Main Content Area Wrapper */
                        .flex-1.p-6 { 
                            padding: 0 !important; 
                            background: white !important;
                        }
                        
                        /* Reset the inner content container */
                        .flex.flex-col.w-full.h-full.overflow-hidden.bg-white.border.shadow-sm.rounded-3xl {
                            border: none !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            height: auto !important;
                            width: 100% !important;
                        }

                        /* Individual page padding reset */
                        .flex-1.p-8 { 
                            padding: 1rem !important; 
                            height: auto !important;
                        }

                        #print-section { 
                            position: static !important;
                            overflow: visible !important;
                            height: auto !important;
                            box-shadow: none !important;
                            border: 1px solid #eee !important;
                            margin-top: 2rem !important;
                            width: 100% !important;
                        }

                        /* Force grid layouts to keep desktop columns in print */
                        .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4,
                        .grid-cols-1.md\\:grid-cols-3 {
                            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                            display: grid !important;
                        }
                        
                        /* Special case for 4 columns */
                        .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 {
                            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                        }

                        .no-print { 
                            display: none !important; 
                        }

                        /* Ensure text and colors are clear for printing */
                        * { 
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}
      </style>

      <div>
        {/* Page Title & Export */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Reports Dashboard
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Detailed analysis and data export for OUEvents
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto no-print">
            <button
              onClick={exportToCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold hover:bg-green-100 border border-green-200 transition-all active:scale-95"
            >
              <LuFileSpreadsheet size={16} /> Excel
            </button>
            <button
              onClick={exportToJSON}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-all active:scale-95"
            >
              <LuFileJson size={16} /> JSON
            </button>
            <button
              onClick={exportToPDF}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-accent rounded-xl text-xs font-semibold hover:bg-red-100 border border-red-200 transition-all active:scale-95"
            >
              <LuFileText size={16} /> PDF
            </button>
          </div>
        </div>

        {/* Top Metrics Row - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {renderSecondaryCard(
            "Total Events",
            generalStats.totalEvents,
            <LuCalendar />,
            "bg-emerald-50",
            "#10b981",
          )}
          {renderSecondaryCard(
            "Total Users",
            generalStats.totalUsers,
            <LuUsers />,
            "bg-blue-50",
            "#3b82f6",
          )}
          {renderSecondaryCard(
            "Registrations",
            generalStats.totalRegistrations,
            <LuClipboardList />,
            "bg-violet-50",
            "#8b5cf6",
          )}
          {renderSecondaryCard(
            "Avg. Rating",
            generalStats.avgRating,
            <LuStar />,
            "bg-amber-50",
            "#f59e0b",
          )}
        </div>

        <div className="overflow-x-auto no-scrollbar mb-6">
          <div className="flex gap-2 p-1.5 w-fit min-w-full md:min-w-0">
            {Object.keys(reportConfigs).map((key) => (
              <button
                key={key}
                onClick={() => setCurrentTab(key)}
                className={`flex items-center whitespace-nowrap px-4 md:px-6 py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                  currentTab === key
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-gray-500 hover:text-secondary hover:bg-gray-50"
                }`}
              >
                {reportConfigs[key].icon}
                {reportConfigs[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section - Mobile Responsive */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div
              className="relative flex-shrink-0 transition-all duration-300 h-[46px] flex items-center"
              style={{
                width: `calc(${Math.min(Math.max(filters.search.length, 15), 40)}ch + 4rem)`,
              }}
            >
              <LuSearch
                className="absolute left-4 text-gray-400 pointer-events-none"
                size={18}
              />
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search records..."
                className="w-full h-full pl-11 pr-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 transition text-sm text-gray-600"
                type="text"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {currentTab !== "users" && (
                <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-lg h-[46px]">
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="bg-transparent border-none text-xs px-2 py-1 focus:ring-0 cursor-pointer font-medium text-gray-700"
                  />
                  <span className="text-gray-400 font-semibold text-[10px] uppercase">
                    to
                  </span>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="bg-transparent border-none text-xs px-2 py-1 focus:ring-0 cursor-pointer font-medium text-gray-700"
                  />
                </div>
              )}

              {currentTab === "events" && (
                <>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-accent/20 cursor-pointer h-[46px]"
                  >
                    {reportConfigs.events.filterOptions.category.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-accent/20 cursor-pointer h-[46px]"
                  >
                    {reportConfigs.events.filterOptions.status.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </>
              )}
              {currentTab === "users" && (
                <>
                  <select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-accent/20 cursor-pointer h-[46px]"
                  >
                    {reportConfigs.users.filterOptions.role.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-accent/20 cursor-pointer h-[46px]"
                  >
                    {reportConfigs.users.filterOptions.status.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </>
              )}
              {currentTab === "registrations" && (
                <>
                  <select
                    name="faculty"
                    value={filters.faculty}
                    onChange={handleFilterChange}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-accent/20 cursor-pointer h-[46px]"
                  >
                    {reportConfigs.registrations.filterOptions.faculty.map(
                      (opt) => (
                        <option key={opt}>{opt}</option>
                      ),
                    )}
                  </select>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-accent/20 cursor-pointer h-[46px]"
                  >
                    {reportConfigs.registrations.filterOptions.status.map(
                      (opt) => (
                        <option key={opt}>{opt}</option>
                      ),
                    )}
                  </select>
                </>
              )}
              {currentTab === "feedback" && (
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-accent/20 cursor-pointer h-[46px]"
                >
                  {reportConfigs.feedback.filterOptions.rating.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              )}

              <div className="flex gap-2 w-full lg:w-auto no-print">
                <button
                  onClick={fetchReportsData}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-xl shadow-accent/20 active:scale-95"
                >
                  <LuRotateCcw size={18} /> GENERATE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="print-section"
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mb-8"
        >
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  {reportConfigs[currentTab].headers.map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={reportConfigs[currentTab].headers.length}
                      className="px-6 py-20 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <LuRotateCcw
                          className="animate-spin text-[#7a1e1e]"
                          size={32}
                        />
                        <p className="text-sm font-bold uppercase tracking-wider">
                          Processing Data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={reportConfigs[currentTab].headers.length}
                      className="px-6 py-20 text-center text-gray-400 italic"
                    >
                      <p className="text-sm font-bold uppercase tracking-wider">
                        No matching records found
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/40 transition-colors group"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-gray-400">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      {currentTab === "events" && (
                        <>
                          <td className="px-6 py-5 text-sm font-mono text-accent font-bold uppercase">
                            {row.eventID}
                          </td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-800 leading-tight">
                            {row.title}
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 text-xs font-medium bg-sky-50 text-sky-700 rounded-lg uppercase tracking-wider">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500">
                            {new Date(row.eventDateTime).toLocaleString()}
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500">
                            {row.location}
                          </td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                            {row.organizer}
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-widest ${row.status === "active" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                      {currentTab === "users" && (
                        <>
                          <td className="px-6 py-5 text-sm font-mono text-blue-600 font-semibold">
                            {row.email}
                          </td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-800">
                            {row.firstName} {row.lastName}
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg uppercase tracking-widest">
                              {row.role}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex justify-center">
                              {row.isEmailVerified ? (
                                <LuCircleCheck
                                  className="text-green-500"
                                  size={20}
                                />
                              ) : (
                                <LuCircleX
                                  className="text-gray-300"
                                  size={20}
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-widest ${row.isBlock ? "bg-red-50 text-red-600" : "bg-green-100 text-green-700"}`}
                            >
                              {row.isBlock ? "Blocked" : "Active"}
                            </span>
                          </td>
                        </>
                      )}
                      {currentTab === "registrations" && (
                        <>
                          <td className="px-6 py-5 text-sm font-mono text-accent font-semibold uppercase">
                            {row.eventID}
                          </td>
                          <td className="px-6 py-5 text-sm font-mono text-blue-600 font-semibold">
                            {row.userEmail}
                          </td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-800 uppercase leading-none">
                            {row.regNo}
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-lg uppercase tracking-wider">
                              {row.faculty}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500">
                            {new Date(
                              row.registrationDate,
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg uppercase tracking-widest">
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                      {currentTab === "feedback" && (
                        <>
                          <td className="px-6 py-5 text-sm font-mono text-accent font-semibold uppercase">
                            {row.eventID}
                          </td>
                          <td className="px-6 py-5 text-sm font-mono text-blue-600 font-semibold">
                            {row.userEmail}
                          </td>
                          <td className="px-6 py-5">
                            {renderStars(row.rating)}
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-600 max-w-xs">
                            {row.comment || (
                              <span className="text-gray-300 italic">
                                No comment
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Real Pagination UI */}
          {!loading && reportData.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                PAGE <span className="text-gray-800">{currentPage}</span> OF{" "}
                <span className="text-gray-800">{totalPages}</span> —{" "}
                <span className="text-gray-800">{reportData.length}</span>{" "}
                RECORDS TOTAL
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-semibold text-gray-700 hover:bg-white hover:text-accent hover:border-accent transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-700 group"
                >
                  <LuChevronLeft
                    size={14}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />{" "}
                  PREV
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)]
                    .map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-xl text-[10px] font-semibold transition-all ${currentPage === i + 1 ? "bg-accent text-white" : "bg-white border border-gray-100 text-gray-700 hover:bg-gray-100"}`}
                      >
                        {i + 1}
                      </button>
                    ))
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(totalPages, currentPage + 2),
                    )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-semibold text-gray-700 hover:bg-white hover:text-accent hover:border-accent transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-700 group"
                >
                  NEXT{" "}
                  <LuChevronRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Metrics Row - Added at Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {metrics.map((metric, idx) => {
            const iconColors = [
              { bg: "bg-blue-50/50", color: "#3b82f6" },
              { bg: "bg-emerald-50/50", color: "#10b981" },
              { bg: "bg-violet-50/50", color: "#8b5cf6" },
              { bg: "bg-amber-50/50", color: "#f59e0b" },
              { bg: "bg-red-50/50", color: "#ef4444" },
            ];
            const colors = iconColors[idx % iconColors.length];

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {metric.label}
                  </p>
                  <h4 className="text-2xl font-bold text-gray-800 mt-1">
                    {metric.value.toLocaleString()}
                  </h4>
                </div>
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}
                >
                  {metricIconMap(colors.color)[metric.icon] || (
                    <LuRotateCcw className="w-6 h-6" color={colors.color} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
