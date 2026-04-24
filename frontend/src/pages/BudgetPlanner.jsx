import React, { useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatRupees } from "../utils/formatDate";
import "../styles/planner.css";

// Register the Chart.js components we use
ChartJS.register(ArcElement, Tooltip, Legend);

// ── Default expense categories ────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: 1, label: "Rent / Housing", amount: "" },
  { id: 2, label: "Food & Groceries", amount: "" },
  { id: 3, label: "Transport", amount: "" },
  { id: 4, label: "Utilities & Bills", amount: "" },
  { id: 5, label: "Entertainment", amount: "" },
  { id: 6, label: "Education", amount: "" },
];

// Chart colors for each category
const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#be185d",
  "#065f46",
  "#92400e",
  "#1e40af",
];

// Unique ID counter for new expense rows
let nextId = 10;

function BudgetPlanner() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState(DEFAULT_CATEGORIES);
  const [calculated, setCalculated] = useState(false);
  const [errors, setErrors] = useState({});
  const resultsRef = useRef(null);

  // ── Update a single expense row ─────────────────────────────
  const updateExpense = (id, field, value) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    );
    // Clear error for this field
    if (errors[`expense_${id}`]) {
      setErrors((prev) => {
        const e = { ...prev };
        delete e[`expense_${id}`];
        return e;
      });
    }
  };

  // ── Add a new blank expense row ─────────────────────────────
  const addExpense = () => {
    nextId++;
    setExpenses((prev) => [...prev, { id: nextId, label: "", amount: "" }]);
  };

  // ── Remove an expense row ───────────────────────────────────
  const removeExpense = (id) => {
    if (expenses.length <= 1) return; // keep at least one row
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!income || isNaN(income) || parseFloat(income) <= 0) {
      newErrors.income =
        "Please enter a valid monthly income (positive number)";
    }

    expenses.forEach((exp) => {
      if (
        exp.amount !== "" &&
        (isNaN(exp.amount) || parseFloat(exp.amount) < 0)
      ) {
        newErrors[`expense_${exp.id}`] = "Amount must be a positive number";
      }
    });

    return newErrors;
  };

  // ── Calculate budget ────────────────────────────────────────
  const handleCalculate = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setCalculated(true);
    // Scroll to results after render
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ── Reset everything ────────────────────────────────────────
  const handleReset = () => {
    setIncome("");
    setExpenses(DEFAULT_CATEGORIES);
    setCalculated(false);
    setErrors({});
  };

  // ── Derived calculations ────────────────────────────────────
  const incomeNum = parseFloat(income) || 0;

  // Only include rows with a label and a positive amount
  const validExpenses = expenses.filter(
    (exp) =>
      exp.label.trim() && exp.amount !== "" && parseFloat(exp.amount) > 0,
  );

  const totalExpenses = validExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0,
  );

  const surplus = incomeNum - totalExpenses;
  const savingsPercent =
    incomeNum > 0 ? ((surplus / incomeNum) * 100).toFixed(1) : 0;
  const expensePercent =
    incomeNum > 0 ? ((totalExpenses / incomeNum) * 100).toFixed(1) : 0;

  // ── Pie chart data ──────────────────────────────────────────
  const chartData = {
    labels: validExpenses.map((e) => e.label),
    datasets: [
      {
        data: validExpenses.map((e) => parseFloat(e.amount)),
        backgroundColor: CHART_COLORS.slice(0, validExpenses.length),
        borderWidth: 2,
        borderColor: "white",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 12 }, padding: 15 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw;
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: ${formatRupees(val)} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#1e3a5f", marginBottom: "0.3rem" }}>
          💰 Budget Planner
        </h1>
        <p style={{ color: "#6b7280" }}>
          Enter your monthly income and expenses to see where your money goes.
        </p>
      </div>

      <div className="planner-grid">
        {/* ── LEFT PANEL: Input Form ──────────────────────── */}
        <div>
          {/* Income Section */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h3 style={{ color: "#1e3a5f", marginBottom: "1rem" }}>
              📥 Monthly Income
            </h3>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="income">Total Monthly Income (₹)</label>
              <input
                type="number"
                id="income"
                value={income}
                onChange={(e) => {
                  setIncome(e.target.value);
                  if (errors.income) setErrors((p) => ({ ...p, income: "" }));
                }}
                placeholder="e.g. 25000"
                min="0"
              />
              {errors.income && (
                <span style={{ color: "#dc2626", fontSize: "0.82rem" }}>
                  {errors.income}
                </span>
              )}
            </div>
          </div>

          {/* Expenses Section */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: "#1e3a5f", margin: 0 }}>
                📤 Monthly Expenses
              </h3>
              <button
                className="btn btn-secondary"
                onClick={addExpense}
                style={{ fontSize: "0.82rem", padding: "0.35rem 0.75rem" }}
              >
                + Add Category
              </button>
            </div>

            {/* Column headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 36px",
                gap: "0.5rem",
                marginBottom: "0.4rem",
                paddingBottom: "0.4rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#6b7280",
                }}
              >
                Category
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#6b7280",
                }}
              >
                Amount (₹)
              </span>
              <span></span>
            </div>

            {/* Expense rows */}
            {expenses.map((exp) => (
              <div key={exp.id} className="expense-row">
                <input
                  type="text"
                  value={exp.label}
                  onChange={(e) =>
                    updateExpense(exp.id, "label", e.target.value)
                  }
                  placeholder="Category name"
                />
                <input
                  type="number"
                  value={exp.amount}
                  onChange={(e) =>
                    updateExpense(exp.id, "amount", e.target.value)
                  }
                  placeholder="0"
                  min="0"
                  style={{
                    borderColor: errors[`expense_${exp.id}`]
                      ? "#dc2626"
                      : "#d1d5db",
                  }}
                />
                <button
                  className="remove-btn"
                  onClick={() => removeExpense(exp.id)}
                  title="Remove this category"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Running total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "2px solid #e5e7eb",
                paddingTop: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <span style={{ fontWeight: "700", color: "#1e3a5f" }}>
                Total Expenses
              </span>
              <span
                style={{
                  fontWeight: "700",
                  color: "#dc2626",
                  fontSize: "1.05rem",
                }}
              >
                {formatRupees(totalExpenses)}
              </span>
            </div>

            {/* Action buttons */}
            <div
              style={{ display: "flex", gap: "0.75rem", marginTop: "1.2rem" }}
            >
              <button
                className="btn btn-primary"
                onClick={handleCalculate}
                style={{ flex: 1, padding: "0.7rem" }}
              >
                Calculate Budget
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleReset}
                style={{ padding: "0.7rem 1rem" }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Results ────────────────────────── */}
        <div ref={resultsRef}>
          {!calculated ? (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "3rem 2rem",
                color: "#9ca3af",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
              <p style={{ fontWeight: "600", marginBottom: "0.4rem" }}>
                Your results will appear here
              </p>
              <p style={{ fontSize: "0.88rem" }}>
                Fill in your income and expenses, then click "Calculate Budget"
              </p>
            </div>
          ) : (
            <>
              {/* Surplus / Deficit Box */}
              <div
                className={`surplus-box ${surplus > 0 ? "positive" : surplus < 0 ? "negative" : "neutral"}`}
                style={{ marginBottom: "1rem" }}
              >
                <p
                  style={{
                    margin: "0 0 0.3rem",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Monthly {surplus >= 0 ? "Surplus" : "Deficit"}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "2rem",
                    fontWeight: "800",
                    color:
                      surplus > 0
                        ? "#166534"
                        : surplus < 0
                          ? "#991b1b"
                          : "#374151",
                  }}
                >
                  {surplus >= 0 ? "+" : ""}
                  {formatRupees(surplus)}
                </p>
                <p
                  style={{
                    margin: "0.4rem 0 0",
                    fontSize: "0.85rem",
                    color: "#6b7280",
                  }}
                >
                  {surplus > 0
                    ? `You save ${savingsPercent}% of your income`
                    : surplus < 0
                      ? `You are overspending by ${Math.abs(savingsPercent)}% of income`
                      : "Your income exactly covers expenses"}
                </p>
              </div>

              {/* Summary Stats */}
              <div className="card" style={{ marginBottom: "1rem" }}>
                <h3 style={{ color: "#1e3a5f", marginBottom: "1rem" }}>
                  Budget Summary
                </h3>
                {[
                  {
                    label: "Monthly Income",
                    value: formatRupees(incomeNum),
                    color: "#166534",
                  },
                  {
                    label: "Total Expenses",
                    value: formatRupees(totalExpenses),
                    color: "#991b1b",
                  },
                  {
                    label: "Expense %",
                    value: `${expensePercent}%`,
                    color: "#d97706",
                  },
                  {
                    label: "Savings / Surplus",
                    value: formatRupees(Math.max(0, surplus)),
                    color: "#2563eb",
                  },
                  {
                    label: "Savings Rate",
                    value: `${Math.max(0, savingsPercent)}%`,
                    color: "#2563eb",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.55rem 0",
                      borderBottom: i < 4 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      {item.label}
                    </span>
                    <span style={{ fontWeight: "700", color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* 50-30-20 Comparison */}
              <div className="card" style={{ marginBottom: "1rem" }}>
                <h3 style={{ color: "#1e3a5f", marginBottom: "0.75rem" }}>
                  50-30-20 Rule Comparison
                </h3>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#6b7280",
                    marginBottom: "0.85rem",
                  }}
                >
                  How does your spending compare to the recommended 50-30-20
                  rule?
                </p>
                {[
                  {
                    label: "Needs (50% target)",
                    target: incomeNum * 0.5,
                    actual: totalExpenses,
                    note: "Your total expenses",
                  },
                  {
                    label: "Savings (20% target)",
                    target: incomeNum * 0.2,
                    actual: Math.max(0, surplus),
                    note: "Your actual savings",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <span style={{ color: "#374151", fontWeight: "600" }}>
                        {item.label}
                      </span>
                      <span style={{ color: "#6b7280" }}>
                        {formatRupees(item.actual)} /{" "}
                        {formatRupees(item.target)}
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
                          backgroundColor:
                            item.actual <= item.target ? "#16a34a" : "#dc2626",
                          width: `${Math.min(100, incomeNum > 0 ? (item.actual / item.target) * 100 : 0)}%`,
                          height: "100%",
                          borderRadius: "10px",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie Chart */}
              {validExpenses.length > 0 && (
                <div className="card">
                  <h3 style={{ color: "#1e3a5f", marginBottom: "1rem" }}>
                    Expense Breakdown
                  </h3>
                  <div style={{ maxWidth: "320px", margin: "0 auto" }}>
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetPlanner;
