const express = require("express");
const router = express.Router();
const {
  getAllCoursesHandler,
  getCourseHandler,
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

// All course routes require login
// GET /api/courses
router.get("/", protect, getAllCoursesHandler);

// GET /api/courses/:id
router.get("/:id", protect, getCourseHandler);

module.exports = router;
