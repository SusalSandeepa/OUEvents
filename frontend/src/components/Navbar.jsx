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
    <nav className="w-full bg-white border-b border-gray-200 py-3 px-8 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <span className="text-2xl font-bold text-gray-800">OUEvents</span>
      </div>

      {/* CENTER */}
      <div className="flex items-center">
        {navItem("Home")}
        {navItem("Events")}
        {navItem("About")}
      </div>

      {/* RIGHT */}
      <div className="flex items-center space-x-4">
        <button className="border border-[#7a1d1a] text-[#7a1d1a] px-4 py-1.5 rounded-lg font-medium hover:bg-[#7a1d1a] hover:text-white transition">
          Log In
        </button>

        <div className="w-10 h-10 rounded-full bg-[#7a1d1a] text-white flex items-center justify-center text-xl">
          <span>👤</span>
        </div>
      </div>
    </nav>
  );
}
