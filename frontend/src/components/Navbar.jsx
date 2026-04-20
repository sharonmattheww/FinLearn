import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { user, isLoggedIn, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">💰 FinLearn</Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        {isLoggedIn ? (
          // Logged-in navigation
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/budget-planner">Budget Planner</Link>
            </li>
            <li>
              <Link to="/emi-calculator">EMI Calculator</Link>
            </li>
            {user?.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                Hi, {user?.name?.split(" ")[0]}
              </span>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ fontSize: "0.85rem", padding: "0.35rem 0.9rem" }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // Logged-out navigation
          <>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/budget-planner">Budget Planner</Link>
            </li>
            <li>
              <Link to="/emi-calculator">EMI Calculator</Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
