import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === products.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, products.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume auto-play after 8 seconds
  };

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? products.length - 1 : currentIndex - 1,
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === products.length - 1 ? 0 : currentIndex + 1,
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  if (!products || products.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-header">
          <h2>🔥 Featured Products</h2>
          <p>Loading amazing products...</p>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#666",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            margin: "1rem 0",
          }}
        >
          <p>No featured products available at the moment.</p>
          <p>Check back later for amazing deals!</p>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>🔥 Featured Products</h2>
        <p>Discover products from different categories</p>
      </div>

      <div className="carousel-wrapper">
        {/* Main Carousel */}
        <div className="carousel-main">
          <button
            className="carousel-btn carousel-btn-prev"
            onClick={goToPrevious}
          >
            ❮
          </button>

          <div className="carousel-content">
            <Link
              to={`/product/${currentProduct._id}`}
              className="carousel-product-link"
            >
              <div className="carousel-image-container">
                <img
                  src={getProductImage(currentProduct)}
                  alt={currentProduct.name}
                  className="carousel-image"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getCategoryFallback(
                      currentProduct?.category,
                    );
                  }}
                />
                <div
                  className="carousel-image-fallback"
                  style={{ display: "none" }}
                >
                  📱
                </div>
                <div className="carousel-overlay">
                  <span>View Details →</span>
                </div>
              </div>
              <div className="carousel-info">
                <h3>{currentProduct.name}</h3>
                <p>{currentProduct.description}</p>
                {currentProduct.category && (
                  <div
                    className="carousel-category"
                    style={{
                      background: "rgba(231, 111, 81, 0.12)",
                      color: "var(--accent-3)",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      marginBottom: "8px",
                      display: "inline-block",
                    }}
                  >
                    {currentProduct.category}
                  </div>
                )}
                <div className="carousel-price">${currentProduct.price}</div>
              </div>
            </Link>
          </div>

          <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
            ❯
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="carousel-thumbnails">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`carousel-thumbnail ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
            >
              <img
                src={getProductImage(product)}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getCategoryFallback(product?.category);
                }}
              />
              <div className="thumbnail-fallback" style={{ display: "none" }}>
                📱
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {products.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Progress Bar */}
        {isAutoPlaying && (
          <div className="carousel-progress">
            <div
              className="carousel-progress-bar"
              key={currentIndex} // Reset animation on slide change
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCarousel;
