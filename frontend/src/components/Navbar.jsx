import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
          <div className="items-center hidden px-4 space-x-8 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="tracking-wide border border-[#7a1d1a] text-[#7a1d1a] px-4 py-1.5 rounded-lg font-medium hover:bg-[#7a1d1a] hover:text-white transition"
            >
              Log In
            </button>

            <div className="w-9 h-9 rounded-full bg-[#7a1d1a] text-white flex items-center justify-center text-xl">
              👤
            </div>
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
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/events" onClick={() => setMenuOpen(false)}>
            Events
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
            className="block w-full text-left border border-[#7a1d1a] px-4 py-2 rounded-lg"
          >
            Log In
          </button>
        </div>
      )}
    </>
  );
}
