import React, { useState } from "react";
import "../styles/Sidebar.css";
import { Menu, Home, User, Settings, UserCircle, LogOut } from "lucide-react";

const menuItems = [
  { key: "home", icon: <Home />, label: "Activities" },
  { key: "profile", icon: <User />, label: "Profile" },
  { key: "settings", icon: <Settings />, label: "Settings" },
];

function Sidebar({ user, selected, setSelected, onLogout }) {
  const [open, setOpen] = useState(true);

  return (
    <nav className={`sidebar${open ? " open" : " closed"}`}>
      <div className={`sidebar-header${open ? " open" : ""}`}>
        <span
          className="burger-icon"
          onClick={() => setOpen(o => !o)}
          style={{ cursor: "pointer" }}
        >
          <Menu />
        </span>
        {open && (
          <span
            className="sidebar-title"
            onClick={() => setSelected("home")}
            style={{ cursor: "pointer" }}
          >
            Tendor
          </span>
        )}
        {open && (
          <button
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut />
          </button>
        )}
      </div>
      {/* PROFILOVÝ BOX */}
      <div
        className={`sidebar-profile${
          selected === "overviewStats" ? " active" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => setSelected("overviewStats")}
        title="Show statistics and overview"
      >
        {user?.profilePhotoUrl ? (
          <img
            src={user.profilePhotoUrl}
            alt="Profile photo"
            className="sidebar-profile-photo"
          />
        ) : (
          <span className="sidebar-profile-icon">
            <UserCircle />
          </span>
        )}
        {open && (
          <span className="sidebar-profile-name">
            {user?.first_name} {user?.last_name}
          </span>
        )}
      </div>
      <ul>
        {menuItems.map(item => (
          <li
            key={item.key}
            className={selected === item.key ? "active" : ""}
            onClick={() => setSelected(item.key)}
            title={item.label}
          >
            {item.icon}
            {open && <span className="sidebar-label">{item.label}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;