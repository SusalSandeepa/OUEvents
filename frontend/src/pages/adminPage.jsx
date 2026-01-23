import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import logo from "../assets/logo.png";
import {
  LuLayoutDashboard,
  LuUsers,
  LuCalendar,
  LuClipboardList,
  LuMessageSquare,
  LuLogOut,
  LuBookOpenCheck,
  LuUser,
  LuSettings,
  LuChevronUp,
  LuMenu,
  LuX,
} from "react-icons/lu";
import AdminEventManagement from "./admin/adminEventManagement";
import AdminUserManagement from "./admin/adminUserManagement";
import CreateEventForm from "./admin/createEventForm";
import UpdateEventForm from "./admin/updateEventForm";
import AdminFeedbackPage from "./admin/AdminFeedbackPage";
import AdminDashboard from "./admin/adminDashboard";
import AdminReportsPage from "./admin/AdminReportsPage";
import Settings from "../components/settings";
import MyProfile from "../components/myProfile";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get(import.meta.env.VITE_API_URL + "api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.user?.role !== "admin") {
          toast.error("You are not authorized to access this page", {
            id: "auth-error",
          });
          navigate("/login");
          return;
        }
        console.log("User data:", res.data.user); // Debug: check if image exists
        console.log(
          "Image value:",
          res.data.user?.image,
          "Type:",
          typeof res.data.user?.image,
        );
        setUser(res.data.user);
        setUserLoading(false);
      })
      .catch((err) => {
        toast.error("Authorization failed, please login again", {
          id: "auth-error",
        });
        localStorage.removeItem("token");
        setUser(null);
        setUserLoading(false);
        navigate("/login");
        return;
      });
  }, []);

  // This function checks if a button should be highlighted
  const isActive = (path) => {
    // If checking Dashboard and we are on Dashboard page, return true
    if (path === "/admin" && location.pathname === "/admin") return true;
    // If checking other pages and URL starts with path, return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    // If nothing matched, return false
    return false;
  };

  // Style for ACTIVE button (when page is selected)
  const activeButtonStyle =
    "w-[90%] flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-[var(--color-accent)] text-white";

  // Style for INACTIVE button (when page is not selected)
  const inactiveButtonStyle =
    "w-[90%] flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-white hover:text-[var(--color-accent)]";

  // Get style for a nav button
  function getNavStyle(path) {
    if (isActive(path)) {
      return activeButtonStyle;
    } else {
      return inactiveButtonStyle;
    }
  }

  return (
    <div className="w-full h-screen bg-[#F8F9FA] flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center gap-2">
          <Link to="/" aria-label="Go to home">
            <img
              src={logo}
              alt="OUEvents Logo"
              className="object-contain w-10 h-10"
            />
          </Link>
          <span className="text-lg font-bold text-secondary">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <LuMenu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] h-full flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section - Desktop Only (reused for mobile sidebar header) */}
        <div className="px-5 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link to="/" aria-label="Go to home">
              <img
                src={logo}
                alt="OUEvents Logo"
                className="object-contain w-20 h-20 lg:w-20 lg:h-20"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-secondary">OUEvents</h1>
              <p className="text-[12px] text-secondary/80 font-medium">
                Admin Panel
              </p>
            </div>
          </div>
          {/* Close Button for Mobile Sidebar */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col flex-1 gap-3 px-3 py-4 overflow-y-auto">
          <Link
            to="/admin"
            className={getNavStyle("/admin")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LuLayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={getNavStyle("/admin/users")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LuUsers size={18} />
            User Management
          </Link>
          <Link
            to="/admin/events"
            className={getNavStyle("/admin/events")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LuCalendar size={18} />
            Event Management
          </Link>
          <Link
            to="/admin/registrations"
            className={getNavStyle("/admin/registrations")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LuBookOpenCheck size={18} />
            Event Registrations
          </Link>
          <Link
            to="/admin/reports"
            className={getNavStyle("/admin/reports")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LuClipboardList size={18} />
            Reports
          </Link>
          <Link
            to="/admin/feedback"
            className={getNavStyle("/admin/feedback")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LuMessageSquare size={18} />
            Feedback
          </Link>
        </div>

        {/* User Profile Mini */}
        <div className="px-3 py-4 border-t border-gray-100 relative mt-auto">
          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
              <Link
                to="/admin/profile"
                onClick={() => {
                  setShowProfileMenu(false);
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LuUser size={16} />
                My Profile
              </Link>
              <Link
                to="/admin/settings"
                onClick={() => {
                  setShowProfileMenu(false);
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                <LuSettings size={16} />
                Settings
              </Link>
            </div>
          )}

          {/* Profile Card */}
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-100"
          >
            {/* Profile Picture or Initial Letter */}
            {userLoading ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user?.image && !imageError ? (
              <img
                src={user.image}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold shadow-sm">
                {user?.firstName?.[0]?.toUpperCase()}
              </div>
            )}

            {/* User Name and Email */}
            <div className="flex-1 min-w-0">
              {userLoading ? (
                <>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </>
              )}
            </div>

            {/* Chevron Icon */}
            <LuChevronUp
              size={16}
              className={`text-gray-400 transition-transform ${
                showProfileMenu ? "" : "rotate-180"
              }`}
            />
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              navigate("/login");
              toast.success("Logged out successfully");
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LuLogOut size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-[calc(100vh-65px)] lg:h-full overflow-hidden bg-[#F3F4F6] p-4 lg:p-6">
        <div className="flex flex-col w-full h-full overflow-hidden bg-white border shadow-sm rounded-3xl border-gray-100/50">
          <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUserManagement />} />
              <Route path="/events" element={<AdminEventManagement />} />
              <Route path="/reports" element={<AdminReportsPage />} />
              <Route
                path="/registrations"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    Event Registrations Module
                  </h2>
                }
              />
              <Route path="/feedback" element={<AdminFeedbackPage />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/events/create" element={<CreateEventForm />} />
              <Route path="/events/update" element={<UpdateEventForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
