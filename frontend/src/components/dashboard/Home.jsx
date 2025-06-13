import React from "react";

function Home() {
  return (
    <div className="dashboard-box">
      <div className="header">
        <button className="header-btn">Přehled</button>
      </div>
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to your training hub! Here you’ll see your stats, quick actions, and news.</p>
      </div>
    </div>
  );
}

export default Home;