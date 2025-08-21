import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const { removeFromCart, updateCartItem, fetchCartCount } = useCart();
  const navigate = useNavigate();

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("https://vercel-backend-zeta-green.vercel.app/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    setUpdatingItems((prev) => new Set([...prev, productId]));
    const result = await removeFromCart(productId);
    if (result.success) {
      setMessage(result.message);
      fetchCart(); // Refresh cart data
    } else {
      setMessage(result.message);
    }
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return handleRemoveFromCart(productId);
    }

    setUpdatingItems((prev) => new Set([...prev, productId]));
    const result = await updateCartItem(productId, newQuantity);
    if (result.success) {
      setMessage(result.message);
      fetchCart(); // Refresh cart data
    } else {
      setMessage(result.message);
    }
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setTimeout(() => setMessage(""), 3000);
  };

  const calculateTotal = () => {
    return cart.items
      .reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const proceedToCheckout = () => {
    if (cart.items.length === 0) {
      setMessage("Your cart is empty");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Your Shopping Cart 🛒
      </h2>

      {message && <div className="success-message">{message}</div>}

      {cart.items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add some amazing products to get started!</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          {cart.items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-quantity">
                  <label>Quantity: </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                      className="quantity-btn"
                      disabled={updatingItems.has(item.product._id)}
                    >
                      -
                    </button>
                    <span
                      style={{
                        minWidth: "30px",
                        textAlign: "center",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                      className="quantity-btn"
                      disabled={updatingItems.has(item.product._id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="cart-item-price">
                ${(item.product.price * item.quantity).toFixed(2)}
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  ${item.product.price} each
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.product._id)}
                className="btn btn-danger"
                disabled={updatingItems.has(item.product._id)}
              >
                {updatingItems.has(item.product._id) ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}

          <div
            style={{
              marginTop: "2rem",
              padding: "1rem 0",
              borderTop: "2px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}
            >
              Total: ${calculateTotal()}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => navigate("/")} className="btn btn-primary">
                Continue Shopping
              </button>
              <button onClick={proceedToCheckout} className="btn btn-success">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
// This page displays the cart with enhanced UI and better functionality.
