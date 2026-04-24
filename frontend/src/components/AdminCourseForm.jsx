import React, { useState } from "react";
import "../styles/admin.css";

function AdminCourseForm({ course, onSave, onClose, loading }) {
  const isEditing = !!course;

  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
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
      nextErrors.title = "Course title is required";
    } else if (formData.title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters";
    }
    if (!formData.description.trim()) {
      nextErrors.description = "Course description is required";
    } else if (formData.description.trim().length < 10) {
      nextErrors.description = "Description must be at least 10 characters";
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
    onSave(formData.title, formData.description);
  };

  return (
    <div className="admin-form-overlay" onClick={onClose}>
      <div className="admin-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-form-modal-header">
          <h3 style={{ margin: 0, color: "#1e3a5f", fontSize: "1.05rem" }}>
            {isEditing ? "Edit Course" : "Add New Course"}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            X
          </button>
        </div>

        <div className="admin-form-modal-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Budgeting Basics"
                disabled={loading}
                style={{ borderColor: errors.title ? "#dc2626" : "#d1d5db" }}
              />
              {errors.title && (
                <span style={{ color: "#dc2626", fontSize: "0.8rem" }}>
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Course Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a clear description of what students will learn..."
                rows={4}
                disabled={loading}
                style={{
                  borderColor: errors.description ? "#dc2626" : "#d1d5db",
                  resize: "vertical",
                }}
              />
              {errors.description && (
                <span style={{ color: "#dc2626", fontSize: "0.8rem" }}>
                  {errors.description}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
                marginTop: "0.5rem",
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
                    ? "Update Course"
                    : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminCourseForm;
