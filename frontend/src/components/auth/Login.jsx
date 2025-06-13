import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';
import '../../styles/auth/Login.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Načtení uloženého identifikátoru při načtení komponenty
  useEffect(() => {
    const savedIdentifier = localStorage.getItem('rememberedIdentifier');
    if (savedIdentifier) {
      setIdentifier(savedIdentifier);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!identifier || !password) {
      setMessage('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        if (rememberMe) {
          localStorage.setItem('token', result.token);
        } else {
          sessionStorage.setItem('token', result.token);
        }
        localStorage.setItem('username', result.username);
        if (rememberMe) {
          localStorage.setItem('rememberedIdentifier', identifier);
        } else {
          localStorage.removeItem('rememberedIdentifier');
        }
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard');
        }, 2000);
        return;
      } else {
        setMessage(result.error || result.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setMessage('Server connection error.');
    }
  };

  return (
    <>
      <AuthHeader />
      <div className="login-bg">
        <div className="login-box no-padding">
          <div className="login-title-bg">
            <h2 className="login-title">Log In</h2>
          </div>
          <div className="login-content">
            <form action="login" onSubmit={handleSubmit}>
              <label htmlFor="identifier">Username / Email</label>
              <input 
                id="identifier" 
                type="text" 
                placeholder="Your Email or Username" 
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
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
              <div className="login-options-row">
                <span className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </span>
                <a href="/forgot-password" className="forgot-password">Forgot password?</a>
              </div>
              <button type="submit" className="button-auth" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <div style={{ marginTop: '1em' }}>
              <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
          </div>
        </div>
      </div>
      {message && (
        <div className={`toast ${message.includes('successful') ? 'toast-success' : 'toast-error'}`}>
          {message}
        </div>
      )}
      <AuthFooter />
    </>
  );
}

export default Login;
