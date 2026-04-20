import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ color: "#1e3a5f", marginBottom: "0.5rem" }}>
          Welcome back, {user?.name} 👋
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          Continue your financial learning journey.
        </p>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {/* Quick links grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {[
          { icon: "📚", label: "Browse Courses", path: "/courses" },
          { icon: "🧮", label: "EMI Calculator", path: "/emi-calculator" },
          { icon: "💰", label: "Budget Planner", path: "/budget-planner" },
          { icon: "📊", label: "My Progress", path: "/progress" },
        ].map((item, i) => (
          <div
            key={i}
            className="card"
            onClick={() => navigate(item.path)}
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            <div style={{ fontSize: "2rem" }}>{item.icon}</div>
            <p
              style={{
                marginTop: "0.5rem",
                fontWeight: "600",
                color: "#1e3a5f",
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
