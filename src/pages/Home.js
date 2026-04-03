import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import PromoCarousel from "../components/PromoCarousel";

function Home() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const fallbackImages = {
    electronics:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    smartphone:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    laptop:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    audio:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    accessories:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
    wearables:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80",
    gaming:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    books:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    clothing:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    home: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
    sports:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    beauty:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    automotive:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    default:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  };

  const getCategoryFallback = (category) => {
    const key = (category || "").toLowerCase();

    if (key.includes("phone")) return fallbackImages.smartphone;
    if (key.includes("laptop")) return fallbackImages.laptop;
    if (key.includes("audio") || key.includes("headphone"))
      return fallbackImages.audio;
    if (key.includes("accessor")) return fallbackImages.accessories;
    if (key.includes("wearable") || key.includes("watch"))
      return fallbackImages.wearables;
    if (key.includes("gaming") || key.includes("game"))
      return fallbackImages.gaming;
    if (key.includes("book")) return fallbackImages.books;
    if (key.includes("cloth") || key.includes("fashion"))
      return fallbackImages.clothing;
    if (key.includes("home") || key.includes("garden"))
      return fallbackImages.home;
    if (key.includes("sport") || key.includes("fitness"))
      return fallbackImages.sports;
    if (key.includes("beauty") || key.includes("personal"))
      return fallbackImages.beauty;
    if (key.includes("auto") || key.includes("car"))
      return fallbackImages.automotive;
    if (key.includes("electronic")) return fallbackImages.electronics;

    return fallbackImages.default;
  };

  const getProductImage = (product) =>
    product?.imageUrl ||
    product?.image ||
    getCategoryFallback(product?.category);

  // Fetch all products on initial load
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(
            "https://vercel-backend-zeta-green.vercel.app/api/products",
          ),
          axios
            .get(
              "https://vercel-backend-zeta-green.vercel.app/api/admin/categories",
              {
                headers: {
                  "x-auth-token": localStorage.getItem("adminToken") || "",
                  Authorization: `Bearer ${
                    localStorage.getItem("adminToken") || ""
                  }`,
                },
              },
            )
            .catch(() => ({ data: [] })), // Fallback if no admin access
        ]);

        setAllProducts(productsResponse.data);
        setProducts(productsResponse.data); // Show all products initially

        // Create featured products from different categories on client side
        const allProducts = productsResponse.data;
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
            (p) => !usedIds.includes(p._id),
          );
          const remainingCount = Math.min(
            maxProducts - featured.length,
            remainingProducts.length,
          );

          for (let i = 0; i < remainingCount; i++) {
            featured.push(remainingProducts[i]);
          }
        }

        setFeaturedProducts(featured);
        setCategories(categoriesResponse.data || []);

        // Calculate max price from products
        if (productsResponse.data.length > 0) {
          const maxProductPrice = Math.max(
            ...productsResponse.data.map((p) => p.price),
          );
          setMaxPrice(Math.ceil(maxProductPrice));
          setPriceRange([0, Math.ceil(maxProductPrice)]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Fallback: try to fetch just products if the full request fails
        axios
          .get("https://vercel-backend-zeta-green.vercel.app/api/products")
          .then((res) => {
            setAllProducts(res.data);
            setProducts(res.data);
            setFeaturedProducts(res.data.slice(0, 5)); // Use first 5 as featured
            if (res.data.length > 0) {
              const maxProductPrice = Math.max(...res.data.map((p) => p.price));
              setMaxPrice(Math.ceil(maxProductPrice));
              setPriceRange([0, Math.ceil(maxProductPrice)]);
            }
            setLoading(false);
          })
          .catch((fallbackErr) => {
            console.error("Error fetching fallback products:", fallbackErr);
            setLoading(false);
          });
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
            .includes(selectedCategory.toLowerCase()),
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Apply search filter if there's a search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
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
          `https://vercel-backend-zeta-green.vercel.app/api/products/search?q=${encodeURIComponent(
            query,
          )}`,
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setSearching(false);
      }
    },
    [allProducts],
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
      <div className="container">
        {searchQuery ? (
          <div className="search-results-header">
            <h1>Search Results for "{searchQuery}"</h1>
            {searching && (
              <div
                style={{
                  color: "var(--accent-3)",
                  fontSize: "0.9rem",
                  marginTop: "1rem",
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
                    borderTop: "2px solid var(--accent)",
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
            <div className="homepage-welcome">
              <h1>Welcome to QuickBazaar</h1>
              <p>Discover amazing products at unbeatable prices!</p>
            </div>

            {/* Only show promotional carousel when not searching */}
            <PromoCarousel />
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
              className={`btn btn-outline filter-toggle ${
                showFilters ? "active" : ""
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            {(selectedCategory ||
              priceRange[0] > 0 ||
              priceRange[1] < maxPrice) && (
              <button
                className="btn btn-outline"
                onClick={clearFilters}
                style={{
                  color: "var(--danger)",
                  border: "1px solid var(--danger)",
                }}
              >
                Clear Filters
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
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getCategoryFallback(
                        product?.category,
                      );
                    }}
                  />
                  <div
                    className="product-image-fallback"
                    style={{ display: "none" }}
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
