import React, { useState, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { calculateAmortization } from "../utils/emiFormula";
import { formatRupees, formatNumber } from "../utils/formatDate";
import "../styles/planner.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// ── Slider config ─────────────────────────────────────────────
const SLIDER_CONFIG = {
  principal: {
    min: 10000,
    max: 10000000,
    step: 10000,
    label: "Loan Amount",
    unit: "₹",
  },
  rate: {
    min: 1,
    max: 36,
    step: 0.1,
    label: "Annual Interest Rate",
    unit: "%",
  },
  tenure: { min: 1, max: 360, step: 1, label: "Loan Tenure", unit: "months" },
};

function EMICalculator() {
  // Inputs with default values so chart shows on load
  const [principal, setPrincipal] = useState(500000); // ₹5,00,000
  const [rate, setRate] = useState(10.5); // 10.5%
  const [tenure, setTenure] = useState(60); // 60 months (5 years)
  const [showTable, setShowTable] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation helper ───────────────────────────────────────
  const validate = (field, value) => {
    const num = parseFloat(value);
    const cfg = SLIDER_CONFIG[field];
    if (isNaN(num) || num < cfg.min) {
      return `Minimum value is ${cfg.min}`;
    }
    if (num > cfg.max) {
      return `Maximum value is ${formatNumber(cfg.max)}`;
    }
    return "";
  };

  const handleInputChange = (field, setter, value) => {
    setter(value);
    const error = validate(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ── Check if inputs are valid for calculation ───────────────
  const isValid =
    !errors.principal &&
    !errors.rate &&
    !errors.tenure &&
    principal > 0 &&
    rate > 0 &&
    tenure > 0;

  // ── Run calculation (memoized — only recalculates when inputs change) ──
  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateAmortization(
      parseFloat(principal),
      parseFloat(rate),
      parseInt(tenure),
    );
  }, [principal, rate, tenure, isValid]);

  // ── Chart data ──────────────────────────────────────────────
  const chartData = result
    ? {
        labels: ["Principal", "Total Interest"],
        datasets: [
          {
            data: [parseFloat(principal), result.totalInterest],
            backgroundColor: ["#2563eb", "#dc2626"],
            borderWidth: 2,
            borderColor: "white",
          },
        ],
      }
    : null;

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
            const pct = ((val / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${formatRupees(val)} (${pct}%)`;
          },
        },
      },
    },
  };

  // ── Tenure display helper ───────────────────────────────────
  const tenureDisplay = () => {
    const months = parseInt(tenure);
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${months} months`;
    if (rem === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years}y ${rem}m`;
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#1e3a5f", marginBottom: "0.3rem" }}>
          🧾 EMI Calculator
        </h1>
        <p style={{ color: "#6b7280" }}>
          Calculate your monthly loan installment and see the complete repayment
          schedule.
        </p>
      </div>

      <div className="emi-grid">
        {/* ── LEFT: Sliders + Inputs ──────────────────────── */}
        <div>
          <div className="card">
            <h3 style={{ color: "#1e3a5f", marginBottom: "1.25rem" }}>
              Loan Details
            </h3>

            {/* ─ Loan Amount ─ */}
            <div className="slider-container">
              <label>
                Loan Amount
                <span>{formatRupees(principal)}</span>
              </label>
              <input
                type="range"
                min={SLIDER_CONFIG.principal.min}
                max={SLIDER_CONFIG.principal.max}
                step={SLIDER_CONFIG.principal.step}
                value={principal}
                onChange={(e) =>
                  handleInputChange("principal", setPrincipal, e.target.value)
                }
              />
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}
              >
                <div
                  className="form-group"
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) =>
                      handleInputChange(
                        "principal",
                        setPrincipal,
                        e.target.value,
                      )
                    }
                    min={10000}
                    max={10000000}
                    style={{
                      borderColor: errors.principal ? "#dc2626" : "#d1d5db",
                    }}
                  />
                  {errors.principal && (
                    <span style={{ color: "#dc2626", fontSize: "0.78rem" }}>
                      {errors.principal}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ─ Interest Rate ─ */}
            <div className="slider-container">
              <label>
                Annual Interest Rate
                <span>{parseFloat(rate).toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min={SLIDER_CONFIG.rate.min}
                max={SLIDER_CONFIG.rate.max}
                step={SLIDER_CONFIG.rate.step}
                value={rate}
                onChange={(e) =>
                  handleInputChange("rate", setRate, e.target.value)
                }
              />
              <div
                className="form-group"
                style={{ marginBottom: 0, marginTop: "0.4rem" }}
              >
                <input
                  type="number"
                  value={rate}
                  onChange={(e) =>
                    handleInputChange("rate", setRate, e.target.value)
                  }
                  min={1}
                  max={36}
                  step={0.1}
                  style={{ borderColor: errors.rate ? "#dc2626" : "#d1d5db" }}
                />
                {errors.rate && (
                  <span style={{ color: "#dc2626", fontSize: "0.78rem" }}>
                    {errors.rate}
                  </span>
                )}
              </div>
            </div>

            {/* ─ Tenure ─ */}
            <div className="slider-container">
              <label>
                Loan Tenure
                <span>{tenureDisplay()}</span>
              </label>
              <input
                type="range"
                min={SLIDER_CONFIG.tenure.min}
                max={SLIDER_CONFIG.tenure.max}
                step={SLIDER_CONFIG.tenure.step}
                value={tenure}
                onChange={(e) =>
                  handleInputChange("tenure", setTenure, e.target.value)
                }
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                  marginTop: "0.4rem",
                }}
              >
                <div
                  className="form-group"
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) =>
                      handleInputChange("tenure", setTenure, e.target.value)
                    }
                    min={1}
                    max={360}
                    placeholder="Months"
                    style={{
                      borderColor: errors.tenure ? "#dc2626" : "#d1d5db",
                    }}
                  />
                  {errors.tenure && (
                    <span style={{ color: "#dc2626", fontSize: "0.78rem" }}>
                      {errors.tenure}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                  marginTop: "0.5rem",
                }}
              >
                {[12, 24, 36, 60, 84, 120, 180, 240].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setTenure(m);
                      setErrors((p) => ({ ...p, tenure: "" }));
                    }}
                    style={{
                      padding: "0.2rem 0.6rem",
                      fontSize: "0.78rem",
                      border: `1px solid ${parseInt(tenure) === m ? "#2563eb" : "#d1d5db"}`,
                      borderRadius: "4px",
                      backgroundColor:
                        parseInt(tenure) === m ? "#eff6ff" : "white",
                      color: parseInt(tenure) === m ? "#2563eb" : "#6b7280",
                      cursor: "pointer",
                      fontWeight: parseInt(tenure) === m ? "700" : "400",
                    }}
                  >
                    {m < 12 ? `${m}m` : `${m / 12}yr`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Common loan presets */}
          <div className="card" style={{ marginTop: "1rem" }}>
            <h4
              style={{
                color: "#1e3a5f",
                marginBottom: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              Quick Presets
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              {[
                { label: "Home Loan", p: 5000000, r: 8.5, t: 240 },
                { label: "Car Loan", p: 800000, r: 9.5, t: 60 },
                { label: "Personal Loan", p: 300000, r: 14, t: 36 },
                { label: "Education Loan", p: 1000000, r: 10, t: 84 },
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrincipal(preset.p);
                    setRate(preset.r);
                    setTenure(preset.t);
                    setErrors({});
                  }}
                  style={{
                    padding: "0.55rem 0.75rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    color: "#374151",
                    fontWeight: "600",
                    textAlign: "left",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f7ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  {preset.label}
                  <br />
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "0.75rem",
                      fontWeight: "400",
                    }}
                  >
                    {formatRupees(preset.p)} @ {preset.r}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Results ──────────────────────────────── */}
        <div>
          {result && isValid ? (
            <>
              {/* EMI Summary Banner */}
              <div className="emi-summary-box" style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    margin: "0 0 0.4rem",
                    opacity: 0.8,
                    fontSize: "0.85rem",
                  }}
                >
                  Monthly EMI
                </p>
                <p
                  style={{
                    margin: "0 0 1.25rem",
                    fontSize: "2.2rem",
                    fontWeight: "800",
                  }}
                >
                  {formatRupees(result.emi)}
                </p>

                <div className="emi-summary-item">
                  <span style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                    Principal Amount
                  </span>
                  <span style={{ fontWeight: "700" }}>
                    {formatRupees(parseFloat(principal))}
                  </span>
                </div>
                <div className="emi-summary-item">
                  <span style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                    Total Interest
                  </span>
                  <span style={{ fontWeight: "700", color: "#fca5a5" }}>
                    {formatRupees(result.totalInterest)}
                  </span>
                </div>
                <div className="emi-summary-item">
                  <span style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                    Total Payment
                  </span>
                  <span style={{ fontWeight: "700" }}>
                    {formatRupees(result.totalPayment)}
                  </span>
                </div>
                <div className="emi-summary-item">
                  <span style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                    Loan Tenure
                  </span>
                  <span style={{ fontWeight: "700" }}>{tenureDisplay()}</span>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="card" style={{ marginBottom: "1rem" }}>
                <h3 style={{ color: "#1e3a5f", marginBottom: "1rem" }}>
                  Principal vs Interest
                </h3>
                <div style={{ maxWidth: "280px", margin: "0 auto" }}>
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "0.6rem",
                      backgroundColor: "#eff6ff",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        color: "#6b7280",
                      }}
                    >
                      Principal
                    </p>
                    <p
                      style={{ margin: 0, fontWeight: "700", color: "#2563eb" }}
                    >
                      {(
                        (parseFloat(principal) / result.totalPayment) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "0.6rem",
                      backgroundColor: "#fee2e2",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        color: "#6b7280",
                      }}
                    >
                      Interest
                    </p>
                    <p
                      style={{ margin: 0, fontWeight: "700", color: "#dc2626" }}
                    >
                      {(
                        (result.totalInterest / result.totalPayment) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* Amortization Table Toggle */}
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: showTable ? "1rem" : 0,
                  }}
                >
                  <h3 style={{ color: "#1e3a5f", margin: 0 }}>
                    Monthly Schedule
                  </h3>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowTable(!showTable)}
                    style={{ fontSize: "0.82rem", padding: "0.35rem 0.75rem" }}
                  >
                    {showTable ? "Hide Table" : "Show Table"}
                  </button>
                </div>

                {showTable && (
                  <div
                    style={{
                      overflowX: "auto",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <table className="amortization-table">
                      <thead style={{ position: "sticky", top: 0 }}>
                        <tr>
                          <th style={{ textAlign: "center" }}>Month</th>
                          <th>EMI</th>
                          <th>Principal</th>
                          <th>Interest</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((row) => (
                          <tr key={row.month}>
                            <td>{row.month}</td>
                            <td>{formatRupees(row.emi)}</td>
                            <td style={{ color: "#166534" }}>
                              {formatRupees(row.principal)}
                            </td>
                            <td style={{ color: "#991b1b" }}>
                              {formatRupees(row.interest)}
                            </td>
                            <td style={{ color: "#1e3a5f", fontWeight: "600" }}>
                              {formatRupees(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!showTable && (
                  <p
                    style={{
                      margin: "0.5rem 0 0",
                      fontSize: "0.83rem",
                      color: "#9ca3af",
                    }}
                  >
                    Click "Show Table" to see all {tenure} monthly installments
                  </p>
                )}
              </div>
            </>
          ) : (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "3rem 2rem",
                color: "#9ca3af",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧾</div>
              <p style={{ fontWeight: "600" }}>
                Adjust the sliders to calculate your EMI
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EMICalculator;
