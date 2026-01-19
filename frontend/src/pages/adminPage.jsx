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
} from "react-icons/lu";
import AdminEventPage from "./admin/adminEventPage";
import CreateEventForm from "./admin/createEventForm";
import UpdateEventForm from "./admin/updateEventForm";
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
          typeof res.data.user?.image
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
    <div className="w-full h-screen bg-[#F8F9FA] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[280px] h-full flex flex-col bg-white border-r border-gray-200 z-10">
        {/* Logo Section - Clean & Minimal */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <img
              src={logo}
              alt="OUEvents Logo"
              className="h-20 w-20 object-contain"
            />
            <div>
              <h1 className="text-xl text-secondary font-bold">OUEvents</h1>
              <p className="text-[12px] text-secondary/80 font-medium">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-3 px-3 py-4 flex-1">
          <Link to="/admin" className={getNavStyle("/admin")}>
            <LuLayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/admin/users" className={getNavStyle("/admin/users")}>
            <LuUsers size={18} />
            User Management
          </Link>
          <Link to="/admin/events" className={getNavStyle("/admin/events")}>
            <LuCalendar size={18} />
            Event Management
          </Link>
          <Link
            to="/admin/registrations"
            className={getNavStyle("/admin/registrations")}
          >
            <LuBookOpenCheck size={18} />
            Event Registrations
          </Link>
          <Link to="/admin/reports" className={getNavStyle("/admin/reports")}>
            <LuClipboardList size={18} />
            Reports
          </Link>
          <Link to="/admin/feedback" className={getNavStyle("/admin/feedback")}>
            <LuMessageSquare size={18} />
            Feedback
          </Link>
        </div>

        {/* User Profile Mini */}
        <div className="w-full px-4 py-4 relative">
          {/* Dropdown Menu - shows above the profile */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  navigate("/admin/profile");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LuUser size={16} />
                Profile
              </button>
              <button
                onClick={() => {
                  navigate("/admin/settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
              >
                <LuSettings size={16} />
                Settings
              </button>
            </div>
          )}

          {/* Profile Card */}
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-100"
          >
            {/* Profile Picture or Initial Letter */}
            {user?.image && !imageError ? (
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
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            {/* Chevron Icon */}
            <LuChevronUp
              size={16}
              className={`text-gray-400 transition-transform ${
                showProfileMenu ? "" : "rotate-180"
              }`}
            />
          </div>

          {/* Logout Button - separate below */}
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
                path="/registrations"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    Event Registrations Module
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
              <Route
                path="/profile"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    Profile Module
                  </h2>
                }
              />
              <Route
                path="/settings"
                element={
                  <h2 className="text-lg font-semibold opacity-50">
                    Settings Module
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
