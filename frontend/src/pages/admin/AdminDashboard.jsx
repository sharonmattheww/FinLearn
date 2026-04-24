import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import Loader from "../../components/Loader";
import "../../styles/admin.css";

const STAT_CARDS = [
  {
    key: "total_students",
    icon: "USR",
    label: "Total Students",
    bg: "#eff6ff",
    iconBg: "#dbeafe",
    color: "#1d4ed8",
  },
  {
    key: "total_courses",
    icon: "CRS",
    label: "Total Courses",
    bg: "#f0fdf4",
    iconBg: "#dcfce7",
    color: "#15803d",
  },
  {
    key: "total_lessons",
    icon: "LSN",
    label: "Total Lessons",
    bg: "#fefce8",
    iconBg: "#fef9c3",
    color: "#a16207",
  },
  {
    key: "total_quiz_attempts",
    icon: "QZ",
    label: "Quiz Attempts",
    bg: "#fdf4ff",
    iconBg: "#f3e8ff",
    color: "#7e22ce",
  },
  {
    key: "total_certificates",
    icon: "CERT",
    label: "Certificates Issued",
    bg: "#fff7ed",
    iconBg: "#ffedd5",
    color: "#c2410c",
  },
  {
    key: "total_completions",
    icon: "DONE",
    label: "Lessons Completed",
    bg: "#f0fdf4",
    iconBg: "#dcfce7",
    color: "#15803d",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data.stats);
      } catch {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader message="Loading admin dashboard..." />;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#1e3a5f", marginBottom: "0.3rem" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#6b7280" }}>Manage FinLearn content and users</p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              className="admin-stat-card"
              style={{
                backgroundColor: card.bg,
                border: `1px solid ${card.iconBg}`,
              }}
            >
              <div
                className="admin-stat-icon"
                style={{ backgroundColor: card.iconBg }}
              >
                {card.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "800",
                    color: card.color,
                  }}
                >
                  {stats[card.key]}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    lineHeight: "1.3",
                  }}
                >
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ color: "#1e3a5f", marginBottom: "1rem" }}>
        Management Sections
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          {
            icon: "CRS",
            title: "Course Management",
            desc: "Add, edit, or delete courses and their lessons",
            path: "/admin/courses",
            color: "#2563eb",
          },
          {
            icon: "LSN",
            title: "Lesson Management",
            desc: "Manage lesson content within each course",
            path: "/admin/lessons",
            color: "#16a34a",
          },
          {
            icon: "USR",
            title: "User Management",
            desc: "View all registered students and their progress",
            path: "/admin/users",
            color: "#7c3aed",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="card"
            onClick={() => navigate(item.path)}
            style={{
              cursor: "pointer",
              borderLeft: `4px solid ${item.color}`,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>
              {item.icon}
            </div>
            <h3
              style={{
                color: "#1e3a5f",
                marginBottom: "0.3rem",
                fontSize: "1rem",
              }}
            >
              {item.title}
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: 0 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
