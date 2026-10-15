import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './ViewOrderDetails.css';

const ViewOrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = location.state?.orderId;
      if (!orderId) {
        navigate('/shipping'); // Redirect if no orderId is provided
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        navigate('/shipping'); // Redirect on error
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate]);

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="view-order-details">
      <Navbar />
      <div className="order-details-container">
        <h1>Order Details</h1>
        <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
        <p><strong>Total Price:</strong> ${Number(orderDetails.total_price || 0).toFixed(2)}</p>
        <p><strong>Payment Method:</strong> {orderDetails.payment_method}</p>
        <p><strong>Shipping Address:</strong> {orderDetails.street_address}, {orderDetails.province}, {orderDetails.postal_code}, {orderDetails.country}</p>
        <h2>Items</h2>
        <ul>
          {Array.isArray(orderDetails.items) && orderDetails.items.length > 0 ? (
            orderDetails.items.map((item) => (
              <li key={item.id} className="order-item">
                <img src={item.cover_image} alt={item.title} />
                <div>
                  <p><strong>{item.title}</strong></p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                </div>
              </li>
            ))
          ) : (
            <p>No items found in this order.</p>
          )}
        </ul>
        <button onClick={() => navigate('/shipping')} className="back-btn">Back to Orders</button>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
