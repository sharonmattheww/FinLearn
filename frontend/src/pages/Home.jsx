import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="text-center" style={{ paddingTop: "3rem" }}>
      <h1
        style={{ fontSize: "2.5rem", color: "#1e3a5f", marginBottom: "1rem" }}
      >
        💰 Welcome to FinLearn
      </h1>
      <p
        style={{
          fontSize: "1.15rem",
          color: "#6b7280",
          maxWidth: "550px",
          margin: "0 auto 2rem",
        }}
      >
        Learn real-world financial skills through structured lessons, quizzes,
        and practical tools — built for students like you.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link to="/register" className="btn btn-primary">
          Get Started
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Login
        </Link>
      </div>

      {/* Feature highlights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginTop: "3.5rem",
        }}
      >
        {[
          {
            icon: "📚",
            title: "Structured Courses",
            desc: "Learn budgeting, EMI, saving, and more.",
          },
          {
            icon: "🧠",
            title: "Quizzes",
            desc: "Test your knowledge after each lesson.",
          },
          {
            icon: "🧮",
            title: "Practical Tools",
            desc: "Budget Planner and EMI Calculator.",
          },
          {
            icon: "🎓",
            title: "Certificates",
            desc: "Earn a certificate on course completion.",
          },
        ].map((feature, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {feature.icon}
            </div>
            <h3 style={{ marginBottom: "0.4rem", color: "#1e3a5f" }}>
              {feature.title}
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
