import React, { useState } from "react";
// import "./admin-register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        secretKey: formData.secretKey,
      };

      console.log("Sending admin registration data:", requestData);
      console.log("Secret key being sent:", JSON.stringify(formData.secretKey));

      const response = await axios.post(
        "https://vercel-backend-zeta-green.vercel.app/api/admin/register",
        requestData
      );

      if (response.data.success) {
        // Show success message
        setSuccess(
          "Admin account created successfully! Redirecting to dashboard..."
        );

        // Store the admin token
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminInfo", JSON.stringify(response.data.admin));

        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-container">
        <div className="admin-form-header">
          <div className="admin-form-icon">👥</div>
          <h2 className="admin-form-title">Admin Registration</h2>
          <p className="admin-form-subtitle">Create a new admin account</p>
        </div>

        {error && <div className="admin-auth-error">{error}</div>}
        {success && <div className="admin-success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="admin-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <div className="admin-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="admin-form-group">
            <label>Admin Secret Key</label>
            <input
              type="password"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              required
              placeholder="Enter admin secret key"
            />
            <small className="secret-key-hint">
              Contact your system administrator for the secret key
            </small>
          </div>

          <button
            type="submit"
            className="admin-auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "🚀 Register as Admin"}
          </button>
        </form>

        <div className="admin-auth-footer">
          <p>Already have an admin account?</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="admin-link-button"
          >
            Login Here
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

export default AdminRegister;
