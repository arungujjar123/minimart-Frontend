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
        "https://vercel-backend-zeta-green.vercel.app/api/auth/login",
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
    <div className="container fade-in">
      <div className="form-container">
        <h2>Welcome Back! 👋</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
          Sign in to your account
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", color: "#666" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#667eea", textDecoration: "none" }}
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
// This page provides a beautiful login form with error handling and loading states.
