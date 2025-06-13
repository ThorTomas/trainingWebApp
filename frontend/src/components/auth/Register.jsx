import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';
import '../../styles/auth/Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!username || !email || !password || !password2) {
      setMessage('Please fill in all fields.');
      return;
    }
    if (password !== password2) {
      setMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setMessage('You must agree to the terms and privacy policy.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, subscribe })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Registration successful! Check your email for verification.');
        setTimeout(() => navigate('/register-success'), 1200);
      } else {
        setMessage(result.error || result.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <AuthHeader />
      <div className="register-bg">
        <div className="register-layout">
          <div className="register-side left-side">{/* obrázek vlevo */}</div>
          <div className="login-box register-fullbox">
            <div className="register-title-bg">
              <h2 className="login-title">Create Account <UserPlus size={35} style={{ marginBottom: '0.3em' }} /></h2>
            </div>
            <div className="register-intro">
              <span className="register-intro-text">
                Track your progress, plan efficiently, and connect with data from your sports tracker.<br />
                The training diary is your personal coach and performance archive – all in one place, anytime.
              </span>
            </div>
            <div className="login-content">
              <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <div className="input-icon-wrapper">
                  <input
                    id="username"
                    type="text"
                    placeholder="Your Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password2">Confirm password</label>
                <input
                  id="password2"
                  type="password"
                  placeholder="Repeat password"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  required
                />

                <div className="register-checkbox-group">
                  <div className="register-checkbox">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                    />
                    <label htmlFor="agreeTerms">
                      I agree to the Terms of Service and acknowledge the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    </label>
                  </div>
                  <div className="register-checkbox">
                    <input
                      type="checkbox"
                      id="subscribe"
                      checked={subscribe}
                      onChange={() => setSubscribe(!subscribe)}
                    />
                    <label htmlFor="subscribe">
                      I want to receive tips and news by Email
                    </label>
                  </div>
                </div>

                <button type="submit" className="button-auth" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" /> Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
              <div style={{ marginTop: '1em' }}>
                <p>Already have an account? <a href="/">Log in here</a></p>
              </div>
            </div>
          </div>
          <div className="register-side right-side">{/* obrázek vpravo */}</div>
        </div>
      </div>
      {message && (
        <div className={`toast ${message.includes('successful') ? 'toast-success' : 'toast-error'}`}>
          {message}
        </div>
      )}
      <AuthFooter />
    </div>
  );
}

export default Register;
