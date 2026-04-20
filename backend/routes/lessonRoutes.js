const express = require("express");
const router = express.Router();
const {
  getLessonHandler,
  markCompleteHandler,
} = require("../controllers/lessonController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/lessons/:id
router.get("/:id", protect, getLessonHandler);

// POST /api/lessons/:id/complete
router.post("/:id/complete", protect, markCompleteHandler);

module.exports = router;
