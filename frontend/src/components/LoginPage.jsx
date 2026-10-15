import { API_BASE } from '../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
        username,
        password,
      });
      const token = loginResponse.data.token; // Get token from login response
      localStorage.setItem('token', token); // Save token to localStorage

      // Fetch user role using the token
      const userResponse = await axios.get(`${API_BASE}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      const role = userResponse.data.role; // Get role from user response
      setMessage(`Login successful! Role: ${role}`); // Include role in the success message

      // Redirect based on role
      if (role === 'admin') {
        setTimeout(() => navigate('/admin'), 1000); // Redirect to AdminPage for admin users
      } else {
        setTimeout(() => navigate('/home'), 1000); // Redirect to home for other users
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <div className="login-container" id='Login'>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      <button onClick={() => navigate('/register')} className="switch-button">
        Go to Register
      </button>
    </div>
  );
};

export default LoginPage;
