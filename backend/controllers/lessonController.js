const {
  getLessonById,
  getNextLesson,
  getPrevLesson,
  markLessonComplete,
  isLessonCompleted,
} = require("../queries/lessonQueries");

// ─── GET SINGLE LESSON ────────────────────────────────────────
// GET /api/lessons/:id
// Returns the full lesson including content, prev/next navigation
const getLessonHandler = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const userId = req.user.id; // set by protect middleware

    if (isNaN(lessonId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid lesson ID",
      });
    }

    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        status: "error",
        message: "Lesson not found",
      });
    }

    // Get navigation info
    const nextLesson = await getNextLesson(
      lesson.course_id,
      lesson.order_number,
    );
    const prevLesson = await getPrevLesson(
      lesson.course_id,
      lesson.order_number,
    );

    // Check if this user already completed this lesson
    const completed = await isLessonCompleted(userId, lessonId);

    res.status(200).json({
      status: "success",
      lesson: {
        ...lesson,
        completed,
        navigation: {
          prev: prevLesson || null,
          next: nextLesson || null,
        },
      },
    });
  } catch (err) {
    console.error("getLesson error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch lesson. Please try again.",
    });
  }
};

// ─── MARK LESSON COMPLETE ─────────────────────────────────────
// POST /api/lessons/:id/complete
// Records that the logged-in user completed this lesson
const markCompleteHandler = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const userId = req.user.id;

    if (isNaN(lessonId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid lesson ID",
      });
    }

    // Fetch the lesson to get its course_id
    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        status: "error",
        message: "Lesson not found",
      });
    }

    await markLessonComplete(userId, lesson.course_id, lessonId);

    res.status(200).json({
      status: "success",
      message: "Lesson marked as complete",
    });
  } catch (err) {
    console.error("markComplete error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to mark lesson complete. Please try again.",
    });
  }
};

module.exports = {
  getLessonHandler,
  markCompleteHandler,
};
