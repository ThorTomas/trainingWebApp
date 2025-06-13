import React, { useState } from 'react';
import { MailQuestion } from 'lucide-react';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';
import '../../styles/auth/Register.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('If the email exists, you will receive password reset instructions.');
      } else {
        setMessage(result.error || result.message || 'Email not found.');
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
              <div className="form-icon">
                <MailQuestion size={48} />
              </div>
              <h2 className="login-title">Forgot Password</h2>
            </div>
            <div className="register-intro">
              <span className="register-intro-text">
                Enter your email address and we’ll send you instructions to reset your password.
              </span>
            </div>
            <div className="login-content">
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="button-auth" disabled={loading} style={{ marginTop: '1.2em' }}>
                  {loading ? (
                    <>
                      <span className="spinner" /> Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
              <div style={{ marginTop: '1em', textAlign: 'center' }}>
                <a href="/">Back to login</a>
              </div>
            </div>
          </div>
          <div className="register-side right-side">{/* obrázek vpravo */}</div>
        </div>
        {message && (
          <div className={`toast ${message.includes('instructions') ? 'toast-success' : 'toast-error'}`}>
            {message}
          </div>
        )}
      </div>
      <AuthFooter />
    </div>
  );
}

export default ForgotPassword;
