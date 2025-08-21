import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import PromoCarousel from "../components/PromoCarousel";

function Home() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  // Fetch all products on initial load
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios
            .get("http://localhost:5000/api/admin/categories", {
              headers: {
                "x-auth-token": localStorage.getItem("adminToken") || "",
                Authorization: `Bearer ${
                  localStorage.getItem("adminToken") || ""
                }`,
              },
            })
            .catch(() => ({ data: [] })), // Fallback if no admin access
        ]);

        setAllProducts(productsResponse.data);
        setProducts(productsResponse.data); // Show all products initially
        setCategories(categoriesResponse.data || []);

        // Calculate max price from products
        if (productsResponse.data.length > 0) {
          const maxProductPrice = Math.max(
            ...productsResponse.data.map((p) => p.price)
          );
          setMaxPrice(Math.ceil(maxProductPrice));
          setPriceRange([0, Math.ceil(maxProductPrice)]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, priceRange, allProducts, searchQuery]);

  // Filter products based on category and price
  const applyFilters = () => {
    let filtered = [...allProducts];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category &&
          product.category
            .toLowerCase()
            .includes(selectedCategory.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply search filter if there's a search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setProducts(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
  };

  // Handle search from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get("search") || "";
    setSearchQuery(search);

    if (search && allProducts.length > 0) {
      performSearch(search);
    } else if (!search && allProducts.length > 0) {
      setProducts(allProducts); // Show all products when no search
    }
  }, [location.search, allProducts]);

  // Debounce function for live search
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Search function
  const performSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setProducts(allProducts);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/search?q=${encodeURIComponent(
            query
          )}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setSearching(false);
      }
    },
    [allProducts]
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading awesome products...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Only show promotional carousel when not searching */}
      {!searchQuery && <PromoCarousel />}

      <div className="container">
        {searchQuery ? (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h1 style={{ color: "#333", marginBottom: "1rem" }}>
              Search Results for "{searchQuery}" 🔍
            </h1>
            {searching && (
              <div
                style={{
                  color: "#667eea",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  className="spinner"
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #f3f3f3",
                    borderTop: "2px solid #667eea",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                Searching...
              </div>
            )}
          </div>
        ) : (
          <>
            <h1
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                color: "#333",
              }}
            >
              Welcome to MiniMart 🛒
            </h1>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "1.1rem",
                marginBottom: "2rem",
              }}
            >
              Discover amazing products at unbeatable prices!
            </p>

            {/* Admin Access Section */}
            <div className="admin-access-banner">
              <div className="admin-banner-content">
                <h3>🔧 Admin Access</h3>
                <p>Manage your store, products, and orders</p>
                <div className="admin-banner-buttons">
                  <Link to="/admin/login" className="btn btn-warning">
                    Admin Login
                  </Link>
                  <Link to="/admin/register" className="btn btn-info">
                    Register as Admin
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Product Filters */}
        <div className="filters-section" style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-outline"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters ? "#667eea" : "transparent",
                color: showFilters ? "white" : "#667eea",
                border: "1px solid #667eea",
              }}
            >
              {showFilters ? "Hide Filters" : "Show Filters"} 🔍
            </button>
            {(selectedCategory ||
              priceRange[0] > 0 ||
              priceRange[1] < maxPrice) && (
              <button
                className="btn btn-outline"
                onClick={clearFilters}
                style={{
                  color: "#e74c3c",
                  border: "1px solid #e74c3c",
                }}
              >
                Clear Filters ✖️
              </button>
            )}
            <span style={{ color: "#666", fontSize: "0.9rem" }}>
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {showFilters && (
            <div
              className="filters-container"
              style={{
                background: "#f8f9fa",
                padding: "1.5rem",
                borderRadius: "8px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                border: "1px solid #e9ecef",
              }}
            >
              {/* Category Filter */}
              <div className="filter-group">
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name} ({category.productCount || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <div style={{ flex: 1 }}>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      style={{ width: "100%" }}
                    />
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      Min: ${priceRange[0]}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      style={{ width: "100%" }}
                    />
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      Max: ${priceRange[1]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? (
              <>
                <h3>No products found</h3>
                <p>
                  Try searching with different keywords or browse all products.
                </p>
                <Link
                  to="/"
                  className="btn btn-primary"
                  style={{ marginTop: "1rem" }}
                >
                  View All Products
                </Link>
              </>
            ) : (
              <>
                <h3>No products available</h3>
                <p>Check back later for amazing deals!</p>
              </>
            )}
          </div>
        ) : (
          <>
            {!searchQuery && <ProductCarousel products={products} />}

            <div className="products-grid">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() =>
                    (window.location.href = `/product/${product._id}`)
                  }
                >
                  {product.imageUrl || product.image ? (
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="product-image-fallback"
                    style={{
                      display:
                        product.imageUrl || product.image ? "none" : "flex",
                    }}
                  >
                    📦
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">
                      {product.description?.length > 100
                        ? product.description.substring(0, 100) + "..."
                        : product.description ||
                          "Great product with amazing features!"}
                    </p>
                    <div className="product-price">${product.price}</div>
                    <div className="product-category">
                      <span className="category-badge">{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
