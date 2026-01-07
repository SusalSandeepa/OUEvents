import { Routes, Route, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { LuLayoutDashboard, LuUsers, LuCalendar, LuClipboardList, LuMessageSquare } from "react-icons/lu";

export default function AdminPage() {
  const location = useLocation();

  const isActive = (path) => {
      if (path === "/admin" && location.pathname === "/admin") return true;
      if (path !== "/admin" && location.pathname.startsWith(path)) return true;
      return false;
  };

  const navClasses = (path) => `
    w-[90%] flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
    ${isActive(path) 
        ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20" 
        : "text-gray-500 hover:bg-white hover:text-[var(--color-accent)] hover:shadow-sm"
    }
  `;

  return (
    <div className="w-full h-screen bg-[#F3F4F6] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[280px] h-full flex flex-col items-center py-6 bg-white border-r border-gray-100 z-10 shadow-sm">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 px-6 w-full">
          <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-accent)]/10 blur-xl rounded-full"></div>
              <img
                src={logo}
                alt="OUEvents Logo"
                className="h-10 w-auto object-contain relative z-10"
              />
          </div>
          <span className="text-[var(--color-accent)] text-xl font-bold tracking-tight">Admin Panel</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 w-full items-center">
            <Link to="/admin" className={navClasses("/admin")}>
            <LuLayoutDashboard size={20} />
            Dashboard
            </Link>
            <Link to="/admin/users" className={navClasses("/admin/users")}>
            <LuUsers size={20} />
            User Management
            </Link>
            <Link to="/admin/events" className={navClasses("/admin/events")}>
            <LuCalendar size={20} />
            Event Management
            </Link>
            <Link to="/admin/reports" className={navClasses("/admin/reports")}>
            <LuClipboardList size={20} />
            Reports
            </Link>
            <Link to="/admin/feedback" className={navClasses("/admin/feedback")}>
            <LuMessageSquare size={20} />
            Feedback
            </Link>
        </div>
        
        {/* User Profile Mini */}
        <div className="mt-auto w-[90%] p-4 rounded-2xl bg-gray-50 flex items-center gap-3 border border-gray-100">
             <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[var(--color-accent)] font-bold shadow-sm border border-gray-100">
                 A
             </div>
             <div className="overflow-hidden">
                 <p className="truncate text-sm font-bold text-gray-900">Admin User</p>
                 <p className="truncate text-xs text-gray-500">View Profile</p>
             </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-hidden bg-[#F3F4F6] p-6">
        <div className="h-full w-full bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col">
        

            <div className="flex-1 overflow-y-auto p-8">
            <Routes>
                <Route path="/" element={<h2 className="text-lg font-semibold opacity-50">Dashboard Stats & Overview</h2>} />
                <Route path="/users" element={<h2 className="text-lg font-semibold opacity-50">User Management Module</h2>} />
                <Route path="/events" element={<h2 className="text-lg font-semibold opacity-50">Event Management Module</h2>} />
                <Route path="/reports" element={<h2 className="text-lg font-semibold opacity-50">Registration Reports Module</h2>} />
                <Route path="/feedback" element={<h2 className="text-lg font-semibold opacity-50">Feedback Summary Module</h2>} />
            </Routes>
            </div>
        </div>
      </div>
    </div>
  );
}