import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const navigate = useNavigate();

  const orderStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const statusColors = {
    pending: "#ffc107",
    confirmed: "#28a745",
    processing: "#17a2b8",
    shipped: "#6f42c1",
    delivered: "#28a745",
    cancelled: "#dc3545",
  };

  useEffect(() => {
    checkAdminAuth();
    fetchOrders();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(
        "https://vercel-backend-zeta-green.vercel.app/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    const token = localStorage.getItem("adminToken");

    try {
      await axios.put(
        `https://vercel-backend-zeta-green.vercel.app/api/admin/orders/${orderId}`,
        { order_status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, order_status: newStatus } : order
        )
      );

      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading orders...</div>
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
            🛍️ Order Management
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
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
        {/* Order Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div className="admin-stat-card">
            <h4>Total Orders</h4>
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#667eea",
              }}
            >
              {orders.length}
            </p>
          </div>
          <div className="admin-stat-card">
            <h4>Pending Orders</h4>
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#ffc107",
              }}
            >
              {
                orders.filter(
                  (o) => o.order_status === "pending" || !o.order_status
                ).length
              }
            </p>
          </div>
          <div className="admin-stat-card">
            <h4>Delivered Orders</h4>
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#28a745",
              }}
            >
              {orders.filter((o) => o.order_status === "delivered").length}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders found</h3>
            <p>Orders will appear here when customers make purchases.</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {orders.map((order) => (
              <div key={order._id} className="cart-container">
                {/* Order Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <div>
                    <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>
                      {formatDate(order.createdAt)}
                    </p>
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>
                      Customer:{" "}
                      {order.user?.name || order.user?.email || "Unknown"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#667eea",
                        marginBottom: "0.5rem",
                      }}
                    >
                      ${(order.total_amount || order.total || 0).toFixed(2)}
                    </div>

                    {/* Status Selector */}
                    <select
                      value={order.order_status || "pending"}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      disabled={updatingOrder === order._id}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        background:
                          statusColors[order.order_status || "pending"],
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>

                    {updatingOrder === order._id && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#667eea",
                          marginTop: "0.25rem",
                        }}
                      >
                        Updating...
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 style={{ color: "#333", marginBottom: "1rem" }}>
                    Order Items:
                  </h4>
                  {order.items
                    .filter((item) => item.product) // Filter out items with null products
                    .map((item, index) => (
                      <div
                        key={item.product._id || index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.75rem",
                          background: "#f8f9fa",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            style={{
                              display: "none",
                              width: "50px",
                              height: "50px",
                              background: "#e9ecef",
                              borderRadius: "5px",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.2rem",
                            }}
                          >
                            📦
                          </div>
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              {item.product?.name ||
                                "Product no longer available"}
                            </div>
                            <div style={{ color: "#666", fontSize: "0.9rem" }}>
                              Quantity: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight: "bold", color: "#667eea" }}>
                          $
                          {item.product?.price
                            ? (item.product.price * item.quantity).toFixed(2)
                            : "N/A"}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Payment & Delivery Info */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <strong>Payment Method:</strong>
                    <br />
                    {order.payment_method || "Cash on Delivery"}
                  </div>
                  <div>
                    <strong>Payment Status:</strong>
                    <br />
                    <span
                      style={{
                        color:
                          order.payment_status === "paid"
                            ? "#28a745"
                            : "#ffc107",
                      }}
                    >
                      {order.payment_status || "pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
