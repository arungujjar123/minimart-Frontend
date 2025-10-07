import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import PromoCarousel from "../components/PromoCarousel";

function Home() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const location = useLocation();

  // Fetch all products on initial load
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vercel-backend-zeta-green.vercel.app/api/products"
        );
        const allProducts = response.data;

        setAllProducts(allProducts);
        setProducts(allProducts); // Show all products initially

        // Create featured products from different categories on client side
        const productsByCategory = {};
        allProducts.forEach((product) => {
          const category = product.category || "Uncategorized";
          if (!productsByCategory[category]) {
            productsByCategory[category] = [];
          }
          productsByCategory[category].push(product);
        });

        // Get one product from each category (max 5)
        const featured = [];
        const categories = Object.keys(productsByCategory);
        const maxProducts = 5;

        for (let i = 0; i < Math.min(categories.length, maxProducts); i++) {
          const category = categories[i];
          const categoryProducts = productsByCategory[category];
          if (categoryProducts && categoryProducts.length > 0) {
            featured.push(categoryProducts[0]);
          }
        }

        // If we have less than 5 products, fill with additional products
        if (
          featured.length < maxProducts &&
          allProducts.length > featured.length
        ) {
          const usedIds = featured.map((p) => p._id);
          const remainingProducts = allProducts.filter(
            (p) => !usedIds.includes(p._id)
          );
          const remainingCount = Math.min(
            maxProducts - featured.length,
            remainingProducts.length
          );

          for (let i = 0; i < remainingCount; i++) {
            featured.push(remainingProducts[i]);
          }
        }

        setFeaturedProducts(featured);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        // Fallback: try to fetch just products if featured endpoint fails
        try {
          const response = await axios.get(
            "https://vercel-backend-zeta-green.vercel.app/api/products"
          );
          setAllProducts(response.data);
          setProducts(response.data);
          setFeaturedProducts(response.data.slice(0, 5)); // Use first 5 as featured
          setLoading(false);
        } catch (fallbackErr) {
          console.error("Error fetching fallback products:", fallbackErr);
          setLoading(false);
        }
      }
    };

    fetchAllProducts();
  }, []);

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
          `https://vercel-backend-zeta-green.vercel.app/api/products/search?q=${encodeURIComponent(
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
            {!searchQuery && <ProductCarousel products={featuredProducts} />}

            <div className="products-grid">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() =>
                    (window.location.href = `/product/${product._id}`)
                  }
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
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
                    style={{ display: product.imageUrl ? "none" : "flex" }}
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
