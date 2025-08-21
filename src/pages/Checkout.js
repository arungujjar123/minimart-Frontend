import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

function Checkout() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Show success message if redirected from payment
    if (location.state?.message) {
      // Handle success message if needed
    }

    // Fetch cart to show items before checkout
    axios
      .get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
      });
  }, [navigate, location.state]);

  const calculateTotal = () => {
    return cart.items
      .reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleSimpleCheckout = async () => {
    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Please provide a shipping address");
      return;
    }

    setPaymentLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Create order with simple checkout
      const response = await axios.post(
        "http://localhost:5000/api/payment/simple-checkout",
        {
          shipping_address: shippingAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update cart count
      fetchCartCount();

      // Redirect to orders page with success message
      navigate("/orders", {
        state: {
          message: response.data.message,
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order. Please try again.";
      setError(errorMessage);
      setPaymentLoading(false);
    }
  };

  // Simple checkout without payment (for testing)
  const simpleCheckout = async () => {
    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCartCount();
      navigate("/orders", {
        state: {
          message: "Order placed successfully!",
        },
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Checkout 🛒
      </h2>

      {error && <div className="error-message">{error}</div>}

      {cart.items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart before checkout!</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>
            Order Summary
          </h3>

          {/* Cart Items */}
          {cart.items.map((item) => (
            <div key={item.product?._id || Math.random()} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">
                  {item.product?.name || "Product unavailable"}
                </div>
                <div className="cart-item-quantity">
                  Quantity: {item.quantity}
                </div>
              </div>
              <div className="cart-item-price">
                $
                {item.product?.price
                  ? (item.product.price * item.quantity).toFixed(2)
                  : "N/A"}
              </div>
            </div>
          ))}

          {/* Total */}
          <div
            style={{
              borderTop: "2px solid #e0e0e0",
              paddingTop: "1rem",
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ color: "#333" }}>Total:</h3>
            <h3 style={{ color: "#667eea", fontSize: "1.5rem" }}>
              ${calculateTotal()}
            </h3>
          </div>

          {/* Shipping Address */}
          <div style={{ marginTop: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Shipping Address:
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete shipping address..."
              rows="4"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {/* Payment Options */}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleSimpleCheckout}
              disabled={paymentLoading}
              className="btn btn-primary"
              style={{
                flex: "1",
                minWidth: "200px",
                background: paymentLoading
                  ? "#ccc"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {paymentLoading
                ? "Processing..."
                : "� Place Order (Cash on Delivery)"}
            </button>

            <button
              onClick={simpleCheckout}
              disabled={loading}
              className="btn btn-success"
              style={{
                flex: "1",
                minWidth: "200px",
                background: loading
                  ? "#ccc"
                  : "linear-gradient(135deg, #51cf66 0%, #40c057 100%)",
              }}
            >
              {loading ? "Processing..." : "📦 Simple Checkout"}
            </button>
          </div>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              💳 Razorpay: Secure payment with cards, UPI, netbanking
              <br />
              📦 Simple Checkout: For testing without payment
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => navigate("/cart")}
              className="btn"
              style={{ background: "#f8f9fa", color: "#333" }}
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
// This page handles checkout process with Razorpay payment integration and simple checkout for testing.
