const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Utility Routes ───────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({
      status: "ok",
      message: "FinLearn API is running",
      timestamp: new Date().toISOString(),
    });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [users] = await pool.query("SELECT COUNT(*) AS count FROM users");
    const [courses] = await pool.query("SELECT COUNT(*) AS count FROM courses");
    const [lessons] = await pool.query("SELECT COUNT(*) AS count FROM lessons");
    const [quizzes] = await pool.query("SELECT COUNT(*) AS count FROM quizzes");
    const [progress] = await pool.query(
      "SELECT COUNT(*) AS count FROM progress",
    );
    const [certificates] = await pool.query(
      "SELECT COUNT(*) AS count FROM certificates",
    );
    res.status(200).json({
      status: "ok",
      tables: {
        users: users[0].count,
        courses: courses[0].count,
        lessons: lessons[0].count,
        quizzes: quizzes[0].count,
        progress: progress[0].count,
        certificates: certificates[0].count,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ─── All Routes ───────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ─── 404 & Error ─────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({
      status: "error",
      message: `Route not found: ${req.method} ${req.url}`,
    });
});
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res
    .status(err.status || 500)
    .json({ status: "error", message: err.message || "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("───────────────────────────────────────────────");
  console.log(`🚀 FinLearn server  → http://localhost:${PORT}`);
  console.log(`🔧 Admin API       → http://localhost:${PORT}/api/admin`);
  console.log("───────────────────────────────────────────────");
});
