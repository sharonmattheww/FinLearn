const {
  getAllProgressForUser,
  getCourseProgressForUser,
  getOverallStats,
} = require("../queries/progressQueries");

// ─── GET ALL PROGRESS ─────────────────────────────────────────
// GET /api/progress
// Returns progress for every course + overall stats
const getAllProgressHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const [progressData, stats] = await Promise.all([
      getAllProgressForUser(userId),
      getOverallStats(userId),
    ]);

    // Calculate overall completion percentage across all lessons
    const overallPercent =
      stats.total_lessons_available > 0
        ? Math.round(
            (stats.total_lessons_completed / stats.total_lessons_available) *
              100,
          )
        : 0;

    res.status(200).json({
      status: "success",
      data: {
        courses: progressData,
        stats: { ...stats, overall_percentage: overallPercent },
        // "Continue Learning" = first course with a next lesson available
        recommended: progressData.find((c) => c.next_lesson !== null) || null,
      },
    });
  } catch (err) {
    console.error("getAllProgress error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to load progress. Please try again.",
    });
  }
};

// ─── GET PROGRESS FOR ONE COURSE ──────────────────────────────
// GET /api/progress/:courseId
const getCourseProgressHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    if (isNaN(courseId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    const progress = await getCourseProgressForUser(userId, courseId);

    res.status(200).json({
      status: "success",
      progress,
    });
  } catch (err) {
    console.error("getCourseProgress error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to load course progress.",
    });
  }
};

module.exports = {
  getAllProgressHandler,
  getCourseProgressHandler,
};
