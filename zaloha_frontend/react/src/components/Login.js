import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setLoginMessage('Please fill in all fields.');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const result = await response.json();
      if (response.ok) {
        setLoginMessage(result.message);
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.username);
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setLoginMessage(result.error || result.message);
      }
    } catch (err) {
      setLoginMessage('Chyba připojení k serveru.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="identifier">Username / Email:</label><br />
        <input
          type="text"
          id="identifier"
          required
          placeholder="Enter your username or email"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
        /><br /><br />
        <label htmlFor="password">Password:</label><br />
        <input
          type="password"
          id="password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br /><br />
        <div style={{ marginTop: '0.5em' }}>
          <a href="#" style={{ fontSize: '0.9em', color: 'gray' }}>Forgot your password?</a>
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: '1em' }}>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
      <p id="loginMessage">{loginMessage}</p>
    </div>
  );
}

export default Login;
