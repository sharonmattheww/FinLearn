const express = require("express");
const router = express.Router();
const {
  getAllProgressHandler,
  getCourseProgressHandler,
} = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/progress
router.get("/", protect, getAllProgressHandler);

// GET /api/progress/:courseId
router.get("/:courseId", protect, getCourseProgressHandler);

module.exports = router;
