import { API_BASE } from '../config';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './AddressPage.css';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street_address: '',
    province: '',
    postal_code: '',
    country: '',
  });
  const [message, setMessage] = useState('');
  const [editAddress, setEditAddress] = useState(null); // State for editing address

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error.response || error.message);
        setMessage('Failed to fetch addresses.');
      }
    };

    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    const { street_address, province, postal_code, country } = newAddress;

    if (!street_address || !province || !postal_code || !country) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE}/api/address`,
        { street_address, province, postal_code, country }, // Match the provided request body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses([...addresses, response.data.address]);
      setMessage('Address added successfully!');
      setNewAddress({ street_address: '', province: '', postal_code: '', country: '' });
      setIsModalOpen(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add address.');
    }
  };

  const handleEditAddress = async () => {
    const { street_address, province, postal_code, country } = editAddress;

    if (!street_address || !province || !postal_code || !country) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/api/address/${editAddress.address_id}`,
        { street_address, province, postal_code, country },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses(
        addresses.map((address) =>
          address.address_id === editAddress.address_id ? editAddress : address
        )
      );
      setMessage('Address updated successfully!');
      setEditAddress(null);
      setIsModalOpen(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(addresses.filter((address) => address.address_id !== id));
      setMessage('Address deleted successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete address.');
    }
  };

  return (
    <div className="address-page">
      <Navbar />
      <div className="address-container">
        <h1>Your Addresses</h1>
        {message && <p className="message">{message}</p>}
        <div className="address-list">
          {addresses.map((address) => (
            <div key={address.address_id} className="address-card">
              <p><strong>Street:</strong> {address.street_address}</p>
              <p><strong>Province:</strong> {address.province}</p>
              <p><strong>Postal Code:</strong> {address.postal_code}</p>
              <p><strong>Country:</strong> {address.country}</p>
              <div className="address-actions">
                <button onClick={() => {
                  setEditAddress(address);
                  setIsModalOpen(true);
                }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteAddress(address.address_id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="add-address-btn" onClick={() => setIsModalOpen(true)}>
          Add Address
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <h2>{editAddress ? 'Edit Address' : 'Add Address'}</h2>
            <input
              type="text"
              placeholder="Street Address"
              value={editAddress ? editAddress.street_address : newAddress.street_address}
              onChange={(e) =>
                editAddress
                  ? setEditAddress({ ...editAddress, street_address: e.target.value })
                  : setNewAddress({ ...newAddress, street_address: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Province"
              value={editAddress ? editAddress.province : newAddress.province}
              onChange={(e) =>
                editAddress
                  ? setEditAddress({ ...editAddress, province: e.target.value })
                  : setNewAddress({ ...newAddress, province: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={editAddress ? editAddress.postal_code : newAddress.postal_code}
              onChange={(e) =>
                editAddress
                  ? setEditAddress({ ...editAddress, postal_code: e.target.value })
                  : setNewAddress({ ...newAddress, postal_code: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              value={editAddress ? editAddress.country : newAddress.country}
              onChange={(e) =>
                editAddress
                  ? setEditAddress({ ...editAddress, country: e.target.value })
                  : setNewAddress({ ...newAddress, country: e.target.value })
              }
            />
            <button onClick={editAddress ? handleEditAddress : handleAddAddress}>
              {editAddress ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
