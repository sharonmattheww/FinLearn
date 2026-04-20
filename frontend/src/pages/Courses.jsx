import React, { useState, useEffect } from "react";
import courseService from "../services/courseService";
import CourseCard from "../components/CourseCard";
import Loader from "../components/Loader";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data.courses);
      } catch (err) {
        setError("Failed to load courses. Please refresh the page.");
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // empty array = run once when component mounts

  // ── Loading State ────────────────────────────────────────────
  if (loading) return <Loader message="Loading courses..." />;

  // ── Error State ──────────────────────────────────────────────
  if (error)
    return (
      <div className="alert alert-error" style={{ marginTop: "2rem" }}>
        {error}
      </div>
    );

  // ── Empty State ──────────────────────────────────────────────
  if (courses.length === 0)
    return (
      <div className="card text-center">
        <p style={{ color: "#6b7280" }}>
          No courses available yet. Check back soon!
        </p>
      </div>
    );

  // ── Main Render ──────────────────────────────────────────────
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#1e3a5f", marginBottom: "0.4rem" }}>
          📚 All Courses
        </h1>
        <p style={{ color: "#6b7280" }}>
          {courses.length} courses available — click any course to start
          learning
        </p>
      </div>

      {/* Course Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default Courses;
