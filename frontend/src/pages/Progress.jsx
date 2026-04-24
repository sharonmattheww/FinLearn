import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import progressService from "../services/progressService";
import ProgressCard from "../components/ProgressCard";
import Loader from "../components/Loader";

function Progress() {
  const navigate = useNavigate();

  const [data, setData] = useState(null); // { courses, stats, recommended }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const result = await progressService.getAllProgress();
        setData(result.data);
      } catch (err) {
        setError("Failed to load your progress. Please refresh.");
        console.error("Progress fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <Loader message="Loading your progress..." />;

  if (error)
    return (
      <div className="alert alert-error" style={{ marginTop: "2rem" }}>
        {error}
      </div>
    );

  const { courses, stats, recommended } = data;

  // Split courses into three groups for display
  const completedCourses = courses.filter((c) => c.is_complete);
  const inProgressCourses = courses.filter(
    (c) => !c.is_complete && c.completed_lessons > 0,
  );
  const notStartedCourses = courses.filter((c) => c.completed_lessons === 0);

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#1e3a5f", marginBottom: "0.3rem" }}>
          📊 My Progress
        </h1>
        <p style={{ color: "#6b7280" }}>
          Track your learning journey across all FinLearn courses
        </p>
      </div>

      {/* ── Overall Stats Strip ───────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            icon: "📖",
            value: stats.total_lessons_completed,
            label: "Lessons Completed",
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            icon: "🎓",
            value: stats.courses_completed,
            label: "Courses Completed",
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            icon: "🧠",
            value: stats.quizzes_passed,
            label: "Quizzes Passed",
            color: "#7c3aed",
            bg: "#fdf4ff",
          },
          {
            icon: "🔥",
            value: `${stats.overall_percentage}%`,
            label: "Overall Completion",
            color: "#d97706",
            bg: "#fefce8",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: stat.bg,
              borderRadius: "10px",
              padding: "1.1rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "0.3rem" }}>
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#6b7280",
                marginTop: "0.2rem",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Overall Progress Bar ──────────────────────────── */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.6rem",
          }}
        >
          <h3 style={{ color: "#1e3a5f", margin: 0 }}>
            Overall Learning Progress
          </h3>
          <span
            style={{ fontWeight: "800", color: "#2563eb", fontSize: "1.1rem" }}
          >
            {stats.overall_percentage}%
          </span>
        </div>
        <div
          style={{
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            height: "14px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor:
                stats.overall_percentage === 100 ? "#16a34a" : "#2563eb",
              width: `${stats.overall_percentage}%`,
              height: "100%",
              borderRadius: "10px",
              transition: "width 0.8s ease",
              backgroundImage:
                stats.overall_percentage < 100
                  ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                  : "linear-gradient(90deg, #16a34a, #22c55e)",
            }}
          />
        </div>
        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: "0.82rem",
            color: "#6b7280",
          }}
        >
          {stats.total_lessons_completed} of {stats.total_lessons_available}{" "}
          total lessons completed
        </p>
      </div>

      {/* ── Continue Learning Banner ──────────────────────── */}
      {recommended && recommended.next_lesson && (
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            color: "white",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 0.2rem",
                opacity: 0.8,
                fontSize: "0.82rem",
                fontWeight: "600",
              }}
            >
              CONTINUE LEARNING
            </p>
            <p
              style={{
                margin: "0 0 0.2rem",
                fontSize: "1.05rem",
                fontWeight: "700",
              }}
            >
              {recommended.course_title}
            </p>
            <p style={{ margin: 0, opacity: 0.85, fontSize: "0.88rem" }}>
              Next: {recommended.next_lesson.title}
            </p>
          </div>
          <button
            className="btn"
            onClick={() => navigate(`/lessons/${recommended.next_lesson.id}`)}
            style={{
              backgroundColor: "white",
              color: "#1e3a5f",
              padding: "0.6rem 1.4rem",
              fontWeight: "700",
              flexShrink: 0,
            }}
          >
            Resume →
          </button>
        </div>
      )}

      {/* ── All Completed ────────────────────────────────── */}
      {stats.overall_percentage === 100 && (
        <div
          style={{
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            borderRadius: "12px",
            padding: "2rem",
            color: "white",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
          <h2 style={{ margin: "0 0 0.4rem" }}>
            You have completed everything!
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            You have finished all available lessons on FinLearn. Outstanding
            work!
          </p>
        </div>
      )}

      {/* ── In Progress Courses ───────────────────────────── */}
      {inProgressCourses.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              color: "#1e3a5f",
              marginBottom: "1rem",
              fontSize: "1.15rem",
            }}
          >
            🔵 In Progress ({inProgressCourses.length})
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {inProgressCourses.map((course) => (
              <ProgressCard key={course.course_id} courseProgress={course} />
            ))}
          </div>
        </div>
      )}

      {/* ── Completed Courses ─────────────────────────────── */}
      {completedCourses.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              color: "#1e3a5f",
              marginBottom: "1rem",
              fontSize: "1.15rem",
            }}
          >
            ✅ Completed ({completedCourses.length})
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {completedCourses.map((course) => (
              <ProgressCard key={course.course_id} courseProgress={course} />
            ))}
          </div>
        </div>
      )}

      {/* ── Not Started Courses ───────────────────────────── */}
      {notStartedCourses.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              color: "#1e3a5f",
              marginBottom: "1rem",
              fontSize: "1.15rem",
            }}
          >
            ⬜ Not Started ({notStartedCourses.length})
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {notStartedCourses.map((course) => (
              <ProgressCard key={course.course_id} courseProgress={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress;
