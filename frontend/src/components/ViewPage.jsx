import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // เพิ่มการนำเข้า axios
import Navbar from './Navbar'; // นำเข้า Navbar
import './ViewPage.css';

const ViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id: 0,
    title: 'Unknown Product',
    author: 'Unknown Author',
    description: 'No description available.',
    price: 0.0,
    image: '/src/img/default.png',
  });
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]); // Ensure reviews is initialized as an array
  const [newReview, setNewReview] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = location.state?.product?.id;
      if (productId) {
        try {
          const response = await fetch(`${API_BASE}/api/books/${productId}`);
          if (response.ok) {
            const data = await response.json();
            setProduct({
              ...data,
              image: data.cover_image.startsWith('http')
                ? data.cover_image
                : `${API_BASE}${data.cover_image}`,
            });
          } else {
            console.error('Failed to fetch product details');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };

    fetchProduct();
  }, [location.state]);

  useEffect(() => {
    const fetchReviews = async () => {
      const productId = location.state?.product?.id; // Ensure `productId` is defined
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      if (!token) {
        console.error('Unauthorized: No token found. Please log in.');
        setMessage('You need to log in to view reviews.');
        return;
      }

      if (productId) {
        try {
          const response = await axios.get(`${API_BASE}/api/reviews/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          });

          if (Array.isArray(response.data)) {
            setReviews(response.data); // Ensure the response is an array of reviews
          } else {
            console.error('Unexpected response format:', response.data);
            setReviews([]); // Fallback to an empty array
          }
        } catch (error) {
          console.error('Error fetching reviews:', error.response?.data?.message || error.message || error);
          if (error.response?.status === 401) {
            setMessage('Unauthorized: Please log in to view reviews.');
          } else {
            setMessage('Failed to fetch reviews.');
          }
          setReviews([]); // Fallback to an empty array
        }
      }
    };

    fetchReviews();
  }, [location.state]);

  const recommendedProducts = [
    { id: 2, name: 'ONE PIECE 104', price: 120.0, image: '/src/img/3.png' },
    { id: 3, name: 'SAKAMOTO DAYS 1', price: 140.0, image: '/src/img/5.png' },
    { id: 4, name: 'JUJUTSU KAISEN 28', price: 180.0, image: '/src/img/7.png' },
    { id: 5, name: 'KAIJU NO.8 12', price: 220.0, image: '/src/img/9.png' },
  ];

  const handleAddToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProduct = cart.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      setMessage(`${product.title} added to cart!`);
      setTimeout(() => setMessage(''), 500);
    } catch (error) {
      setMessage('Failed to add to cart.');
    }
  };

  const handleAddToFavorites = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const isFavorite = favorites.some((item) => item.id === product.id);

      if (!isFavorite) {
        await axios.post(
          `${API_BASE}/api/favorites/${product.id}`, // ✅ ใส่ bookId ใน path ตาม backend
          {}, // body ว่าง
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setMessage(`${product.title} added to favorites!`);
      } else {
        setMessage(`${product.title} is already in your favorites.`);
      }

      setTimeout(() => setMessage(''), 500);
    } catch (error) {
      console.error('Error adding to favorites:', error.response || error.message);
      if (error.response?.status === 400) {
        setMessage('This book is already in your favorites.');
      } else if (error.response?.status === 401) {
        setMessage('You need to login to add favorites.');
      } else {
        setMessage('Failed to add to favorites.');
      }
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product } });
  };

  const handleReviewSubmit = async () => {
    const productId = location.state?.product?.id;
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
      setMessage('You need to log in to submit a review.');
      return;
    }

    if (productId && newReview.trim()) {
      try {
        const response = await axios.post(
          `${API_BASE}/api/reviews/${productId}`,
          { comment: newReview }, // Use `comment` as per reviewController
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (response.status === 201) {
          setReviews([...reviews, response.data.review]); // Append the new review
          setNewReview('');
          setMessage('Review submitted successfully!');
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        if (error.response?.status === 401) {
          setMessage('Unauthorized: Please log in to submit a review.');
        } else {
          setMessage('Failed to submit review.');
        }
      }
    }
  };

  return (
    <div className="view-page">
      <Navbar /> 
      
      <div className="product-details">
        <div className="product-card">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="product-info">
          <h1>{product.title}</h1>
          <h3>by {product.author}</h3>
          <p>{product.description}</p>
          <h2>${(product.price ?? 0).toFixed(2)}</h2>
          <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
          <button className="favorite-btn" onClick={() => handleAddToFavorites(product)}>Favorite</button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      {/* Review Section */}
      <div className="review-section">
        <h2>Reviews</h2>
        <div className="reviews">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review">
                <p>{review.comment}</p> {/* Ensure the field matches the backend response */}
                <small>By: {review.username}</small> {/* Ensure the field matches the backend response */}
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review here..."
        ></textarea>
        <button className="submit-review-btn" onClick={handleReviewSubmit}>
          Submit Review
        </button>
      </div>

      {/* Recommended Products */}
      <div className="recommended-products">
        <h2>Recommended Products</h2>
        <div className="recommended-grid">
          {recommendedProducts.map((item) => (
            <div className="recommended-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
              <button className="view-btn">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
