import React from "react";

// Determines bar color based on completion percentage
const getBarColor = (percentage) => {
  if (percentage === 100) return "#16a34a"; // green  — complete
  if (percentage >= 50) return "#2563eb"; // blue   — good progress
  if (percentage >= 25) return "#d97706"; // amber  — started
  return "#9ca3af"; // gray   — barely started
};

// Returns a human-readable status label
const getStatusLabel = (percentage, isComplete) => {
  if (isComplete || percentage === 100) return "✅ Completed";
  if (percentage === 0) return "⬜ Not Started";
  if (percentage < 50) return "🔵 In Progress";
  return "🔵 Almost There";
};

function CourseProgressBar({
  courseName,
  completedLessons,
  totalLessons,
  percentage,
  isComplete,
  compact = false, // compact mode for dashboard summary
}) {
  const barColor = getBarColor(percentage);
  const status = getStatusLabel(percentage, isComplete);

  if (compact) {
    // ── Compact version for dashboard ──────────────────────────
    return (
      <div style={{ marginBottom: "0.75rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.3rem",
          }}
        >
          <span
            style={{
              fontSize: "0.88rem",
              fontWeight: "600",
              color: "#374151",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "70%",
            }}
          >
            {courseName}
          </span>
          <span
            style={{ fontSize: "0.82rem", color: barColor, fontWeight: "700" }}
          >
            {percentage}%
          </span>
        </div>
        <div
          style={{
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            height: "7px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: barColor,
              width: `${percentage}%`,
              height: "100%",
              borderRadius: "10px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
    );
  }

  // ── Full version for progress page ─────────────────────────
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
          gap: "0.3rem",
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
          {completedLessons} of {totalLessons} lessons completed
        </span>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: "600",
            color: isComplete ? "#166534" : "#374151",
            backgroundColor: isComplete ? "#dcfce7" : "#f3f4f6",
            padding: "0.15rem 0.6rem",
            borderRadius: "20px",
          }}
        >
          {status}
        </span>
      </div>

      {/* Progress bar track */}
      <div
        style={{
          backgroundColor: "#e5e7eb",
          borderRadius: "10px",
          height: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Filled portion */}
        <div
          style={{
            backgroundColor: barColor,
            width: `${percentage}%`,
            height: "100%",
            borderRadius: "10px",
            transition: "width 0.6s ease",
            position: "relative",
          }}
        />
      </div>

      {/* Percentage label */}
      <div style={{ textAlign: "right", marginTop: "0.25rem" }}>
        <span
          style={{ fontSize: "0.82rem", color: barColor, fontWeight: "700" }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default CourseProgressBar;
