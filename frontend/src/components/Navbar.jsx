import logo from "../assets/logo.png";
import { useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState("Home");

  const navItem = (label) => (
    <button
      onClick={() => setActive(label)}
      className={`mx-4 text-lg hover:text-[#7a1d1a] transition 
        ${active === label ? "text-[#7a1d1a] font-semibold" : "text-gray-600"}`}
    >
      {label}
    </button>
  );

  return (
    <nav className="flex items-center justify-between w-full px-8 py-3 bg-white border-b border-gray-200">
      {/* LEFT */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="w-auto h-20" />
        <span className="text-2xl font-bold text-gray-800">OUEvents</span>
      </div>

      {/* CENTER */}
      <div className="flex items-center">
        {navItem("Home")}
        {navItem("Events")}
        {navItem("About")}
      </div>

      {/* RIGHT */}
      <div className="flex items-center space-x-8">
        <button className="border border-[#7a1d1a] text-[#7a1d1a] px-4 py-1.5 rounded-lg font-medium hover:bg-[#7a1d1a] hover:text-white transition">
          Log In
        </button>

        <div className="w-9 h-9 rounded-full bg-[#7a1d1a] text-white flex items-center justify-center text-xl">
          <span>👤</span>
        </div>
      </div>
    </nav>
  );
}
