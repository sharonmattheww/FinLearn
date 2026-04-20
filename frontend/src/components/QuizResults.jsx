import React from "react";
import { useNavigate } from "react-router-dom";

const optionLabels = { a: "A", b: "B", c: "C", d: "D" };

function QuizResults({ result, quiz, onRetake }) {
  const navigate = useNavigate();

  const {
    score,
    total,
    percentage,
    passed,
    passPercentage,
    results: answerResults = [],
  } = result;

  const questionMap = {};
  (quiz?.questions || []).forEach((q) => {
    questionMap[q.id] = q;
  });

  return (
    <div>
      <div
        style={{
          background: passed
            ? "linear-gradient(135deg, #16a34a, #15803d)"
            : "linear-gradient(135deg, #dc2626, #b91c1c)",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
          color: "white",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {passed ? "PASS" : "TRY AGAIN"}
        </div>
        <h2 style={{ margin: "0 0 0.4rem", fontSize: "1.6rem" }}>
          {passed ? "Congratulations! You Passed!" : "Not Quite There Yet"}
        </h2>
        <p style={{ margin: "0 0 1rem", opacity: 0.9 }}>
          {passed
            ? "Great work! Your lesson has been marked as complete."
            : `You need ${passPercentage}% to pass. Give it another try!`}
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "50px",
            padding: "0.5rem 1.5rem",
            fontSize: "1.3rem",
            fontWeight: "700",
          }}
        >
          <span>
            {score} / {total} correct
          </span>
          <span
            style={{
              backgroundColor: "white",
              color: passed ? "#16a34a" : "#dc2626",
              borderRadius: "50px",
              padding: "0.1rem 0.7rem",
              fontSize: "1rem",
            }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ color: "#1e3a5f", marginBottom: "1rem" }}>
          Answer Review
        </h3>

        {answerResults.map((item, index) => {
          const questionId = item.questionId ?? item.question_id;
          const studentAnswer = item.studentAnswer ?? item.student_answer;
          const correctAnswer = item.correctAnswer ?? item.correct_answer;
          const isCorrect = Boolean(item.isCorrect ?? item.is_correct);
          const question = questionMap[questionId];

          if (!question) return null;

          const options = {
            a: question.option_a,
            b: question.option_b,
            c: question.option_c,
            d: question.option_d,
          };

          return (
            <div
              key={questionId}
              style={{
                border: `1px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "0.8rem",
                backgroundColor: isCorrect ? "#f0fdf4" : "#fff7f7",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    flexShrink: 0,
                    marginTop: "2px",
                    fontWeight: "700",
                    color: isCorrect ? "#166534" : "#991b1b",
                  }}
                >
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
                <p
                  style={{
                    fontWeight: "600",
                    color: "#1e3a5f",
                    margin: 0,
                    fontSize: "0.92rem",
                    lineHeight: "1.4",
                  }}
                >
                  Q{index + 1}. {question.question_text}
                </p>
              </div>

              <div style={{ paddingLeft: "1.5rem" }}>
                <p
                  style={{
                    margin: "0 0 0.3rem",
                    fontSize: "0.85rem",
                    color: isCorrect ? "#166534" : "#991b1b",
                  }}
                >
                  <strong>Your answer:</strong>{" "}
                  {studentAnswer
                    ? `(${optionLabels[studentAnswer]}) ${options[studentAnswer]}`
                    : "Not answered"}
                </p>

                {!isCorrect && correctAnswer && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "#166534",
                    }}
                  >
                    <strong>Correct answer:</strong> (
                    {optionLabels[correctAnswer]}) {options[correctAnswer]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={onRetake}
          style={{ padding: "0.7rem 1.8rem" }}
        >
          Retake Quiz
        </button>

        {passed && quiz.lesson_id && (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/lessons/${quiz.lesson_id}`)}
            style={{ padding: "0.7rem 1.8rem" }}
          >
            Back to Lesson
          </button>
        )}

        <button
          className="btn btn-success"
          onClick={() => navigate(`/courses/${quiz.course_id}`)}
          style={{ padding: "0.7rem 1.8rem" }}
        >
          Back to Course
        </button>
      </div>
    </div>
  );
}

export default QuizResults;
