import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://vercel-backend-zeta-green.vercel.app-zeta-green.vercel.app/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      // Fetch user profile and store in localStorage for navbar
      try {
        const profileRes = await axios.get(
          "https://vercel-backend-zeta-green.vercel.app/api/auth/profile",
          { headers: { Authorization: `Bearer ${response.data.token}` } }
        );
        localStorage.setItem("user", JSON.stringify(profileRes.data));
      } catch {
        localStorage.removeItem("user");
      }

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-page">
      <div className="user-form-container">
        <div className="user-form-header">
          <div className="user-form-icon">👋</div>
          <h2 className="user-form-title">Welcome Back!</h2>
          <p className="user-form-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="user-auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="user-auth-button" disabled={loading}>
            {loading ? "Signing In..." : "🚀 Sign In"}
          </button>
        </form>

        <div className="user-auth-footer">
          <p>Don't have an account?</p>
          <Link to="/register" className="user-link-button">
            Sign up here
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

export default Login;
// This page provides a beautiful login form with error handling and loading states.
