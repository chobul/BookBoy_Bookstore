import { API_BASE } from '../config';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './ShippingPage.css';
import { FaTruck, FaBoxOpen, FaCheckCircle, FaFileInvoice } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShippingPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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
                address: `${order.street_address}, ${order.province}, ${order.postal_code}, ${order.country}`, // Full address
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

  const getStatusIcon = (status) => {
    if (!status) return null; // Ensure status is defined
    switch (status.toLowerCase()) {
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'processing':
        return <FaBoxOpen className="status-icon processing" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      default:
        return null;
    }
  };

  return (
    <div className="shipping-page">
      <Navbar />
      <div className="shipping-container">
        <h1>Shipping Orders</h1>
        {orders.length === 0 ? (
          <p className="empty-message">No orders found.</p>
        ) : (
          <div className="card-list">
            {orders.map((order) => (
              <div className="shipping-card" key={order.id}>
                <div className="card-content">
                  <h2>Order ID: #{order.id}</h2>
                  <p><strong>Total Price:</strong> ${Number(order.total_price || 0).toFixed(2)}</p>
                  <p><strong>Status:</strong> <span className={`status ${(order.status || '').toLowerCase()}`}>{getStatusIcon(order.status)} {order.status || 'Unknown'}</span></p>
                  <p><strong>Payment Method:</strong> {order.payment_method || 'N/A'}</p>
                  <p><strong>Address:</strong> {order.address}</p> {/* Display full address */}
                  <div className="button-group">
                    <button
                      className="view-details-btn"
                      onClick={() => navigate('/view-order-details', { state: { orderId: order.id } })}
                    >
                      🔍 View Details
                    </button>
                    <button className="invoice-btn">
                      <FaFileInvoice className="invoice-icon" /> Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingPage;
