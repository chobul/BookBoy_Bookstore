import { API_BASE } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Added state for search term
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/books`);
        setProducts(response.data);
      } catch (error) {
        setMessage('Failed to fetch products.');
      }
    };

    fetchBooks();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filter products based on search term

  const handleAddToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProduct = cart.find((item) => item.id === product.id);

      if (!existingProduct) {
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        setMessage(`${product.title} added to cart!`);
      } else {
        setMessage(`${product.title} is already in the cart.`);
      }

      setTimeout(() => setMessage(''), 1000);
    } catch {
      setMessage('Failed to add to cart.');
    }
  };

  return (
    <div className="products" id="Products">
      <h1>PRODUCTS</h1>
      {message && <p className="message">{message}</p>}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>
      <div className="box">
        {filteredProducts.map((product) => (
          <div
            className="card"
            key={product.id}
            onClick={() => navigate('/viewpage', { state: { product } })}
            style={{ cursor: 'pointer' }}
          >
            <div className="image">
              <img
                src={
                  product.cover_image.startsWith('http')
                    ? product.cover_image
                    : `${API_BASE}${product.cover_image}`
                }
                alt={`Product ${product.id}`}
              />
            </div>
            <div className="products_text">
              <h2>{product.title}</h2>
              <p>{product.author}</p>
              <h3>${product.price?.toFixed(2) || 'N/A'}</h3>
              <div className="products_star">
                {[...Array(5)].map((_, starIndex) => (
                  <i
                    key={starIndex}
                    className={`fa-solid ${starIndex < 4 ? 'fa-star' : 'fa-star-half-stroke'}`}
                  ></i>
                ))}
              </div>
              <button
                className="btn cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
