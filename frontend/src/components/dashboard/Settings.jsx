import React from "react";
import { Pencil } from "lucide-react";

function Settings({ user }) {
  return (
    <div className="dashboard-box">
      {/* Settings Header */}
      <div className="header">
        <div 
          className="header-avatar"
          title="Edit profile"
          onClick={() => {/* open modal or redirect to profile edit */}}
        >
          {user?.profilePhotoUrl ? (
            <img
              src={user.profilePhotoUrl}
              alt="Profile"
              className="header-photo"
            />
          ) : (
            <span style={{ fontSize: 32, color: "#888" }}>?</span>
          )}
          <span className="avatar-pencil" style={ { position: "absolute", left: 40, bottom: 5 }}>
            <Pencil size={13} color="#888" />
          </span>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{user?.first_name} {user?.last_name}</h2>
          <div style={{ color: "#888", fontSize: 16 }}>Nastavení</div>
        </div>
      </div>
      {/* ...další obsah nastavení... */}
    </div>
  );
}

export default Settings;