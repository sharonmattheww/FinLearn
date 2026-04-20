import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Form field state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form field on every keystroke
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── Frontend Validation ──────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // ── Form Submit ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Run frontend validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
      );

      // Save token and user to context + localStorage
      loginUser(data.token, data.user);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      // err.response.data.message comes from our Express error responses
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "440px", margin: "2.5rem auto" }}>
      <div className="card">
        <h2
          className="text-center"
          style={{ color: "#1e3a5f", marginBottom: "0.3rem" }}
        >
          Create Account
        </h2>
        <p
          className="text-center"
          style={{
            color: "#6b7280",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          Join FinLearn and start your financial learning journey
        </p>

        {/* API Error Message */}
        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && (
              <span style={{ color: "#dc2626", fontSize: "0.82rem" }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              disabled={loading}
            />
            {errors.password && (
              <span style={{ color: "#dc2626", fontSize: "0.82rem" }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span style={{ color: "#dc2626", fontSize: "0.82rem" }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Button */}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p
          className="text-center mt-2"
          style={{ fontSize: "0.9rem", color: "#6b7280" }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: "600" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
