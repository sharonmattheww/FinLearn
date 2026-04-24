import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import adminService from "../../services/adminService";
import AdminLessonForm from "../../components/AdminLessonForm";
import Loader from "../../components/Loader";
import "../../styles/admin.css";

function AdminLessons() {
  const location = useLocation();

  // Course may be pre-selected if navigated from AdminCourses
  const preselected = location.state;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(
    preselected?.courseId || "",
  );
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [actionLoad, setActionLoad] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editLesson, setEditLesson] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await adminService.getAllCourses();
        setCourses(data.courses);
      } catch {
        setError("Failed to load courses.");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      return;
    }

    const loadLessons = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminService.getLessonsByCourse(selectedCourse);
        setLessons(data.lessons);
      } catch {
        setError("Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [selectedCourse]);

  const fetchLessons = async (courseId) => {
    setLoading(true);
    setError("");
    try {
      const data = await adminService.getLessonsByCourse(courseId);
      setLessons(data.lessons);
    } catch {
      setError("Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSave = async (courseId, title, content, orderNumber) => {
    setActionLoad(true);
    setError("");
    try {
      if (editLesson) {
        await adminService.updateLesson(
          editLesson.id,
          title,
          content,
          orderNumber,
        );
        showSuccess("Lesson updated successfully");
      } else {
        await adminService.createLesson(courseId, title, content, orderNumber);
        showSuccess("Lesson created successfully");
      }
      setShowForm(false);
      setEditLesson(null);
      fetchLessons(selectedCourse);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save lesson.");
    } finally {
      setActionLoad(false);
    }
  };

  const handleDelete = async (lesson) => {
    const confirmed = window.confirm(
      `Delete lesson "${lesson.title}"?\n\nThis will also delete related quiz data and student progress for this lesson.`,
    );
    if (!confirmed) return;

    setActionLoad(true);
    try {
      await adminService.deleteLesson(lesson.id);
      showSuccess("Lesson deleted successfully");
      fetchLessons(selectedCourse);
    } catch {
      setError("Failed to delete lesson.");
    } finally {
      setActionLoad(false);
    }
  };

  const selectedCourseTitle =
    courses.find((course) => String(course.id) === String(selectedCourse))
      ?.title || "";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h1 style={{ color: "#1e3a5f", margin: "0 0 0.2rem" }}>
            Lesson Management
          </h1>
          {selectedCourseTitle && (
            <p
              style={{
                color: "#2563eb",
                margin: 0,
                fontSize: "0.88rem",
                fontWeight: "600",
              }}
            >
              Course: {selectedCourseTitle}
            </p>
          )}
        </div>
        {selectedCourse && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditLesson(null);
              setShowForm(true);
            }}
            style={{ padding: "0.6rem 1.3rem" }}
          >
            + Add Lesson
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: "1rem" }}>
          {successMsg}
        </div>
      )}

      <div className="card" style={{ marginBottom: "1rem" }}>
        <label
          style={{
            fontWeight: "600",
            color: "#374151",
            display: "block",
            marginBottom: "0.4rem",
            fontSize: "0.9rem",
          }}
        >
          Select Course to Manage Lessons
        </label>
        {coursesLoading ? (
          <Loader message="Loading courses..." />
        ) : (
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.95rem",
              maxWidth: "400px",
            }}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.lesson_count} lessons)
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedCourse && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "2rem" }}>
              <Loader message="Loading lessons..." />
            </div>
          ) : lessons.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}
            >
              <p>
                No lessons yet for this course. Click "+ Add Lesson" to create
                one.
              </p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>Order</th>
                  <th>Lesson Title</th>
                  <th>Content Preview</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          backgroundColor: "#1e3a5f",
                          color: "white",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                        }}
                      >
                        {lesson.order_number}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600", color: "#1e3a5f" }}>
                      {lesson.title}
                    </td>
                    <td
                      style={{
                        color: "#6b7280",
                        fontSize: "0.83rem",
                        maxWidth: "280px",
                      }}
                    >
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {lesson.content?.substring(0, 120)}...
                      </span>
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditLesson(lesson);
                            setShowForm(true);
                          }}
                          style={{
                            fontSize: "0.78rem",
                            padding: "0.3rem 0.65rem",
                          }}
                          disabled={actionLoad}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(lesson)}
                          style={{
                            fontSize: "0.78rem",
                            padding: "0.3rem 0.65rem",
                          }}
                          disabled={actionLoad}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showForm && (
        <AdminLessonForm
          key={`${editLesson?.id ?? "new"}-${selectedCourse}`}
          lesson={editLesson}
          courses={courses}
          selectedCourseId={selectedCourse}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditLesson(null);
            setError("");
          }}
          loading={actionLoad}
        />
      )}
    </div>
  );
}

export default AdminLessons;
