import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    // name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    setError("");

    try {
      const response = await axios.post(
        "https://vercel-backend-zeta-green.vercel.app/api/admin/login",
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
    <div className="admin-form-page">
      <div className="admin-form-container">
        <div className="admin-form-header">
          <div className="admin-form-icon">🔐</div>
          <h2 className="admin-form-title">Admin Login</h2>
          <p className="admin-form-subtitle">Access the admin dashboard</p>
        </div>

        {error && <div className="admin-auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              placeholder="admin@minimart.com"
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="admin-auth-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "🚀 Sign In to Dashboard"}
          </button>
        </form>

        <div className="admin-auth-footer">
          <p>Need admin access?</p>
          <button
            onClick={() => navigate("/admin/register")}
            className="admin-link-button"
          >
            Register as Admin
          </button>
        </div>

        <div className="admin-nav-links">
          <button onClick={() => navigate("/")} className="admin-back-button">
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
