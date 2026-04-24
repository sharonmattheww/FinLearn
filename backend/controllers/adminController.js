const {
  getDashboardStats,
  getAllUsers,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  getMaxOrderNumber,
} = require("../queries/adminQueries");

// ─── DASHBOARD ────────────────────────────────────────────────
// GET /api/admin/stats
const getStatsHandler = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({ status: "success", stats });
  } catch (err) {
    console.error("Admin getStats error:", err.message);
    res.status(500).json({ status: "error", message: "Failed to load stats." });
  }
};

// ─── USERS ────────────────────────────────────────────────────
// GET /api/admin/users
const getUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ status: "success", count: users.length, users });
  } catch (err) {
    console.error("Admin getUsers error:", err.message);
    res.status(500).json({ status: "error", message: "Failed to load users." });
  }
};

// ─── COURSES ──────────────────────────────────────────────────
// GET /api/admin/courses
const getCoursesHandler = async (req, res) => {
  try {
    const courses = await getAllCoursesAdmin();
    res.status(200).json({ status: "success", courses });
  } catch (err) {
    console.error("Admin getCourses error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to load courses." });
  }
};

// POST /api/admin/courses
const createCourseHandler = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Course title is required." });
    }
    if (!description || !description.trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Course description is required." });
    }
    if (title.trim().length < 3) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Title must be at least 3 characters.",
        });
    }

    const newId = await createCourse(title, description);
    res.status(201).json({
      status: "success",
      message: "Course created successfully",
      courseId: newId,
    });
  } catch (err) {
    console.error("Admin createCourse error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create course." });
  }
};

// PUT /api/admin/courses/:id
const updateCourseHandler = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description } = req.body;

    if (isNaN(courseId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid course ID." });
    }
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Course title is required." });
    }
    if (!description || !description.trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Course description is required." });
    }

    await updateCourse(courseId, title, description);
    res
      .status(200)
      .json({ status: "success", message: "Course updated successfully" });
  } catch (err) {
    console.error("Admin updateCourse error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update course." });
  }
};

// DELETE /api/admin/courses/:id
const deleteCourseHandler = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (isNaN(courseId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid course ID." });
    }
    await deleteCourse(courseId);
    res
      .status(200)
      .json({ status: "success", message: "Course deleted successfully" });
  } catch (err) {
    console.error("Admin deleteCourse error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete course." });
  }
};

// ─── LESSONS ──────────────────────────────────────────────────
// GET /api/admin/lessons?courseId=1
const getLessonsHandler = async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId || isNaN(courseId)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "courseId query param is required.",
        });
    }
    const lessons = await getLessonsByCourse(courseId);
    res.status(200).json({ status: "success", lessons });
  } catch (err) {
    console.error("Admin getLessons error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to load lessons." });
  }
};

// POST /api/admin/lessons
const createLessonHandler = async (req, res) => {
  try {
    const { course_id, title, content, order_number } = req.body;

    if (!course_id || isNaN(course_id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Valid course_id is required." });
    }
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Lesson title is required." });
    }
    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Lesson content is required." });
    }
    if (title.trim().length < 3) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Title must be at least 3 characters.",
        });
    }
    if (content.trim().length < 50) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Content must be at least 50 characters.",
        });
    }

    // If order_number not provided, auto-assign next available
    let orderNum = parseInt(order_number);
    if (!orderNum || orderNum < 1) {
      const maxOrder = await getMaxOrderNumber(course_id);
      orderNum = maxOrder + 1;
    }

    const newId = await createLesson(course_id, title, content, orderNum);
    res.status(201).json({
      status: "success",
      message: "Lesson created successfully",
      lessonId: newId,
    });
  } catch (err) {
    console.error("Admin createLesson error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create lesson." });
  }
};

// PUT /api/admin/lessons/:id
const updateLessonHandler = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { title, content, order_number } = req.body;

    if (isNaN(lessonId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid lesson ID." });
    }
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ status: "error", message: "Lesson title is required." });
    }
    if (!content || content.trim().length < 50) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Content must be at least 50 characters.",
        });
    }

    const orderNum = parseInt(order_number) || 1;
    await updateLesson(lessonId, title, content, orderNum);
    res
      .status(200)
      .json({ status: "success", message: "Lesson updated successfully" });
  } catch (err) {
    console.error("Admin updateLesson error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update lesson." });
  }
};

// DELETE /api/admin/lessons/:id
const deleteLessonHandler = async (req, res) => {
  try {
    const lessonId = req.params.id;
    if (isNaN(lessonId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid lesson ID." });
    }
    await deleteLesson(lessonId);
    res
      .status(200)
      .json({ status: "success", message: "Lesson deleted successfully" });
  } catch (err) {
    console.error("Admin deleteLesson error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete lesson." });
  }
};

module.exports = {
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
};
