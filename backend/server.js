const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import the DB connection so it tests on startup
require("./config/db");

const app = express();

// ─── Middleware ───────────────────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json());

// Allow requests from the frontend (different port = different origin)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server default port
    credentials: true,
  }),
);

// ─── Health Check Route ───────────────────────────────────────
// This is a simple test route to confirm the server is running.
// Visit http://localhost:5000/api/health in your browser or Postman.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "FinLearn API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes (uncomment as each phase is built) ───────────────
// const authRoutes = require('./routes/authRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const lessonRoutes = require('./routes/lessonRoutes');
// const quizRoutes = require('./routes/quizRoutes');
// const progressRoutes = require('./routes/progressRoutes');
// const certificateRoutes = require('./routes/certificateRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/quizzes', quizRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/certificates', certificateRoutes);
// app.use('/api/admin', adminRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
// Catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────
// Catches any errors thrown inside route handlers
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FinLearn server running on http://localhost:${PORT}`);
});
