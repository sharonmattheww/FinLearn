import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "../services/quizService";
import QuizQuestion from "../components/QuizQuestion";
import QuizResults from "../components/QuizResults";
import Loader from "../components/Loader";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setAnswers({});

    try {
      const data = await quizService.getQuizById(id);
      setQuiz(data.quiz);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Quiz not found.");
      } else {
        setError("Failed to load quiz. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: selectedOption,
    }));

    if (submitError) setSubmitError("");
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  const handleSubmit = async () => {
    if (!allAnswered) {
      setSubmitError(
        `Please answer all ${totalQuestions} questions before submitting.`,
      );
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const data = await quizService.submitQuiz(id, answers);
      setResult(data.result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err.response?.data?.message || "Submission failed. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setSubmitError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loader message="Loading quiz..." />;

  if (error) {
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

  if (result) {
    return (
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>
        <QuizResults result={result} quiz={quiz} onRetake={handleRetake} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() =>
            navigate(
              quiz.lesson_id
                ? `/lessons/${quiz.lesson_id}`
                : `/courses/${quiz.course_id}`,
            )
          }
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            padding: 0,
            marginBottom: "0.75rem",
          }}
        >
          Back to Lesson
        </button>

        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
            borderRadius: "12px",
            padding: "1.5rem",
            color: "white",
          }}
        >
          <p
            style={{ margin: "0 0 0.3rem", opacity: 0.8, fontSize: "0.85rem" }}
          >
            {quiz.course_title}
          </p>
          <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.4rem" }}>
            {quiz.title}
          </h1>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              fontSize: "0.88rem",
              opacity: 0.9,
            }}
          >
            <span>{totalQuestions} Questions</span>
            <span>Pass mark: 70%</span>
            <span>No time limit</span>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ padding: "0.75rem 1.25rem", marginBottom: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.4rem",
          }}
        >
          <span
            style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600" }}
          >
            Progress
          </span>
          <span
            style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: "600" }}
          >
            {answeredCount} / {totalQuestions} answered
          </span>
        </div>
        <div
          style={{
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            height: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#2563eb",
              height: "100%",
              borderRadius: "10px",
              width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {quiz.questions.map((question, index) => (
        <QuizQuestion
          key={question.id}
          question={question}
          index={index}
          selectedAnswer={answers[String(question.id)] || null}
          onAnswerSelect={handleAnswerSelect}
          disabled={submitting}
        />
      ))}

      {submitError && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {submitError}
        </div>
      )}

      <div style={{ textAlign: "center", paddingBottom: "2rem" }}>
        {!allAnswered && (
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.88rem",
              marginBottom: "0.75rem",
            }}
          >
            Answer all {totalQuestions} questions to submit
          </p>
        )}
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting || !allAnswered}
          style={{
            padding: "0.8rem 3rem",
            fontSize: "1rem",
            opacity: allAnswered ? 1 : 0.5,
            cursor: allAnswered ? "pointer" : "not-allowed",
          }}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
