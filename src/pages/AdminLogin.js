import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        credentials
      );
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "15px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              color: "#333",
              fontSize: "2.5rem",
              marginBottom: "0.5rem",
            }}
          >
            🔐
          </h1>
          <h2 style={{ color: "#333", marginBottom: "0.5rem" }}>Admin Login</h2>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Access the admin dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee",
              border: "1px solid #fcc",
              color: "#d00",
              padding: "0.75rem",
              borderRadius: "5px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              placeholder="admin@minimart.com"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              placeholder="Enter admin password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Logging in..." : "🚀 Login to Dashboard"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            padding: "1rem",
            background: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
            Demo Admin Credentials:
          </h4>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: "0.25rem 0" }}>
            <strong>Email:</strong> admin@minimart.com
          </p>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: "0.25rem 0" }}>
            <strong>Password:</strong> admin123
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            borderTop: "1px solid #e0e0e0",
            paddingTop: "1rem",
          }}
        >
          <p style={{ color: "#666", marginBottom: "0.5rem" }}>
            Need to create an admin account?
          </p>
          <button
            onClick={() => navigate("/admin/register")}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Register as Admin
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
