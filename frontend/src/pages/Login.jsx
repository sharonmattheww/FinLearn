import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── Frontend Validation ──────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  // ── Form Submit ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(
        formData.email.trim(),
        formData.password,
      );

      loginUser(data.token, data.user);

      // Redirect admin to admin panel, students to dashboard
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "2.5rem auto" }}>
      <div className="card">
        <h2
          className="text-center"
          style={{ color: "#1e3a5f", marginBottom: "0.3rem" }}
        >
          Welcome Back
        </h2>
        <p
          className="text-center"
          style={{
            color: "#6b7280",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          Login to continue your learning
        </p>

        {/* API Error */}
        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && (
              <span style={{ color: "#dc2626", fontSize: "0.82rem" }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <span style={{ color: "#dc2626", fontSize: "0.82rem" }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.7rem",
              fontSize: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="text-center mt-2"
          style={{ fontSize: "0.9rem", color: "#6b7280" }}
        >
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#2563eb", fontWeight: "600" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
