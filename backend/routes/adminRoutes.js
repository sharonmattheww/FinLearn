const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  getStatsHandler,
  getUsersHandler,
  getCoursesHandler,
  createCourseHandler,
  updateCourseHandler,
  deleteCourseHandler,
  getLessonsHandler,
  createLessonHandler,
  updateLessonHandler,
  deleteLessonHandler,
} = require("../controllers/adminController");

// All admin routes require BOTH protect AND adminOnly middleware
// protect  → checks JWT is valid, sets req.user
// adminOnly → checks req.user.role === 'admin'
const adminGuard = [protect, adminOnly];

// ── Dashboard ─────────────────────────────────────────────────
router.get("/stats", adminGuard, getStatsHandler);

// ── Users ─────────────────────────────────────────────────────
router.get("/users", adminGuard, getUsersHandler);

// ── Courses ───────────────────────────────────────────────────
router.get("/courses", adminGuard, getCoursesHandler);
router.post("/courses", adminGuard, createCourseHandler);
router.put("/courses/:id", adminGuard, updateCourseHandler);
router.delete("/courses/:id", adminGuard, deleteCourseHandler);

// ── Lessons ───────────────────────────────────────────────────
router.get("/lessons", adminGuard, getLessonsHandler);
router.post("/lessons", adminGuard, createLessonHandler);
router.put("/lessons/:id", adminGuard, updateLessonHandler);
router.delete("/lessons/:id", adminGuard, deleteLessonHandler);

module.exports = router;
