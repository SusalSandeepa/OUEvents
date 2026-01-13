import { Routes, Route, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  LuLayoutDashboard,
  LuUsers,
  LuCalendar,
  LuClipboardList,
  LuMessageSquare,
} from "react-icons/lu";
import AdminEventPage from "./admin/adminEventPage";
import CreateEventForm from "./admin/createEventForm";
import UpdateEventForm from "./admin/updateEventForm";

export default function AdminPage() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navClasses = (path) => `
    w-[90%] flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
    ${
      isActive(path)
        ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20"
        : "text-gray-500 hover:bg-white hover:text-[var(--color-accent)] hover:shadow-sm"
    }
  `;

  return (
    <div className="w-full h-screen bg-[#F8F9FA] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[260px] h-full flex flex-col bg-white border-r border-gray-200 z-10">
        {/* Logo Section - Clean & Minimal */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <img
              src={logo}
              alt="OUEvents Logo"
              className="h-20 w-20 object-contain"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                <span className="text-secondary font-bold">OU</span>
                <span className="text-accent font-bold">Events</span>
              </h1>
              <p className="text-[12px] text-secondary/80 font-medium">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-3 px-3 py-4 flex-1">
          <Link to="/admin" className={navClasses("/admin")}>
            <LuLayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/admin/users" className={navClasses("/admin/users")}>
            <LuUsers size={18} />
            User Management
          </Link>
          <Link to="/admin/events" className={navClasses("/admin/events")}>
            <LuCalendar size={18} />
            Event Management
          </Link>
          <Link to="/admin/reports" className={navClasses("/admin/reports")}>
            <LuClipboardList size={18} />
            Reports
          </Link>
          <Link to="/admin/feedback" className={navClasses("/admin/feedback")}>
            <LuMessageSquare size={18} />
            Feedback
          </Link>
        </div>

        {/* User Profile Mini */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="h-9 w-9 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-400 truncate">admin@ousl.lk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-hidden bg-[#F3F4F6] p-6">
        <div className="h-full w-full bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route
                path="/"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    Dashboard Stats & Overview
                  </h2>
                }
              />
              <Route
                path="/users"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    User Management Module
                  </h2>
                }
              />
              <Route path="/events" element={<AdminEventPage />} />
              <Route
                path="/reports"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    Registration Reports Module
                  </h2>
                }
              />
              <Route
                path="/feedback"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    Feedback Summary Module
                  </h2>
                }
              />
              <Route path="/events/create" element={<CreateEventForm />} />
              <Route path="/events/update" element={<UpdateEventForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
