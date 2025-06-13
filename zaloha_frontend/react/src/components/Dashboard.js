import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      window.location.href = '/';
      return;
    }
    setToken(t);
    fetch('http://127.0.0.1:5000/api/user/profile', {
      headers: { 'Authorization': `Bearer ${t}` }
    })
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar profile={profile} />
      <div id="mainContent" style={{ flex: 1 }}>
        <header>
          <h1>Training Planner</h1>
          <div className="user-bar">
            <span id="userLabel">User: {profile ? `${profile.first_name} ${profile.last_name}` : '???'}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </header>
        <TrainingTable token={token} />
      </div>
    </div>
  );
}

export default Dashboard;
