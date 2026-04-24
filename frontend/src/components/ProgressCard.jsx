import React from "react";
import { useNavigate } from "react-router-dom";
import CourseProgressBar from "./CourseProgressBar";

const courseEmojis = {
  "Budgeting Basics": "💰",
  "Saving Habits & Emergency Fund": "🏦",
  "Understanding EMI & Loans": "🧾",
  "Credit Score Basics": "📊",
  "Digital Payment Safety & Fraud Awareness": "🔒",
};

function ProgressCard({ courseProgress }) {
  const navigate = useNavigate();

  const {
    course_id,
    course_title,
    course_description,
    total_lessons,
    completed_lessons,
    percentage,
    is_complete,
    next_lesson,
  } = courseProgress;

  const emoji = courseEmojis[course_title] || "📚";

  return (
    <div
      className="card"
      style={{
        border: `1px solid ${is_complete ? "#bbf7d0" : "#e5e7eb"}`,
        background: is_complete ? "#f0fdf4" : "white",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "1.8rem",
            backgroundColor: is_complete ? "#dcfce7" : "#eff6ff",
            width: "52px",
            height: "52px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              color: "#1e3a5f",
              margin: "0 0 0.25rem",
              fontSize: "1rem",
              lineHeight: "1.3",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {course_title}
          </h3>
          <p
            style={{
              color: "#6b7280",
              margin: 0,
              fontSize: "0.82rem",
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course_description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <CourseProgressBar
        courseName={course_title}
        completedLessons={completed_lessons}
        totalLessons={total_lessons}
        percentage={percentage}
        isComplete={is_complete}
      />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid #f3f4f6",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {/* Lesson count */}
        <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
          📖 {completed_lessons}/{total_lessons} lessons
        </span>

        {/* Action Button */}
        {is_complete ? (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              className="btn btn-success"
              onClick={() => navigate(`/courses/${course_id}`)}
              style={{ fontSize: "0.82rem", padding: "0.35rem 0.9rem" }}
            >
              Review Course
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/certificate/${course_id}`)}
              style={{ fontSize: "0.82rem", padding: "0.35rem 0.9rem" }}
            >
              🎓 Certificate
            </button>
          </div>
        ) : next_lesson ? (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/lessons/${next_lesson.id}`)}
            style={{ fontSize: "0.82rem", padding: "0.35rem 0.9rem" }}
          >
            Continue →
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/courses/${course_id}`)}
            style={{ fontSize: "0.82rem", padding: "0.35rem 0.9rem" }}
          >
            Start Course
          </button>
        )}
      </div>
    </div>
  );
}

export default ProgressCard;
