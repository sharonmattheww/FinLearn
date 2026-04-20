import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "../services/courseService";
import quizService from "../services/quizService";
import Loader from "../components/Loader";

function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [lessonQuiz, setLessonQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");

      try {
        const lessonData = await courseService.getLessonById(id);
        setLesson(lessonData.lesson);
        setCompleted(lessonData.lesson.completed);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Lesson not found.");
        } else {
          setError("Failed to load lesson. Please try again.");
        }
        setLessonQuiz(null);
        setLoading(false);
        return;
      }

      try {
        const quizData = await quizService.getQuizByLesson(id);
        setLessonQuiz(quizData.quiz || null);
      } catch (err) {
        if (err.response?.status === 404) {
          setLessonQuiz(null);
        } else {
          setError("Lesson loaded, but the quiz could not be fetched.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleMarkComplete = async () => {
    if (completed || completing) return;

    setCompleting(true);
    try {
      await courseService.markLessonComplete(id);
      setCompleted(true);
      setSuccessMsg("Lesson marked as complete!");
    } catch {
      setError("Failed to mark lesson complete. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loader message="Loading lesson..." />;

  if (error && !lesson) {
    return (
      <div>
        <button
          onClick={() => navigate("/courses")}
          className="btn btn-secondary"
          style={{ marginBottom: "1rem" }}
        >
          Back to Courses
        </button>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const { navigation } = lesson;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
          fontSize: "0.88rem",
          color: "#6b7280",
        }}
      >
        <span
          onClick={() => navigate("/courses")}
          style={{ cursor: "pointer", color: "#2563eb" }}
        >
          Courses
        </span>
        <span>{">"}</span>
        <span
          onClick={() => navigate(`/courses/${lesson.course_id}`)}
          style={{ cursor: "pointer", color: "#2563eb" }}
        >
          {lesson.course_title}
        </span>
        <span>{">"}</span>
        <span style={{ color: "#374151" }}>{lesson.title}</span>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                padding: "0.2rem 0.7rem",
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              Lesson {lesson.order_number}
            </span>
            {completed && (
              <span
                style={{
                  fontSize: "0.8rem",
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  padding: "0.2rem 0.7rem",
                  borderRadius: "20px",
                  fontWeight: "600",
                }}
              >
                Completed
              </span>
            )}
          </div>
          <h1
            style={{
              color: "#1e3a5f",
              fontSize: "1.6rem",
              marginTop: "0.75rem",
              marginBottom: 0,
              lineHeight: "1.3",
            }}
          >
            {lesson.title}
          </h1>
        </div>

        <div
          style={{
            lineHeight: "1.85",
            fontSize: "1rem",
            color: "#374151",
            whiteSpace: "pre-line",
          }}
        >
          {lesson.content}
        </div>

        {successMsg && (
          <div className="alert alert-success" style={{ marginTop: "1.5rem" }}>
            {successMsg}
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginTop: "1rem" }}>
            {error}
          </div>
        )}

        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #f3f4f6",
            paddingTop: "1.5rem",
          }}
        >
          {!completed && (
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <button
                className="btn btn-success"
                onClick={handleMarkComplete}
                disabled={completing}
                style={{ padding: "0.7rem 2rem", fontSize: "1rem" }}
              >
                {completing ? "Saving..." : "Mark as Complete"}
              </button>
            </div>
          )}

          {lessonQuiz && (
            <div
              style={{
                backgroundColor: "#fffbeb",
                border: "1px solid #fcd34d",
                borderRadius: "10px",
                padding: "1.1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 0.2rem",
                    fontWeight: "700",
                    color: "#92400e",
                    fontSize: "0.95rem",
                  }}
                >
                  Quiz Available
                </p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#78350f" }}>
                  {lessonQuiz.title} - Test your knowledge!
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/quiz/${lessonQuiz.id}`)}
                style={{ padding: "0.55rem 1.3rem", whiteSpace: "nowrap" }}
              >
                Take Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginTop: "0.5rem",
        }}
      >
        {navigation?.prev ? (
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/lessons/${navigation.prev.id}`)}
            style={{ flex: 1 }}
          >
            Previous: {navigation.prev.title}
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/courses/${lesson.course_id}`)}
            style={{ flex: 1 }}
          >
            Back to Course
          </button>
        )}

        {navigation?.next ? (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/lessons/${navigation.next.id}`)}
            style={{ flex: 1 }}
          >
            Next: {navigation.next.title}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/courses/${lesson.course_id}`)}
            style={{ flex: 1, backgroundColor: "#16a34a" }}
          >
            Course Complete
          </button>
        )}
      </div>
    </div>
  );
}

export default LessonDetail;
