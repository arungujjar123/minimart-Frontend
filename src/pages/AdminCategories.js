import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminCategories() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      productCount: 0,
    },
    {
      id: 2,
      name: "Clothing",
      description: "Fashion and apparel",
      productCount: 0,
    },
    {
      id: 3,
      name: "Books",
      description: "Books and educational materials",
      productCount: 0,
    },
    {
      id: 4,
      name: "Home",
      description: "Home and garden items",
      productCount: 0,
    },
    {
      id: 5,
      name: "Sports",
      description: "Sports and fitness equipment",
      productCount: 0,
    },
    {
      id: 6,
      name: "Beauty",
      description: "Beauty and personal care",
      productCount: 0,
    },
    {
      id: 7,
      name: "Automotive",
      description: "Car and automotive accessories",
      productCount: 0,
    },
    { id: 8, name: "Toys", description: "Toys and games", productCount: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchCategoryStats();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  };

  const fetchCategoryStats = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(
        "https://vercel-backend-zeta-green.vercel.app/api/admin/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const products = response.data;
      const categoryStats = {};

      // Count products per category
      products.forEach((product) => {
        const category = product.category || "Uncategorized";
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });

      // Update categories with product counts
      setCategories((prevCategories) =>
        prevCategories.map((cat) => ({
          ...cat,
          productCount: categoryStats[cat.name] || 0,
        }))
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const newCat = {
        id: Date.now(),
        name: newCategory.name.trim(),
        description:
          newCategory.description.trim() || `${newCategory.name} products`,
        productCount: 0,
      };
      setCategories([...categories, newCat]);
      setNewCategory({ name: "", description: "" });
      setShowAddForm(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
  };

  const handleUpdateCategory = (id, updatedName, updatedDescription) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id
          ? { ...cat, name: updatedName, description: updatedDescription }
          : cat
      )
    );
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1 style={{ color: "#333", margin: 0 }}>🏷️ Category Management</h1>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="btn btn-primary"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/products")}
            className="btn btn-info"
          >
            📦 Products
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Add Category Section */}
        <div className="admin-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2>Categories Overview</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-success"
            >
              {showAddForm ? "Cancel" : "➕ Add Category"}
            </button>
          </div>

          {showAddForm && (
            <div className="admin-form-card" style={{ marginBottom: "2rem" }}>
              <h3>Add New Category</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="form-input"
                />
              </div>
              <button onClick={handleAddCategory} className="btn btn-success">
                Add Category
              </button>
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="admin-categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="admin-category-card">
              {editingCategory === category.id ? (
                <EditCategoryForm
                  category={category}
                  onSave={handleUpdateCategory}
                  onCancel={() => setEditingCategory(null)}
                />
              ) : (
                <>
                  <div className="category-header">
                    <h3>{category.name}</h3>
                    <div className="category-actions">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="btn btn-sm btn-info"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="btn btn-sm btn-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="category-description">{category.description}</p>
                  <div className="category-stats">
                    <span className="product-count">
                      {category.productCount} product
                      {category.productCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Edit Category Form Component
function EditCategoryForm({ category, onSave, onCancel }) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);

  const handleSave = () => {
    if (name.trim()) {
      onSave(category.id, name.trim(), description.trim());
    }
  };

  return (
    <div className="edit-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-input"
        style={{ marginBottom: "0.5rem" }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-input"
        style={{ marginBottom: "1rem", minHeight: "60px" }}
        placeholder="Category description"
      />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleSave} className="btn btn-sm btn-success">
          ✅ Save
        </button>
        <button onClick={onCancel} className="btn btn-sm btn-danger">
          ❌ Cancel
        </button>
      </div>
    </div>
  );
}

export default AdminCategories;
