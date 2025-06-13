import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Home from "./dashboard/Home";
import Profile from "./dashboard/Profile";
import Settings from "./dashboard/Settings";
import OverviewStats from "./dashboard/OverviewStats";

const API_BASE = "http://127.0.0.1:5000";

function Dashboard() {
  const [selected, setSelected] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_BASE}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(profile => {
        setUser(profile);
      });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rememberedIdentifier");
    setUser(null);
    navigate("/login");
  }

  let Content;
  switch (selected) {
    case "overviewStats":
      Content = <OverviewStats />;
      break;
    case "profile":
      Content = <Profile />;
      break;
    case "settings":
      Content = <Settings />;
      break;
    case "home":
    default:
      Content = <Home />;
    
  }

  return (
    <>
      <div className="dashboard-bg">
        <div className="dashboard-layout">
          <Sidebar
            user={user}
            selected={selected}
            setSelected={setSelected}
            onLogout={handleLogout}
          />
          <main className="dashboard-background">{Content}</main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;