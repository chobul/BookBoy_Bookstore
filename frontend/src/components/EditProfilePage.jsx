import { API_BASE } from '../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfilePage.css';

const EditProfilePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // Added phone state
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/api/users/me`,
        { username, password, phone }, // Include phone in the request
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/home'), 1000); // Redirect to home after 1 second
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile deleted successfully!');
      setTimeout(() => navigate('/'), 1000); // Redirect to login after 1 second
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete profile.');
    }
  };

  return (
    <div className="edit-profile-container" id='Edit'>
      <h1>Edit Profile</h1>
      <input
        type="text"
        placeholder="New Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone Number" // Added phone input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete} className="delete-button">Delete Profile</button>
      <p>{message}</p>
      <button onClick={() => navigate('/home')} className="cancel-button">
        Cancel
      </button>
    </div>
  );
};

export default EditProfilePage;
