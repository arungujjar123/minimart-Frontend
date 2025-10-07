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
      await axios.post(
        "https://vercel-backend-zeta-green.vercel.app/api/auth/register",
        {
          email,
          password,
        }
      );

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
    <div className="user-form-page">
      <div className="user-form-container">
        <div className="user-form-header">
          <div className="user-form-icon">🚀</div>
          <h2 className="user-form-title">Join MiniMart!</h2>
          <p className="user-form-subtitle">
            Create your account to start shopping
          </p>
        </div>

        {error && <div className="user-auth-error">{error}</div>}
        {success && <div className="user-success-message">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="user-form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="user-form-group">
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

          <div className="user-form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="user-auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "🎉 Create Account"}
          </button>
        </form>

        <div className="user-auth-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="user-link-button">
            Sign in here
          </Link>
        </div>

        <div className="user-nav-links">
          <Link to="/" className="user-back-button">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
// This page provides a beautiful registration form with validation and feedback.
