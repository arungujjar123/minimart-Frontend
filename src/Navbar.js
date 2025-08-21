import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemCount, clearCart } = useCart();
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");

  // Update search query when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get("search") || "";
    setSearchQuery(search);
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearCart();
    navigate("/login");
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Simple live search - update URL as user types
    if (value.trim()) {
      // Use setTimeout to debounce the navigation
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        navigate(`/?search=${encodeURIComponent(value.trim())}`);
      }, 300);
    } else {
      clearTimeout(window.searchTimeout);
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    clearTimeout(window.searchTimeout); // Clear any pending timeout
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🛒 MiniMart
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products... (live search)"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/cart" className="cart-link">
            Cart 🛒
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
          <Link to="/orders">Orders</Link>
          {token ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-success">
                Register
              </Link>
            </>
          )}

          {/* Admin Access - Always visible */}
          <div className="admin-access-links">
            <Link to="/admin/login" className="btn btn-warning admin-btn">
              Admin Login
            </Link>
            <Link to="/admin/register" className="btn btn-info admin-btn">
              Admin Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
// This is the navigation bar with improved styling and better UX.
