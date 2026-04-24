import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import AdminCourseForm from "../../components/AdminCourseForm";
import Loader from "../../components/Loader";
import "../../styles/admin.css";

function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoad, setActionLoad] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await adminService.getAllCourses();
        setCourses(data.courses);
      } catch {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const refreshCourses = async () => {
    try {
      const data = await adminService.getAllCourses();
      setCourses(data.courses);
    } catch {
      setError("Failed to load courses.");
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSave = async (title, description) => {
    setActionLoad(true);
    setError("");
    try {
      if (editCourse) {
        await adminService.updateCourse(editCourse.id, title, description);
        showSuccess("Course updated successfully");
      } else {
        await adminService.createCourse(title, description);
        showSuccess("Course created successfully");
      }
      setShowForm(false);
      setEditCourse(null);
      await refreshCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course.");
    } finally {
      setActionLoad(false);
    }
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Delete "${course.title}"?\n\nThis will also delete all its lessons, quizzes, and student progress. This cannot be undone.`,
    );
    if (!confirmed) return;

    setActionLoad(true);
    try {
      await adminService.deleteCourse(course.id);
      showSuccess("Course deleted successfully");
      await refreshCourses();
    } catch {
      setError("Failed to delete course.");
    } finally {
      setActionLoad(false);
    }
  };

  if (loading) return <Loader message="Loading courses..." />;

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
            Course Management
          </h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "0.88rem" }}>
            {courses.length} courses total
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditCourse(null);
            setShowForm(true);
          }}
          style={{ padding: "0.6rem 1.3rem" }}
        >
          + Add Course
        </button>
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

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {courses.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}
          >
            <p>No courses yet. Click "Add Course" to create your first one.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ textAlign: "center" }}>Lessons</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id}>
                  <td
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.8rem",
                      width: "40px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td>
                    <span style={{ fontWeight: "700", color: "#1e3a5f" }}>
                      {course.title}
                    </span>
                  </td>
                  <td
                    style={{
                      color: "#6b7280",
                      fontSize: "0.85rem",
                      maxWidth: "300px",
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
                      {course.description}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        backgroundColor: "#eff6ff",
                        color: "#2563eb",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "20px",
                      }}
                    >
                      {course.lesson_count}
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
                        onClick={() =>
                          navigate("/admin/lessons", {
                            state: {
                              courseId: course.id,
                              courseTitle: course.title,
                            },
                          })
                        }
                        style={{
                          fontSize: "0.78rem",
                          padding: "0.3rem 0.65rem",
                        }}
                        title="Manage lessons"
                      >
                        Lessons
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditCourse(course);
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
                        onClick={() => handleDelete(course)}
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

      {showForm && (
        <AdminCourseForm
          key={editCourse?.id ?? "new-course"}
          course={editCourse}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditCourse(null);
            setError("");
          }}
          loading={actionLoad}
        />
      )}
    </div>
  );
}

export default AdminCourses;
