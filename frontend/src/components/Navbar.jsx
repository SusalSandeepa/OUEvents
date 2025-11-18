import "./Navbar.css";
import logo from "../assets/logo.png";
import { useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState("Home");

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} className="nav-logo" alt="Logo" />
        <span className="nav-title">OUEvents</span>
      </div>

      <div className="nav-center">
        <a
          className={active === "Home" ? "active" : ""}
          onClick={() => setActive("Home")}
        >
          Home
        </a>
        <a
          className={active === "Events" ? "active" : ""}
          onClick={() => setActive("Events")}
        >
          Events
        </a>
        <a
          className={active === "About" ? "active" : ""}
          onClick={() => setActive("About")}
        >
          About
        </a>
      </div>

      <div className="nav-right">
        <button className="login-btn">Log In</button>
        <div className="profile-icon">
          <span>👤</span>
        </div>
      </div>
    </nav>
  );
}
