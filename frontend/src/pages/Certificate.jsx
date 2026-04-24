import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import certificateService from "../services/certificateService";
import CertificateViewer from "../components/CertificateViewer";
import Loader from "../components/Loader";

function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notEligible, setNotEligible] = useState(null); // { completed, total, remaining }

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError("");
      setNotEligible(null);

      try {
        const data = await certificateService.getCertificate(courseId);
        setCertificate(data.certificate);
      } catch (err) {
        if (err.response?.status === 403) {
          // Not eligible — course not fully complete
          setNotEligible(err.response.data.progress);
        } else if (err.response?.status === 400) {
          setError("Invalid course ID.");
        } else {
          setError("Failed to load certificate. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId]);

  if (loading) return <Loader message="Loading your certificate..." />;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Back button */}
      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        style={{
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          fontSize: "0.95rem",
          fontWeight: "600",
          padding: 0,
          marginBottom: "1.5rem",
        }}
      >
        ← Back to Course
      </button>

      {/* ── Not Eligible State ────────────────────────────── */}
      {notEligible && (
        <div>
          <div
            className="card"
            style={{ textAlign: "center", padding: "3rem 2rem" }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔒</div>
            <h2 style={{ color: "#1e3a5f", marginBottom: "0.5rem" }}>
              Certificate Not Available Yet
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "1.5rem",
                maxWidth: "400px",
                margin: "0 auto 1.5rem",
              }}
            >
              Complete all lessons in this course to unlock your certificate.
            </p>

            {/* Progress indicator */}
            <div
              style={{
                backgroundColor: "#f3f4f6",
                borderRadius: "10px",
                padding: "1.25rem",
                maxWidth: "340px",
                margin: "0 auto 1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "#374151", fontWeight: "600" }}>
                  Course Progress
                </span>
                <span style={{ color: "#2563eb", fontWeight: "700" }}>
                  {notEligible.completed}/{notEligible.total} lessons
                </span>
              </div>
              <div
                style={{
                  backgroundColor: "#e5e7eb",
                  borderRadius: "10px",
                  height: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#2563eb",
                    width: `${notEligible.total > 0 ? (notEligible.completed / notEligible.total) * 100 : 0}%`,
                    height: "100%",
                    borderRadius: "10px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <p
                style={{
                  margin: "0.6rem 0 0",
                  fontSize: "0.85rem",
                  color: "#6b7280",
                }}
              >
                {notEligible.remaining} lesson
                {notEligible.remaining !== 1 ? "s" : ""} remaining
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                Continue Learning →
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/progress")}
              >
                View Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Error State ───────────────────────────────────── */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* ── Certificate Available ─────────────────────────── */}
      {certificate && (
        <div>
          {/* Congratulations banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              borderRadius: "12px",
              padding: "1.5rem 2rem",
              color: "white",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "2.5rem" }}>🎉</span>
            <div>
              <h2 style={{ margin: "0 0 0.3rem", fontSize: "1.3rem" }}>
                Congratulations, {certificate.student_name.split(" ")[0]}!
              </h2>
              <p style={{ margin: 0, opacity: 0.9, fontSize: "0.92rem" }}>
                You have completed <strong>{certificate.course_title}</strong>.
                Your certificate is ready to download.
              </p>
            </div>
          </div>

          {/* Tips for download */}
          <div
            className="alert alert-info"
            style={{ marginBottom: "1.5rem", fontSize: "0.88rem" }}
          >
            💡 <strong>Tip:</strong> Click "Download PDF" to save your
            certificate. The downloaded file is A4 landscape format — perfect
            for printing or sharing.
          </div>

          {/* The certificate viewer with download button */}
          <div className="card">
            <CertificateViewer certificate={certificate} />
          </div>

          {/* Navigation links below certificate */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/progress")}
            >
              View All Progress
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/courses")}
            >
              Browse More Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificate;
