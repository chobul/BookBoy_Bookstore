import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        setMessage('Failed to fetch notifications.');
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter((notification) => notification.id !== id));
      setMessage('Notification deleted successfully!');
    } catch (error) {
      setMessage('Failed to delete notification.');
    }
  };

  return (
    <div className="notifications-page">
      <Navbar />
      <div className="notifications-container">
        <h1>Notifications</h1>
        {message && <p className="message">{message}</p>}
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="notification-item">
              <p>{notification.message}</p>
              <button onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPage;
