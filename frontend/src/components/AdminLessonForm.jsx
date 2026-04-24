import React, { useState } from "react";
import "../styles/admin.css";

function AdminLessonForm({
  lesson,
  courses,
  selectedCourseId,
  onSave,
  onClose,
  loading,
}) {
  const isEditing = !!lesson;

  const [formData, setFormData] = useState({
    course_id: lesson?.course_id || selectedCourseId || "",
    title: lesson?.title || "",
    content: lesson?.content || "",
    order_number: lesson?.order_number || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) {
      nextErrors.title = "Lesson title is required";
    } else if (formData.title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters";
    }
    if (!formData.content.trim()) {
      nextErrors.content = "Lesson content is required";
    } else if (formData.content.trim().length < 50) {
      nextErrors.content = "Content must be at least 50 characters";
    }
    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave(
      formData.course_id,
      formData.title,
      formData.content,
      formData.order_number,
    );
  };

  return (
    <div className="admin-form-overlay" onClick={onClose}>
      <div
        className="admin-form-modal"
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-form-modal-header">
          <h3 style={{ margin: 0, color: "#1e3a5f", fontSize: "1.05rem" }}>
            {isEditing ? "Edit Lesson" : "Add New Lesson"}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            X
          </button>
        </div>

        <div className="admin-form-modal-body">
          <form onSubmit={handleSubmit} noValidate>
            {/* Course selector shown only when creating */}
            {!isEditing && (
              <div className="form-group">
                <label htmlFor="course_id">Course *</label>
                <select
                  id="course_id"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px",
                gap: "0.75rem",
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="title">Lesson Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. What is a Budget?"
                  disabled={loading}
                  style={{ borderColor: errors.title ? "#dc2626" : "#d1d5db" }}
                />
                {errors.title && (
                  <span style={{ color: "#dc2626", fontSize: "0.8rem" }}>
                    {errors.title}
                  </span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="order_number">Order #</label>
                <input
                  type="number"
                  id="order_number"
                  name="order_number"
                  value={formData.order_number}
                  onChange={handleChange}
                  placeholder="Auto"
                  min="1"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "0.75rem" }}>
              <label htmlFor="content">
                Lesson Content *
                <span
                  style={{
                    color: "#9ca3af",
                    fontWeight: "400",
                    fontSize: "0.8rem",
                    marginLeft: "0.4rem",
                  }}
                >
                  (min. 50 characters - {formData.content.length} typed)
                </span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the full lesson content here. Use new lines to separate paragraphs."
                rows={10}
                disabled={loading}
                style={{
                  borderColor: errors.content ? "#dc2626" : "#d1d5db",
                  resize: "vertical",
                  fontFamily: "monospace",
                  fontSize: "0.88rem",
                  lineHeight: "1.6",
                }}
              />
              {errors.content && (
                <span style={{ color: "#dc2626", fontSize: "0.8rem" }}>
                  {errors.content}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Lesson"
                    : "Create Lesson"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLessonForm;
