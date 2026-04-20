import React from "react";
import { useNavigate } from "react-router-dom";

// Map course titles to emojis for visual identity
const courseEmojis = {
  "Budgeting Basics": "💰",
  "Saving Habits & Emergency Fund": "🏦",
  "Understanding EMI & Loans": "🧾",
  "Credit Score Basics": "📊",
  "Digital Payment Safety & Fraud Awareness": "🔒",
};

function CourseCard({ course }) {
  const navigate = useNavigate();

  const emoji = courseEmojis[course.title] || "📚";

  return (
    <div
      className="card"
      onClick={() => navigate(`/courses/${course.id}`)}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        border: "1px solid #e5e7eb",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
      }}
    >
      {/* Course Icon */}
      <div
        style={{
          fontSize: "2.5rem",
          marginBottom: "0.75rem",
          backgroundColor: "#eff6ff",
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {emoji}
      </div>

      {/* Title */}
      <h3
        style={{
          color: "#1e3a5f",
          marginBottom: "0.5rem",
          fontSize: "1.05rem",
          lineHeight: "1.4",
        }}
      >
        {course.title}
      </h3>

      {/* Description */}
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.88rem",
          lineHeight: "1.5",
          marginBottom: "1rem",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {course.description}
      </p>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #f3f4f6",
          paddingTop: "0.75rem",
          marginTop: "auto",
        }}
      >
        <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
          📖 {course.lesson_count}{" "}
          {course.lesson_count === 1 ? "lesson" : "lessons"}
        </span>
        <span
          style={{
            fontSize: "0.82rem",
            color: "#2563eb",
            fontWeight: "600",
            backgroundColor: "#eff6ff",
            padding: "0.2rem 0.6rem",
            borderRadius: "20px",
          }}
        >
          Start →
        </span>
      </div>
    </div>
  );
}

export default CourseCard;
