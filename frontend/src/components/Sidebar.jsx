import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import "../styles/Sidebar.css";
import { Menu, Home, User, Settings, UserCircle, LogOut, Users, ChevronDown } from "lucide-react";

function Sidebar({ user, onLogout, open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  const languages = [
    { code: "cs", label: "Čeština" },
    { code: "en", label: "English" },
  ];

  const menuItems = [
    { key: "home", icon: <Home />, label: t("home"), path: "/dashboard/home" },
    { key: "profile", icon: <User />, label: t("profile"), path: "/dashboard/profile" },
    { key: "groups", icon: <Users />, label: t("groups"), path: "/dashboard/groups" },
    { key: "settings", icon: <Settings />, label: t("settings"), path: "/dashboard/settings" },
  ];

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
            onClick={() => navigate("/dashboard/home")}
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
          location.pathname === "/dashboard/overview" ? " active" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard/overview")}
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
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            {item.icon}
            {open && <span className="sidebar-label">{item.label}</span>}
          </li>
        ))}
      </ul>
      {open && (
        <div className="sidebar-lang-btn-wrapper">
          <button
            className="sidebar-lang-btn"
            onClick={() => setLangMenuOpen(v => !v)}
            title={t("change_language") || "Změnit jazyk"}
          >
            <span>
              {languages.find(l => l.code === i18n.language)?.label || i18n.language.toUpperCase()}
            </span>
            <ChevronDown size={18} />
          </button>
          {langMenuOpen && (
            <ul className="sidebar-lang-dropdown">
              {languages.map(lang => (
                <li
                  key={lang.code}
                  className={i18n.language === lang.code ? "active" : ""}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setLangMenuOpen(false);
                  }}
                >
                  {lang.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}

export default Sidebar;