import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <div className="form-container">
        <h2>Join MiniMart! 🚀</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
          Create your account to start shopping
        </p>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", color: "#666" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#667eea", textDecoration: "none" }}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
// This page provides a beautiful registration form with validation and feedback.
