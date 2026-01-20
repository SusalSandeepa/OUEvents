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
    LuSmile
} from "react-icons/lu";

export default function AdminReportsPage() {
    // State
    const [currentTab, setCurrentTab] = useState('events');
    const [generalStats, setGeneralStats] = useState({
        totalEvents: 0,
        totalUsers: 0,
        totalRegistrations: 0,
        avgRating: "0.0"
    });
    const [reportData, setReportData] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dynamicFilters, setDynamicFilters] = useState({
        categories: [],
        faculties: []
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
        rating: "All Ratings"
    });

    // Configuration for different report types
    const reportConfigs = {
        events: {
            title: 'Events',
            icon: <LuCalendar className="mr-2" />,
            filterOptions: {
                category: ['All Categories', ...dynamicFilters.categories],
                status: ['All Status', 'Active', 'Inactive']
            },
            headers: ['#', 'Event ID', 'Title', 'Category', 'Date & Time', 'Location', 'Organizer', 'Status']
        },
        users: {
            title: 'Users',
            icon: <LuUsers className="mr-2" />,
            filterOptions: {
                role: ['All Roles', 'User', 'Organizer', 'Admin'],
                status: ['All Status', 'Active', 'Blocked']
            },
            headers: ['#', 'Email', 'Full Name', 'Role', 'Verified', 'Status']
        },
        registrations: {
            title: 'Registrations',
            icon: <LuClipboardList className="mr-2" />,
            filterOptions: {
                faculty: ['All Faculties', ...dynamicFilters.faculties],
                status: ['All Status', 'Registered', 'Attended', 'Cancelled']
            },
            headers: ['#', 'Event ID', 'User Email', 'Reg. No', 'Faculty', 'Date', 'Status']
        },
        feedback: {
            title: 'Feedback',
            icon: <LuMessageSquare className="mr-2" />,
            filterOptions: {
                rating: ['All Ratings', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star']
            },
            headers: ['#', 'Event ID', 'User Email', 'Rating', 'Comment', 'Date']
        }
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
            const res = await axios.get(`${import.meta.env.VITE_API_URL}api/reports/stats`);
            setGeneralStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}api/reports/filters`);
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
            if (filters.search) params.append('search', filters.search);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.category !== 'All Categories') params.append('category', filters.category);
            if (filters.status !== 'All Status') params.append('status', filters.status);
            if (filters.role !== 'All Roles') params.append('role', filters.role);
            if (filters.faculty !== 'All Faculties') params.append('faculty', filters.faculty);
            if (filters.rating !== 'All Ratings') params.append('rating', filters.rating);

            const res = await axios.get(`${import.meta.env.VITE_API_URL}api/reports/data/${currentTab}?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
        setFilters(prev => ({ ...prev, [name]: value }));
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
            rating: "All Ratings"
        };
        setFilters(resetObj);
        // We'll call fetch after state updates in a real app, but for now we rely on the generate button
    };

    // Export Functions
    const exportToJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `OUEvents_${currentTab}_report.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success("JSON Report exported");
    };

    const exportToCSV = () => {
        if (reportData.length === 0) return;
        const headers = Object.keys(reportData[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const row of reportData) {
            const values = headers.map(header => {
                const val = row[header];
                return `"${val}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `OUEvents_${currentTab}_report.csv`);
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
    const paginatedData = reportData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Icon mapping for metrics coming from backend
    const metricIconMap = {
        'fa-calendar': <LuCalendar size={20} />,
        'fa-play-circle': <LuCirclePlay size={20} />,
        'fa-pause-circle': <LuCirclePause size={20} />,
        'fa-users': <LuUsers size={20} />,
        'fa-user-check': <LuUserCheck size={20} />,
        'fa-user-tie': <LuUserCog size={20} />,
        'fa-ticket': <LuTicket size={20} />,
        'fa-xmark': <LuX size={20} />,
        'fa-comments': <LuMessageSquare size={20} />,
        'fa-star': <LuStar size={20} />,
        'fa-face-smile': <LuSmile size={20} />,
    };

    const renderSecondaryCard = (label, value, icon) => (
        <div className="bg-secondary/10 rounded-2xl p-6 border border-secondary/20 group">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-black text-secondary mb-1">{value}</p>
            <p className="text-xs text-secondary/50 font-bold uppercase tracking-widest">{label}</p>
        </div>
    );

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <LuStar key={s} size={12} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full overflow-hidden bg-[#F8F9FA]">
            {/* Printable View Styles */}
            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        #print-section, #print-section * { visibility: visible; }
                        #print-section { position: absolute; left: 0; top: 0; width: 100%; }
                        .no-print { display: none !important; }
                    }
                `}
            </style>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                {/* Page Title & Export */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print">
                    <div>
                        <h2 className="text-2xl md:text-3xl text-secondary font-black tracking-tight">Reports Dashboard</h2>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Detailed analysis and data export for OUEvents</p>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <button onClick={exportToCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 border border-green-200 transition-all active:scale-95">
                            <LuFileSpreadsheet size={16} /> Excel
                        </button>
                        <button onClick={exportToJSON} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 border border-blue-200 transition-all active:scale-95">
                            <LuFileJson size={16} /> JSON
                        </button>
                        <button onClick={exportToPDF} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-[#7a1e1e] rounded-xl text-xs font-bold hover:bg-red-100 border border-red-200 transition-all active:scale-95">
                            <LuFileText size={16} /> PDF
                        </button>
                    </div>
                </div>

                {/* Top Metrics Row - Mobile Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 no-print">
                    {renderSecondaryCard("Total Events", generalStats.totalEvents, <LuCalendar size={24} />)}
                    {renderSecondaryCard("Total Users", generalStats.totalUsers, <LuUsers size={24} />)}
                    {renderSecondaryCard("Registrations", generalStats.totalRegistrations, <LuClipboardList size={24} />)}
                    {renderSecondaryCard("Avg. Rating", generalStats.avgRating, <LuStar size={24} />)}
                </div>

                {/* Report Type Tabs - Scrollable on mobile */}
                <div className="overflow-x-auto no-scrollbar mb-6 no-print">
                    <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit min-w-full md:min-w-0">
                        {Object.keys(reportConfigs).map(key => (
                            <button
                                key={key}
                                onClick={() => setCurrentTab(key)}
                                className={`flex items-center whitespace-nowrap px-4 md:px-6 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 ${currentTab === key
                                    ? 'bg-[#7a1e1e] text-white shadow-lg shadow-[#7a1e1e]/20'
                                    : 'text-gray-500 hover:text-secondary hover:bg-white/50'
                                    }`}
                            >
                                {reportConfigs[key].icon}
                                {reportConfigs[key].title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters Section - Mobile Responsive */}
                <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-6 no-print">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search records..."
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7a1e1e]/20 transition text-sm font-medium"
                                type="text"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {currentTab !== 'users' && (
                                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                        className="bg-transparent border-none text-xs px-2 py-1 focus:ring-0 cursor-pointer font-bold text-secondary"
                                    />
                                    <span className="text-gray-400 font-bold text-[10px] uppercase">to</span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                        className="bg-transparent border-none text-xs px-2 py-1 focus:ring-0 cursor-pointer font-bold text-secondary"
                                    />
                                </div>
                            )}

                            {currentTab === 'events' && (
                                <>
                                    <select name="category" value={filters.category} onChange={handleFilterChange} className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-secondary focus:ring-2 focus:ring-[#7a1e1e]/20 cursor-pointer">
                                        {reportConfigs.events.filterOptions.category.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                    <select name="status" value={filters.status} onChange={handleFilterChange} className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-secondary focus:ring-2 focus:ring-[#7a1e1e]/20 cursor-pointer">
                                        {reportConfigs.events.filterOptions.status.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                </>
                            )}
                            {currentTab === 'users' && (
                                <>
                                    <select name="role" value={filters.role} onChange={handleFilterChange} className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-secondary focus:ring-2 focus:ring-[#7a1e1e]/20 cursor-pointer">
                                        {reportConfigs.users.filterOptions.role.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                    <select name="status" value={filters.status} onChange={handleFilterChange} className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-secondary focus:ring-2 focus:ring-[#7a1e1e]/20 cursor-pointer">
                                        {reportConfigs.users.filterOptions.status.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                </>
                            )}
                            {currentTab === 'registrations' && (
                                <>
                                    <select name="faculty" value={filters.faculty} onChange={handleFilterChange} className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-secondary focus:ring-2 focus:ring-[#7a1e1e]/20 cursor-pointer">
                                        {reportConfigs.registrations.filterOptions.faculty.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                    <select name="status" value={filters.status} onChange={handleFilterChange} className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-secondary focus:ring-2 focus:ring-[#7a1e1e]/20 cursor-pointer">
                                        {reportConfigs.registrations.filterOptions.status.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                </>
                            )}
                            {currentTab === 'feedback' && (
                                <select name="rating" value={filters.rating} onChange={handleFilterChange} className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-secondary focus:ring-2 focus:ring-[#7a1e1e]/20 cursor-pointer">
                                    {reportConfigs.feedback.filterOptions.rating.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            )}

                            <div className="flex gap-2 w-full lg:w-auto">
                                <button
                                    onClick={fetchReportsData}
                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7a1e1e] text-white rounded-2xl text-sm font-black hover:opacity-90 transition shadow-xl shadow-[#7a1e1e]/20 active:scale-95"
                                >
                                    <LuRotateCcw size={18} /> GENERATE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div id="print-section" className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 mb-8">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {reportConfigs[currentTab].headers.map(h => (
                                        <th key={h} className="text-left px-6 py-5 text-xs font-black text-secondary/60 uppercase tracking-[0.1em]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={reportConfigs[currentTab].headers.length} className="px-6 py-20 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-3">
                                                <LuRotateCcw className="animate-spin text-[#7a1e1e]" size={32} />
                                                <p className="text-sm font-bold uppercase tracking-wider">Processing Data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={reportConfigs[currentTab].headers.length} className="px-6 py-20 text-center text-gray-400 italic">
                                            <p className="text-sm font-bold uppercase tracking-wider">No matching records found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/70 transition-colors group">
                                            <td className="px-6 py-5 text-xs font-black text-secondary/30">{(currentPage - 1) * pageSize + idx + 1}</td>
                                            {currentTab === 'events' && (
                                                <>
                                                    <td className="px-6 py-5 text-xs font-mono text-[#7a1e1e] font-black uppercase">{row.eventID}</td>
                                                    <td className="px-6 py-5 text-xs font-black text-secondary leading-tight">{row.title}</td>
                                                    <td className="px-6 py-5"><span className="px-3 py-1 text-xs font-black bg-sky-50 text-sky-700 rounded-lg uppercase tracking-wider">{row.category}</span></td>
                                                    <td className="px-6 py-5 text-xs font-bold text-secondary/70">{new Date(row.eventDateTime).toLocaleString()}</td>
                                                    <td className="px-6 py-5 text-xs font-bold text-secondary/70">{row.location}</td>
                                                    <td className="px-6 py-5 text-xs font-black text-secondary/80">{row.organizer}</td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-3 py-1 text-xs font-black rounded-lg uppercase tracking-widest ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            {currentTab === 'users' && (
                                                <>
                                                    <td className="px-6 py-5 text-xs font-mono text-blue-600 font-black">{row.email}</td>
                                                    <td className="px-6 py-5 text-xs font-black text-secondary">{row.firstName} {row.lastName}</td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 text-xs font-black bg-indigo-50 text-indigo-700 rounded-lg uppercase tracking-widest">
                                                            {row.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <div className="flex justify-center">
                                                            {row.isEmailVerified ? (
                                                                <LuCircleCheck className="text-green-500" size={20} />
                                                            ) : (
                                                                <LuCircleX className="text-gray-300" size={20} />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-3 py-1 text-xs font-black rounded-lg uppercase tracking-widest ${row.isBlock ? 'bg-red-50 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                            {row.isBlock ? 'Blocked' : 'Active'}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            {currentTab === 'registrations' && (
                                                <>
                                                    <td className="px-6 py-5 text-xs font-mono text-[#7a1e1e] font-black uppercase">{row.eventID}</td>
                                                    <td className="px-6 py-5 text-xs font-mono text-blue-600 font-black">{row.userEmail}</td>
                                                    <td className="px-6 py-5 text-xs font-black text-secondary uppercase leading-none">{row.regNo}</td>
                                                    <td className="px-6 py-5"><span className="px-3 py-1 text-xs font-black bg-purple-50 text-purple-600 rounded-lg uppercase tracking-wider">{row.faculty}</span></td>
                                                    <td className="px-6 py-5 text-xs font-bold text-secondary/70">{new Date(row.registrationDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 text-xs font-black bg-amber-50 text-amber-700 rounded-lg uppercase tracking-widest">
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            {currentTab === 'feedback' && (
                                                <>
                                                    <td className="px-6 py-5 text-xs font-mono text-[#7a1e1e] font-black uppercase">{row.eventID}</td>
                                                    <td className="px-6 py-5 text-xs font-mono text-blue-600 font-black">{row.userEmail}</td>
                                                    <td className="px-6 py-5">{renderStars(row.rating)}</td>
                                                    <td className="px-6 py-5 text-xs font-medium text-secondary/70 max-w-xs">{row.comment || <span className="text-gray-300 italic">No comment</span>}</td>
                                                    <td className="px-6 py-5 text-xs font-bold text-secondary/60">{new Date(row.createdAt).toLocaleDateString()}</td>
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
                        <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
                            <div className="text-xs font-black text-secondary/60 uppercase tracking-widest">
                                PAGE <span className="text-secondary">{currentPage}</span> OF <span className="text-secondary">{totalPages}</span> — <span className="text-secondary">{reportData.length}</span> RECORDS TOTAL
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-secondary hover:bg-white hover:text-[#7a1e1e] hover:border-[#7a1e1e] transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-secondary group"
                                >
                                    <LuChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> PREV
                                </button>

                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#7a1e1e] text-white' : 'bg-white border border-gray-100 text-secondary hover:bg-gray-100'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-secondary hover:bg-white hover:text-[#7a1e1e] hover:border-[#7a1e1e] transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-secondary group"
                                >
                                    NEXT <LuChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Metrics Row - Added at Bottom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 no-print">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-secondary/10 p-5 rounded-2xl border border-secondary/20 flex items-center justify-between">
                            <div>
                                <p className="text-secondary/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{metric.label}</p>
                                <h4 className="text-2xl font-black text-secondary">{metric.value}</h4>
                            </div>
                            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                                {metricIconMap[metric.icon] || <LuRotateCcw size={20} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
