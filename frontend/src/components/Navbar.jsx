import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">💰 FinLearn</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
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
        <li>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
