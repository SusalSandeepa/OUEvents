import logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  LuUser,
  LuCalendar,
  LuSettings,
  LuLogOut,
  LuChevronDown,
} from "react-icons/lu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  // Check authentication state on mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      // Fetch user data if logged in
      if (token) {
        axios
          .get(import.meta.env.VITE_API_URL + "api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setUser(res.data.user);
          })
          .catch((err) => {
            console.error("Failed to fetch user:", err);
            setUser(null);
          });
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkAuth();

    // Listen for storage changes (for cross-tab logout sync)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileMenu(false);
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow">
        <div className="flex items-center justify-between px-4 py-0">
          {/* LEFT */}
          <Link to="/" className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="w-auto h-10 md:h-20" />
            <span className="text-2xl md:text-2xl px-4 font-bold text-[#2f3e4e]">
              OUEvents
            </span>
          </Link>

          {/* CENTER (desktop only) */}
          <div className="items-center hidden space-x-8 text-lg text-gray-600 md:flex">
            <Link to="/" className="hover:text-[#7a1d1a]">
              Home
            </Link>
            <Link to="/events" className="hover:text-[#7a1d1a]">
              Events
            </Link>
            <Link to="/about" className="hover:text-[#7a1d1a]">
              About
            </Link>
          </div>

          {/* RIGHT (desktop only) */}
          <div className="items-center hidden px-4 space-x-4 md:flex">
            {isLoggedIn ? (
              <>
                {/* Profile Dropdown Container */}
                <div className="relative" ref={profileMenuRef}>
                  {/* Profile Button */}
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {/* Profile Picture or Initial Letter */}
                    {user?.image && !imageError ? (
                      <img
                        src={user.image}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#7a1d1a]/20"
                        onError={() => setImageError(true)}
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#7a1d1a] text-white flex items-center justify-center font-semibold">
                        {user?.firstName?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <LuChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${
                        showProfileMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/myprofile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LuUser size={16} className="text-gray-500" />
                        My Profile
                      </Link>
                      <Link
                        to="/my-events"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                      >
                        <LuCalendar size={16} className="text-gray-500" />
                        My Events
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                      >
                        <LuSettings size={16} className="text-gray-500" />
                        User Settings
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LuLogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="tracking-wide border border-[#7a1d1a] text-[#7a1d1a] px-4 py-1.5 rounded-lg font-medium hover:bg-[#7a1d1a] hover:text-white transition"
              >
                Log In
              </button>
            )}
          </div>

          {/* HAMBURGER (mobile only) */}
          <button
            className="text-2xl md:hidden text-[#2f3e4e]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="px-6 py-4 space-y-4 bg-white border-b border-gray-200 shadow md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block">
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            Events
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            About
          </Link>

          {isLoggedIn ? (
            <>
              {/* Mobile Profile Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  {user?.image && !imageError ? (
                    <img
                      src={user.image}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#7a1d1a]/20"
                      onError={() => setImageError(true)}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#7a1d1a] text-white flex items-center justify-center font-semibold">
                      {user?.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/myprofile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700"
                >
                  <LuUser size={16} />
                  My Profile
                </Link>
                <Link
                  to="/my-events"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700"
                >
                  <LuCalendar size={16} />
                  My Events
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700"
                >
                  <LuSettings size={16} />
                  User Settings
                </Link>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 w-full py-2 mt-2 text-red-600"
                >
                  <LuLogOut size={16} />
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="block w-full text-left border border-[#7a1d1a] px-4 py-2 rounded-lg"
            >
              Log In
            </button>
          )}
        </div>
      )}
    </>
  );
}
