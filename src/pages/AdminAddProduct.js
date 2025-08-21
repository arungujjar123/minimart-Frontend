import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminAddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Smartphones",
    "Laptops",
    "Audio",
    "Accessories",
    "Wearables",
    "Gaming",
    "Other",
  ];

  const sampleImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Validation
    if (!product.name || !product.price || !product.description) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (parseFloat(product.price) <= 0) {
      alert("Price must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock) || 0,
        imageUrl: product.image || sampleImages[0], // Default image if none provided
      };

      // Remove the old image field
      delete productData.image;

      await axios.post(
        "https://vercel-backend-zeta-green.vercel.app/api/admin/products",
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProduct({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: "",
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 0",
          }}
        >
          <h1 style={{ color: "#333", fontSize: "2rem" }}>
            ➕ Add New Product
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => navigate("/admin/products")}
              className="btn btn-primary"
            >
              📦 All Products
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn btn-success"
            >
              🏠 Dashboard
            </button>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{ marginTop: "2rem", maxWidth: "800px" }}
      >
        <div className="cart-container">
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Product Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  required
                  placeholder="Enter product name"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Price */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  required
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Description *
              </label>
              <textarea
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                required
                placeholder="Enter detailed product description"
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Category
                </label>
                <select
                  value={product.category}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={(e) =>
                    setProduct({ ...product, stock: e.target.value })
                  }
                  placeholder="0"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Image URL
              </label>
              <input
                type="url"
                value={product.image}
                onChange={(e) =>
                  setProduct({ ...product, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />

              {/* Quick Image Options */}
              <div style={{ marginTop: "0.5rem" }}>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                  }}
                >
                  Quick select sample images:
                </p>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {sampleImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setProduct({ ...product, image: img })}
                      style={{
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        background: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Sample {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {product.image && (
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <p
                  style={{
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Preview:
                </p>
                <img
                  src={product.image}
                  alt="Product preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div
                  style={{
                    display: "none",
                    color: "#d9534f",
                    fontStyle: "italic",
                    marginTop: "0.5rem",
                  }}
                >
                  Failed to load image. Please check the URL.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Adding Product..." : "➕ Add Product"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="btn btn-danger"
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                }}
              >
                🔄 Reset Form
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="btn btn-success"
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                }}
              >
                📦 View All Products
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProduct;
