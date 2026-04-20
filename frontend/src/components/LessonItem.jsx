import React from "react";
import { useNavigate } from "react-router-dom";

function LessonItem({ lesson, index }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lessons/${lesson.id}`)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.9rem 1rem",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        marginBottom: "0.6rem",
        cursor: "pointer",
        backgroundColor: "white",
        transition: "background-color 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f7ff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
    >
      {/* Lesson number badge */}
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#2563eb",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem",
          fontWeight: "700",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>

      {/* Lesson title */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontWeight: "600",
            color: "#1e3a5f",
            fontSize: "0.95rem",
            margin: 0,
          }}
        >
          {lesson.title}
        </p>
      </div>

      {/* Arrow */}
      <span style={{ color: "#9ca3af", fontSize: "1.1rem" }}>›</span>
    </div>
  );
}

export default LessonItem;
