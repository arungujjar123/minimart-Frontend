import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminOrders from "./pages/AdminOrders";
import Navbar from "./Navbar";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Admin Routes (no navbar) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/add-product" element={<AdminAddProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />

          {/* Regular Routes (with navbar) */}
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                <Home />
              </div>
            }
          />
          <Route
            path="/product/:id"
            element={
              <div>
                <Navbar />
                <ProductDetail />
              </div>
            }
          />
          <Route
            path="/cart"
            element={
              <div>
                <Navbar />
                <Cart />
              </div>
            }
          />
          <Route
            path="/checkout"
            element={
              <div>
                <Navbar />
                <Checkout />
              </div>
            }
          />
          <Route
            path="/orders"
            element={
              <div>
                <Navbar />
                <Orders />
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <div>
                <Navbar />
                <Profile />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div>
                <Navbar />
                <Login />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div>
                <Navbar />
                <Register />
              </div>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
