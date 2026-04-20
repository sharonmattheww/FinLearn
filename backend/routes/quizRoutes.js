const express = require("express");
const router = express.Router();
const {
  getQuizHandler,
  getQuizByLessonHandler,
  submitQuizHandler,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

// All quiz routes require login

// GET /api/quizzes/lesson/:lessonId
// Must be defined BEFORE /:id to avoid route conflict
router.get("/lesson/:lessonId", protect, getQuizByLessonHandler);

// GET /api/quizzes/:id
router.get("/:id", protect, getQuizHandler);

// POST /api/quizzes/:id/submit
router.post("/:id/submit", protect, submitQuizHandler);

module.exports = router;
