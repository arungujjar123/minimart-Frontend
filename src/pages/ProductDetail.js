import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    axios
      .get(`https://vercel-backend-zeta-green.vercel.app/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(id, quantity);

    if (result.requiresLogin) {
      // Token expired, redirect to login
      navigate("/login");
      return;
    }

    setMessage(result.message);
    setTimeout(() => setMessage(""), 3000);
    setAddingToCart(false);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Product not found</h3>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {message && (
        <div
          className={
            message.includes("🎉") || message.includes("successfully")
              ? "success-message"
              : "error-message"
          }
        >
          {message}
        </div>
      )}

      <div className="product-detail">
        <img
          src={product.imageUrl || product.image}
          alt={product.name}
          className="product-detail-image"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div
          className="product-detail-image-fallback"
          style={{ display: "none" }}
        >
          📱
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-price">${product.price}</div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              min={1}
              max={10}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-success"
              style={{ flex: 1 }}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart 🛒"}
            </button>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
// This page shows detailed product information with improved UX and error handling.
