import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import { UserPlus } from "lucide-react";
import "../../styles/auth/Register.css";

function RegisterProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          first_name: firstName,
          last_name: lastName,
          birthdate,
          gender
        })
      });
      const result = await response.json();
      if (response.ok) {
        // Pokud backend vrací token:
        // localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } else {
        setMessage(result.error || "Failed to complete profile.");
      }
    } catch {
      setMessage("Server error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Zakázat klikání na odkazy ve footeru
    const footer = document.querySelector("footer");
    let footerLinks = [];
    if (footer) {
      footerLinks = Array.from(footer.querySelectorAll("a"));
      footerLinks.forEach(link => {
        link.addEventListener("click", preventClick, true);
        link.style.pointerEvents = "none";
        // link.style.opacity = "0.5"; // vizuální zneaktivnění
      });
    }

    // Zakázat klikání na odkazy v headeru
    const header = document.querySelector("header");
    let headerLinks = [];
    if (header) {
      headerLinks = Array.from(header.querySelectorAll("a"));
      headerLinks.forEach(link => {
        link.addEventListener("click", preventClick, true);
        link.style.pointerEvents = "none";
        // link.style.opacity = "0.5";
      });
    }

    // Úklid při odchodu ze stránky
    return () => {
      footerLinks.forEach(link => {
        link.removeEventListener("click", preventClick, true);
        link.style.pointerEvents = "";
        // link.style.opacity = "";
      });
      headerLinks.forEach(link => {
        link.removeEventListener("click", preventClick, true);
        link.style.pointerEvents = "";
        // link.style.opacity = "";
      });
    };

    function preventClick(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <div className="page-wrapper">
      <AuthHeader />
      <div className="register-bg">
        <div className="register-layout">
          <div className="register-side left-side"></div>
          <div className="login-box register-fullbox">
            <div className="register-title-bg">
              <div className="form-icon">
                <UserPlus size={48} />
              </div>
              <h2 className="login-title">Complete Your Profile</h2>
            </div>
            <div className="register-intro">
              <span className="register-intro-text">
                Please fill in your personal information to activate your account.
              </span>
            </div>
            <div className="login-content">
              <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />

                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />

                <label htmlFor="birthdate">Date of Birth</label>
                <input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={e => setBirthdate(e.target.value)}
                  required
                />

                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  placeholder="Select"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <button type="submit" className="button-auth" disabled={loading}>
                  {loading ? "Saving..." : "Complete Registration"}
                </button>
              </form>
            </div>
            {message && <div className="toast">{message}</div>}
          </div>
          <div className="register-side right-side"></div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}

export default RegisterProfile;