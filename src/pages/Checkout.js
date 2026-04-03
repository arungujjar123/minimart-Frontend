/*
 * =====================================================
 * CHECKOUT PAGE - Order Placement
 * =====================================================
 *
 * User yahan se apna order place karta hai
 * Features:
 * - Cart summary dikhaata hai
 * - Shipping address input
 * - Cash on Delivery (COD) checkout
 * - Order confirmation aur redirect to orders page
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

function Checkout() {
  // ============ State Management ============
  const [cart, setCart] = useState({ items: [] }); // User ki cart
  const [loading, setLoading] = useState(false); // Checkout loading state
  const [error, setError] = useState(""); // Error messages
  const [shippingAddress, setShippingAddress] = useState(""); // Delivery address
  const { fetchCartCount } = useCart(); // Cart count update karne ke liye
  const navigate = useNavigate();
  const location = useLocation();

  // ============ Initial Setup ============
  useEffect(() => {
    // Step 1: Check if user logged in hai
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Step 2: Success message check (agar order place hua hai)
    if (location.state?.message) {
      // Handle success message display
    }

    // Step 3: User ki cart fetch karo aur display karo
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

  // ============ Calculate Total Amount ============
  const calculateTotal = () => {
    return cart.items
      .reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // ============ Place Order - Cash on Delivery ============
  const handleCheckout = async () => {
    // Validation: Cart empty nahi honi chahiye
    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    // Validation: Shipping address required hai
    if (!shippingAddress.trim()) {
      setError("Please provide a shipping address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Backend API call - Order create karo
      await axios.post(
        "http://localhost:5000/api/orders/checkout",
        {
          shipping_address: shippingAddress, // Optional: Address backend mein store karne ke liye
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Cart count update karo (cart clear ho gayi hai)
      fetchCartCount();

      // Success: Orders page par redirect karo
      navigate("/orders", {
        state: {
          message:
            "✅ Order placed successfully! You will pay cash on delivery.",
        },
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============ JSX Render ============
  return (
    <div className="container fade-in">
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Checkout
      </h2>

      {/* Error Message Display */}
      {error && (
        <div
          className="error-message"
          style={{
            background: "#fee",
            color: "#c33",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Empty Cart State */}
      {cart.items.length === 0 ? (
        <div
          className="empty-state"
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            background: "#f8f9fa",
            borderRadius: "12px",
          }}
        >
          <h3>Your cart is empty</h3>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Add some products to your cart before checkout!
          </p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>
            Order Summary
          </h3>

          {/* Cart Items Display */}
          {cart.items.map((item) => (
            <div
              key={item.product?._id || Math.random()}
              className="cart-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "#f8f9fa",
                borderRadius: "8px",
                marginBottom: "0.5rem",
              }}
            >
              <div className="cart-item-info">
                <div
                  className="cart-item-name"
                  style={{ fontWeight: "bold", color: "#333" }}
                >
                  {item.product?.name || "Product unavailable"}
                </div>
                <div
                  className="cart-item-quantity"
                  style={{ color: "#666", fontSize: "0.9rem" }}
                >
                  Quantity: {item.quantity}
                </div>
              </div>
              <div
                className="cart-item-price"
                style={{ fontWeight: "bold", color: "var(--accent-3)" }}
              >
                $
                {item.product?.price
                  ? (item.product.price * item.quantity).toFixed(2)
                  : "N/A"}
              </div>
            </div>
          ))}

          {/* Total Amount */}
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
            <h3 style={{ color: "var(--accent-3)", fontSize: "1.5rem" }}>
              ${calculateTotal()}
            </h3>
          </div>

          {/* Shipping Address Input */}
          <div style={{ marginTop: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Shipping Address: <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete shipping address...&#10;Example: House/Flat No., Street, City, State, PIN Code"
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
              required
            />
          </div>

          {/* Place Order Button */}
          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: loading
                  ? "#ccc"
                  : "linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Processing Order..."
                : "Place Order (Cash on Delivery)"}
            </button>
          </div>

          {/* Info Text */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Your order will be delivered to the address provided above.
              <br />
              Payment Method: Cash on Delivery (COD)
              <br />
              You will receive order confirmation on the Orders page.
            </p>
          </div>

          {/* Back to Cart Button */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => navigate("/cart")}
              className="btn"
              style={{
                background: "#f8f9fa",
                color: "#333",
                border: "2px solid #e0e0e0",
              }}
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

/*
 * =====================================================
 * CHECKOUT FLOW SUMMARY:
 * =====================================================
 *
 * 1. User cart se checkout page par aata hai
 * 2. Cart items aur total amount display hota hai
 * 3. User shipping address enter karta hai
 * 4. "Place Order" button click karta hai
 * 5. Backend API call → Order create hota hai
 * 6. Cart clear ho jata hai
 * 7. User orders page par redirect hota hai
 * 8. Payment: Cash on Delivery (COD)
 *
 * Note: Future mein payment gateway integrate kar sakte hain
 * (Razorpay, Stripe, PayPal, etc.)
 *
 * =====================================================
 */
