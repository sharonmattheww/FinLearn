import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "../services/courseService";
import LessonItem from "../components/LessonItem";
import Loader from "../components/Loader";

// Map course titles to emoji for the header banner
const courseEmojis = {
  "Budgeting Basics": "💰",
  "Saving Habits & Emergency Fund": "🏦",
  "Understanding EMI & Loans": "🧾",
  "Credit Score Basics": "📊",
  "Digital Payment Safety & Fraud Awareness": "🔒",
};

function CourseDetail() {
  const { id } = useParams(); // course ID from the URL
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data.course);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Course not found.");
        } else {
          setError("Failed to load course. Please try again.");
        }
        console.error("Fetch course error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <Loader message="Loading course..." />;

  if (error)
    return (
      <div>
        <button
          onClick={() => navigate("/courses")}
          className="btn btn-secondary"
          style={{ marginBottom: "1rem" }}
        >
          ← Back to Courses
        </button>
        <div className="alert alert-error">{error}</div>
      </div>
    );

  const emoji = courseEmojis[course.title] || "📚";

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/courses")}
        style={{
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          fontSize: "0.95rem",
          fontWeight: "600",
          marginBottom: "1rem",
          padding: 0,
        }}
      >
        ← Back to Courses
      </button>

      {/* Course Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          borderRadius: "12px",
          padding: "2rem",
          color: "white",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            fontSize: "3rem",
            backgroundColor: "rgba(255,255,255,0.15)",
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
        <div>
          <h1 style={{ margin: "0 0 0.4rem", fontSize: "1.6rem" }}>
            {course.title}
          </h1>
          <p
            style={{
              margin: 0,
              opacity: 0.85,
              fontSize: "0.95rem",
              lineHeight: "1.5",
            }}
          >
            {course.description}
          </p>
          <p
            style={{ margin: "0.75rem 0 0", opacity: 0.7, fontSize: "0.85rem" }}
          >
            📖 {course.lessons?.length || 0} lessons
          </p>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="card">
        <h2
          style={{ color: "#1e3a5f", marginBottom: "1rem", fontSize: "1.2rem" }}
        >
          Course Lessons
        </h2>

        {course.lessons && course.lessons.length > 0 ? (
          <div>
            {course.lessons.map((lesson, index) => (
              <LessonItem key={lesson.id} lesson={lesson} index={index} />
            ))}
          </div>
        ) : (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "1rem" }}>
            No lessons added to this course yet.
          </p>
        )}
      </div>

      {/* Start Button */}
      {course.lessons && course.lessons.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            className="btn btn-primary"
            style={{ padding: "0.75rem 2.5rem", fontSize: "1rem" }}
            onClick={() => navigate(`/lessons/${course.lessons[0].id}`)}
          >
            Start First Lesson →
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
