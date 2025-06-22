import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDashboardData } from "./dashboard/useDashboardData";

function Dashboard() {
  const dashboardData = useDashboardData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rememberedIdentifier");
    navigate("/login");
  }

  return (
    <div className="dashboard-bg">
      <div className="dashboard-layout">
        <Sidebar
          user={dashboardData.user}
          onLogout={handleLogout}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <main className={`dashboard-background${sidebarOpen ? " sidebar-open" : " sidebar-closed"}`}>
          <div className="dashboard-content">
            <Outlet context={dashboardData} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;