import React from "react";

const optionLabels = { a: "A", b: "B", c: "C", d: "D" };
const optionKeys = ["a", "b", "c", "d"];

function QuizQuestion({
  question,
  index,
  selectedAnswer,
  onAnswerSelect,
  disabled,
}) {
  const options = {
    a: question.option_a,
    b: question.option_b,
    c: question.option_c,
    d: question.option_d,
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "1.25rem",
        marginBottom: "1.2rem",
      }}
    >
      <p
        style={{
          fontWeight: "600",
          color: "#1e3a5f",
          marginBottom: "1rem",
          lineHeight: "1.5",
          fontSize: "0.97rem",
        }}
      >
        <span
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: "700",
            marginRight: "0.6rem",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>
        {question.question_text}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {optionKeys.map((key) => {
          const isSelected = selectedAnswer === key;

          return (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.9rem",
                borderRadius: "8px",
                border: `2px solid ${isSelected ? "#2563eb" : "#e5e7eb"}`,
                backgroundColor: isSelected ? "#eff6ff" : "white",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
                opacity: disabled ? 0.75 : 1,
              }}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={key}
                checked={isSelected}
                onChange={() => !disabled && onAnswerSelect(question.id, key)}
                disabled={disabled}
                style={{ display: "none" }}
              />
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: isSelected ? "#2563eb" : "#f3f4f6",
                  color: isSelected ? "white" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {optionLabels[key]}
              </span>
              <span
                style={{
                  fontSize: "0.92rem",
                  color: isSelected ? "#1e40af" : "#374151",
                  fontWeight: isSelected ? "600" : "400",
                }}
              >
                {options[key]}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default QuizQuestion;
