import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchDashboardStats();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  };

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Safely extract stats and recentOrders from response
      const { stats: responseStats, recentOrders } = response.data;

      setStats({
        totalProducts: responseStats?.totalProducts || 0,
        totalOrders: responseStats?.totalOrders || 0,
        totalUsers: responseStats?.totalUsers || 0,
        totalRevenue: responseStats?.totalRevenue || 0,
        pendingOrders: responseStats?.pendingOrders || 0,
        recentOrders: recentOrders || [],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        // Set default values on error to prevent crashes
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          recentOrders: [],
        });
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
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
            🔧 Admin Dashboard
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button onClick={() => navigate("/")} className="btn btn-success">
              🏠 View Store
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "2rem" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div className="admin-stat-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📦</div>
            <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>
              Total Products
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}
            >
              {stats.totalProducts || 0}
            </p>
          </div>

          <div className="admin-stat-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🛍️</div>
            <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>
              Total Orders
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}
            >
              {stats.totalOrders || 0}
            </p>
          </div>

          <div className="admin-stat-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>👥</div>
            <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>
              Total Users
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}
            >
              {stats.totalUsers || 0}
            </p>
          </div>

          <div className="admin-stat-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⏳</div>
            <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>
              Pending Orders
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#f39c12" }}
            >
              {stats.pendingOrders || 0}
            </p>
          </div>

          <div className="admin-stat-card">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>💰</div>
            <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>
              Total Revenue
            </h3>
            <p
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}
            >
              ${(stats.totalRevenue || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#333", marginBottom: "1.5rem" }}>
            🚀 Quick Actions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => navigate("/admin/products")}
              className="admin-action-btn"
            >
              📦 Manage Products
            </button>
            <button
              onClick={() => navigate("/admin/orders")}
              className="admin-action-btn"
            >
              🛍️ View Orders
            </button>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="admin-action-btn"
            >
              ➕ Add Product
            </button>
            <button
              onClick={() => navigate("/admin/categories")}
              className="admin-action-btn"
            >
              🏷️ Categories
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 style={{ color: "#333", marginBottom: "1.5rem" }}>
            📋 Recent Orders
          </h2>
          {!stats.recentOrders || stats.recentOrders.length === 0 ? (
            <div className="empty-state">
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id || Math.random()}>
                      <td>
                        #{(order._id || "UNKNOWN").slice(-6).toUpperCase()}
                      </td>
                      <td>
                        {order.user?.name ||
                          order.user?.email ||
                          "Unknown Customer"}
                      </td>
                      <td>
                        $
                        {(
                          order.totalAmount ||
                          order.total_amount ||
                          order.total ||
                          0
                        ).toFixed(2)}
                      </td>
                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Unknown Date"}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            order.status || order.order_status || "pending"
                          }`}
                        >
                          {(order.status || order.order_status || "Pending")
                            .charAt(0)
                            .toUpperCase() +
                            (
                              order.status ||
                              order.order_status ||
                              "pending"
                            ).slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
