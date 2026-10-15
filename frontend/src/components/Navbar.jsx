import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>bookBOY<span></span></h1>
      </div>
      <ul>
        {/* <li><a href="/home#Home">Recomment</a></li> */}
        <li><a href="/home#Products">Products</a></li>
        <li><a href="/favorites#Favorites">Favorites</a></li>
        <li><Link to="/edit-profile">Edit</Link></li>
        <li><a href="/address">Address</a></li> {/* Add Address link */}
        <li><Link to="/cart">Cart</Link></li> {/* Restored Cart link */}
        <li><Link to="/shipping">Shipping</Link></li> {/* Add Shipping link */}
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>

      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="search-btn">
          <i className="fa-solid fa-magnifying-glass"></i> Search
        </button>
      </div>

      <div className="navbar-icons">
        <i className="fa-solid fa-heart"></i>
        <i className="fa-solid fa-cart-shopping"></i> {/* Restored cart icon */}
        <i className="fa-solid fa-user"></i>
      </div>
    </nav>
  );
};

export default Navbar;
