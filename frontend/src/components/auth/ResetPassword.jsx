import React, { useState } from "react";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import "../../styles/auth/Register.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Lock, LockKeyhole } from "lucide-react";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!password || !password2) {
      setMessage("Please fill in both fields.");
      return;
    }
    if (password !== password2) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(result.error || result.message || "Password reset failed.");
      }
    } catch {
      setMessage("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <AuthHeader />
      <div className="register-bg">
        <div className="register-layout">
          <div className="register-side left-side"></div>
          <div className="login-box register-fullbox">
            <div className="register-title-bg">
              <h2 className="login-title">
                Reset Password <LockKeyhole size={35} style={{ marginBottom: '0.3em', color: '#000' }} />
              </h2>
            </div>
            <div className="register-intro">
              <span className="register-intro-text">
                Enter your new password below.
              </span>
            </div>
            <div className="login-content">
              <form onSubmit={handleSubmit}>
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password2">Confirm New Password</label>
                <input
                  id="password2"
                  type="password"
                  placeholder="Repeat new password"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  required
                />
                <button type="submit" className="button-auth" disabled={loading} style={{ marginTop: '1.2em' }}>
                  {loading ? (
                    <>
                      <span className="spinner" /> Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
              {message && (
                <div className={`toast ${message.includes('successful') ? 'toast-success' : 'toast-error'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
          <div className="register-side right-side"></div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}

export default ResetPassword;