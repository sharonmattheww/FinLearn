import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import progressService from "../services/progressService";
import CourseProgressBar from "../components/CourseProgressBar";
import Loader from "../components/Loader";

function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Progress summary state
  const [progressData, setProgressData] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const result = await progressService.getAllProgress();
        setProgressData(result.data);
      } catch (err) {
        // Silently fail — dashboard still works without progress
        console.error("Dashboard progress fetch error:", err);
      } finally {
        setProgressLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const quickLinks = [
    {
      icon: "📚",
      label: "Browse Courses",
      desc: "Learn budgeting, EMI, saving and more",
      path: "/courses",
      color: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      icon: "💰",
      label: "Budget Planner",
      desc: "Plan your monthly income and expenses",
      path: "/budget-planner",
      color: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      icon: "🧾",
      label: "EMI Calculator",
      desc: "Calculate loan EMI and amortization",
      path: "/emi-calculator",
      color: "#fefce8",
      border: "#fde68a",
    },
    {
      icon: "📊",
      label: "My Progress",
      desc: "Track your learning across all courses",
      path: "/progress",
      color: "#fdf4ff",
      border: "#e9d5ff",
    },
  ];

  // Courses that are in progress (started but not finished)
  const inProgressCourses =
    progressData?.courses?.filter(
      (c) => c.completed_lessons > 0 && !c.is_complete,
    ) || [];

  const stats = progressData?.stats;

  return (
    <div>
      {/* ── Welcome Banner ───────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          borderRadius: "12px",
          padding: "2rem",
          color: "white",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 0.3rem", fontSize: "1.5rem" }}>
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>
            Continue your financial learning journey
          </p>
          {stats && (
            <p
              style={{
                margin: "0.5rem 0 0",
                opacity: 0.75,
                fontSize: "0.85rem",
              }}
            >
              {stats.total_lessons_completed} lessons completed ·{" "}
              {stats.courses_completed} courses finished ·{" "}
              {stats.overall_percentage}% overall
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>

      {/* ── Quick Access Links ────────────────────────────── */}
      <h3 style={{ color: "#1e3a5f", marginBottom: "1rem" }}>Quick Access</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {quickLinks.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            style={{
              backgroundColor: item.color,
              border: `1px solid ${item.border}`,
              borderRadius: "10px",
              padding: "1.1rem",
              cursor: "pointer",
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
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              {item.icon}
            </div>
            <p
              style={{
                margin: "0 0 0.25rem",
                fontWeight: "700",
                color: "#1e3a5f",
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#6b7280",
                lineHeight: "1.4",
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── Continue Learning Section ─────────────────────── */}
      {progressLoading ? (
        <div className="card">
          <Loader message="Loading your progress..." />
        </div>
      ) : inProgressCourses.length > 0 ? (
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ color: "#1e3a5f", margin: 0 }}>Continue Learning</h3>
            <button
              onClick={() => navigate("/progress")}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600",
              }}
            >
              View All →
            </button>
          </div>

          {inProgressCourses.slice(0, 3).map((course) => (
            <div key={course.course_id} style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    color: "#1e3a5f",
                    fontSize: "0.92rem",
                  }}
                >
                  {course.course_title}
                </span>
                {course.next_lesson && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/lessons/${course.next_lesson.id}`)
                    }
                    style={{ fontSize: "0.78rem", padding: "0.25rem 0.7rem" }}
                  >
                    Continue →
                  </button>
                )}
              </div>
              <CourseProgressBar
                courseName={course.course_title}
                completedLessons={course.completed_lessons}
                totalLessons={course.total_lessons}
                percentage={course.percentage}
                isComplete={course.is_complete}
                compact={true}
              />
            </div>
          ))}
        </div>
      ) : (
        progressData && (
          <div
            className="card"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              📚
            </div>
            <h3 style={{ color: "#1e3a5f", marginBottom: "0.4rem" }}>
              Start Your First Course
            </h3>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              You have not started any courses yet. Pick one to begin your
              financial education journey.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/courses")}
            >
              Browse Courses
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;
