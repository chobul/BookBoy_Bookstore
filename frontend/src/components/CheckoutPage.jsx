import { API_BASE } from '../config';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productFromState = location.state?.product;

  const [formData, setFormData] = useState({
    address: '',
    paymentMethod: 'cod',
  });

  const [message, setMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({ addresses: [] });
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const fetchCart = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (productFromState) {
          const existingProduct = storedCart.find((item) => item.id === productFromState.id);
          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            storedCart.push({ ...productFromState, quantity: 1 });
          }
          localStorage.setItem('cart', JSON.stringify(storedCart));
        }
        setCartItems(storedCart);
      } catch (error) {
        console.error('Error fetching cart:', error.message);
        setMessage('Failed to load cart items.');
      }
    };

    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const addresses = response.data || [];
        setUserInfo({ addresses });

        if (addresses.length > 0) {
          setFormData((prev) => ({ ...prev, address: addresses[0].address_id }));
        }
      } catch (error) {
        console.error('Error fetching addresses:', error.response?.data || error.message);
        setMessage('Failed to fetch addresses.');
      }
    };

    fetchCart();
    fetchAddresses();
  }, [productFromState]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 29;
  const grandTotal = totalPrice + shippingCost;

  const generateQrCode = () => {
    const qrCodeUrl = `https://promptpay.io/0985620617/${grandTotal.toFixed(2)}.png`;
    setQrCodeUrl(qrCodeUrl);
  };

  useEffect(() => {
    if (formData.paymentMethod === 'qr') {
      generateQrCode();
    }
  }, [formData.paymentMethod, grandTotal]);

  const handleAddressChange = (e) => {
    setFormData({ ...formData, address: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!formData.address || !formData.paymentMethod) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      const response = await axios.post(
        `${API_BASE}/api/orders`,
        {
          address_id: formData.address,
          payment_method: formData.paymentMethod,
          total_price: grandTotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.post(
        `${API_BASE}/api/notifications`,
        {
          user_id: userId,
          message: 'ชำระเสร็จสิ้น',
          status: 'unread',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('✅ ชำระเงินสำเร็จ! ขอบคุณสำหรับการสั่งซื้อของคุณ');
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      setMessage('Failed to create order.');
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-left">
            <h2>รายการสินค้า</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id} className="list-order-Checkout">
                  <img src={item.cover_image} alt={item.title} />
                  <div>
                    {item.title} x {item.quantity} - ฿{(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="summary">
              <p>ราคารวมสินค้า: ฿{totalPrice.toFixed(2)}</p>
              <p>ค่าจัดส่ง: ฿{shippingCost}</p>
              <p className="total">รวมทั้งหมด: ฿{grandTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="checkout-right">
            <h2>ข้อมูลลูกค้า</h2>
            <form onSubmit={handleCheckout}>
              <label>ที่อยู่สำหรับจัดส่ง:</label>
              <select
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
              >
                {userInfo.addresses.map((address) => (
                  <option key={address.address_id} value={address.address_id}>
                    {address.street_address}, {address.province}, {address.postal_code}, {address.country}
                  </option>
                ))}
              </select>

              <label>วิธีการชำระเงิน:</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="cod">เก็บเงินปลายทาง</option>
                <option value="qr">QR พร้อมเพย์</option>
              </select>

              {formData.paymentMethod === 'qr' && qrCodeUrl && (
                <div className="qr-instructions">
                  <p>กรุณาแสกน QR code เพื่อชำระเงิน</p>
                  <img src={qrCodeUrl} alt="QR พร้อมเพย์" width="200" height="200" />
                  <p>ยอดชำระ ฿{grandTotal.toFixed(2)}</p>
                </div>
              )}

              <div className="checkout-buttons">
                <button type="button" className="back-btn" onClick={() => navigate('/home')}>
                  กลับไปที่หน้าหลัก
                </button>
                <button type="submit" className="confirm-btn">
                  ยืนยันการชำระเงิน
                </button>
              </div>

              {message && <p className="message">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
