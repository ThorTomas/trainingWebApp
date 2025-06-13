import React, { useEffect, useState } from 'react';

function Sidebar({ profile }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Pokud bude profilové foto v profile, lze nastavit zde
    // případně další efekty
  }, [profile]);

  return (
    <div id="sidebar" className={`sidebar${open ? ' open' : ''}`}> 
      <div className="sidebar-header">
        <button id="sidebarToggle" className="sidebar-toggle" onClick={() => setOpen(!open)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <span className="sidebar-title" id="sidebarTitle">Traininger</span>
      </div>
      <div className="sidebar-profile">
        <img id="sidebarProfilePic" src="profile.jpg" alt="Profile" className="sidebar-profile-pic" />
        <div className="sidebar-profile-info">
          <span id="sidebarProfileName">{profile?.first_name} {profile?.last_name}</span>
          <div id="sidebarProfileUsername" className="sidebar-profile-username">{profile?.username}</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <a href="/dashboard"><span className="icon">🏠</span> <span className="nav-label">Dashboard</span></a>
        <a href="/profile"><span className="icon">👤</span> <span className="nav-label">Profil</span></a>
      </nav>
    </div>
  );
}

export default Sidebar;
