import { API_BASE } from '../config';
import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { FaClock, FaSync, FaTruck, FaCheckCircle, FaTrash } from 'react-icons/fa'; // Added FaTrash
import './AdminOrderPage.css';

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(
          Array.isArray(data)
            ? data.map(order => ({
                id: order.order_id,
                total_price: order.total_price || 0,
                payment_method: order.payment_method || 'N/A',
                status: order.status || 'Unknown',
                address_id: order.address_id,
                address: `${order.street_address}, ${order.province}, ${order.postal_code}, ${order.country}`,
              }))
            : []
        );
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setMessage('✅ Order status updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage('❌ Failed to update order status.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete order');
      }

      setOrders(orders.filter(order => order.id !== orderId));
      setMessage('✅ Order deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting order:', error);
      setMessage('❌ Failed to delete order.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'processing':
        return <FaSync className="status-icon processing" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-order-page">
      <AdminNavbar />
      <div className="admin-order-container">
        <h1>Order Management</h1>
        {message && <div className="message">{message}</div>}
        <div className="card-list">
          {orders.length > 0 ? (
            orders.map(order => (
              <div className="order-card" key={order.id}>
                <div className="card-content">
                  <h2>Order ID: {order.id}</h2>
                  <p><strong>Address ID:</strong> {order.address_id}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Total Price:</strong> ${Number(order.total_price || 0).toFixed(2)}</p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`status ${(order.status || '').toLowerCase()}`}>
                      {getStatusIcon(order.status)} {order.status || 'Unknown'}
                    </span>
                  </p>
                  <p><strong>Payment:</strong> {order.payment_method || 'N/A'}</p>
                  <div className="button-group">
                    <select
                      className="status-select"
                      value={order.status || 'pending'}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No orders available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderPage;
