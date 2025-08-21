import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchProducts();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      category: product.category || "",
      stock: product.stock || 0,
    });
  };

  const handleSaveEdit = async (productId) => {
    const token = localStorage.getItem("adminToken");
    try {
      // Prepare the data with correct field names for backend
      const updateData = {
        ...editForm,
        imageUrl: editForm.image, // Convert image to imageUrl
      };
      delete updateData.image; // Remove the old field

      await axios.put(
        `http://localhost:5000/api/admin/products/${productId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setProducts(
        products.map((p) =>
          p._id === productId
            ? {
                ...p,
                ...editForm,
                price: parseFloat(editForm.price),
                stock: parseInt(editForm.stock),
              }
            : p
        )
      );

      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleDelete = async (productId, productName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(products.filter((p) => p._id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: "",
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

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
            📦 Product Management
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="btn btn-success"
            >
              ➕ Add Product
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn btn-primary"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/admin/login");
              }}
              className="btn btn-danger"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "2rem" }}>
        {products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Add your first product to get started!</p>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="btn btn-primary"
            >
              ➕ Add Product
            </button>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        style={{
                          display: "none",
                          width: "60px",
                          height: "60px",
                          background: "#f0f0f0",
                          borderRadius: "8px",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                        }}
                      >
                        📦
                      </div>
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          style={{ width: "100%", padding: "0.25rem" }}
                        />
                      ) : (
                        <div>
                          <strong>{product.name}</strong>
                          <br />
                          <small style={{ color: "#666" }}>
                            {product.description?.substring(0, 50)}...
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                          style={{ width: "80px", padding: "0.25rem" }}
                        />
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                          style={{ width: "100px", padding: "0.25rem" }}
                        />
                      ) : (
                        product.category || "Uncategorized"
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input
                          type="number"
                          value={editForm.stock}
                          onChange={(e) =>
                            setEditForm({ ...editForm, stock: e.target.value })
                          }
                          style={{ width: "60px", padding: "0.25rem" }}
                        />
                      ) : (
                        <span
                          style={{
                            color:
                              (product.stock || 0) < 10 ? "#d9534f" : "#5cb85c",
                          }}
                        >
                          {product.stock || 0}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => handleSaveEdit(product._id)}
                            className="btn btn-success"
                            style={{
                              fontSize: "0.8rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            ✅ Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="btn btn-danger"
                            style={{
                              fontSize: "0.8rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => handleEdit(product)}
                            className="btn btn-primary"
                            style={{
                              fontSize: "0.8rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product._id, product.name)
                            }
                            className="btn btn-danger"
                            style={{
                              fontSize: "0.8rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
