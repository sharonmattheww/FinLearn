const {
  getAllCourses,
  getCourseById,
  getLessonsByCourseId,
} = require("../queries/courseQueries");

// ─── GET ALL COURSES ──────────────────────────────────────────
// GET /api/courses
// Returns all courses with lesson count
const getAllCoursesHandler = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json({
      status: "success",
      count: courses.length,
      courses,
    });
  } catch (err) {
    console.error("getAllCourses error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch courses. Please try again.",
    });
  }
};

// ─── GET SINGLE COURSE + ITS LESSONS ─────────────────────────
// GET /api/courses/:id
// Returns course details and all its lessons (without content)
const getCourseHandler = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate courseId is a number
    if (isNaN(courseId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    const course = await getCourseById(courseId);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    const lessons = await getLessonsByCourseId(courseId);

    res.status(200).json({
      status: "success",
      course: {
        ...course,
        lessons,
      },
    });
  } catch (err) {
    console.error("getCourse error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch course. Please try again.",
    });
  }
};

module.exports = {
  getAllCoursesHandler,
  getCourseHandler,
};
