import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import PromoCarousel from "../components/PromoCarousel";

function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products
    axios
      .get("https://vercel-backend-zeta-green.vercel.app/api/products")
      .then((res) => {
        const allProducts = res.data;
        setProducts(allProducts);

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
            // Get the first product from this category
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
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading awesome products...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Promotional Carousel at the top */}
      <PromoCarousel />

      <div className="container">
        <h1
          style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
        >
          Welcome to MiniMart 🛒
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: "1.1rem",
            marginBottom: "3rem",
          }}
        >
          Discover amazing products at unbeatable prices
        </p>

        {products.length === 0 ? (
          <div className="empty-state">
            <h3>No products available</h3>
            <p>Check back later for amazing deals!</p>
          </div>
        ) : (
          <>
            {/* Featured Product Carousel - Show products from different categories */}
            <ProductCarousel products={featuredProducts} />

            {/* All Products Grid */}
            <div style={{ marginTop: "4rem" }}>
              <h2
                style={{
                  textAlign: "center",
                  marginBottom: "2rem",
                  color: "#333",
                }}
              >
                🛍️ All Products
              </h2>
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="product-image-fallback"
                        style={{ display: "none" }}
                      >
                        📱
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">
                          {product.description}
                        </p>
                        <div className="product-price">${product.price}</div>
                        <button
                          className="btn btn-primary"
                          style={{ width: "100%" }}
                        >
                          View Details
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
// This page displays products with a promotional carousel, featured product carousel, and product grid layout.
