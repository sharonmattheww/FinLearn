const pool = require("../config/db");

// ─── DASHBOARD STATS ──────────────────────────────────────────
const getDashboardStats = async () => {
  const [users] = await pool.query(
    'SELECT COUNT(*) AS count FROM users WHERE role = "student"',
  );
  const [courses] = await pool.query("SELECT COUNT(*) AS count FROM courses");
  const [lessons] = await pool.query("SELECT COUNT(*) AS count FROM lessons");
  const [quizAttempts] = await pool.query(
    "SELECT COUNT(*) AS count FROM quiz_attempts",
  );
  const [certificates] = await pool.query(
    "SELECT COUNT(*) AS count FROM certificates",
  );
  const [progress] = await pool.query(
    "SELECT COUNT(*) AS count FROM progress WHERE completed = TRUE",
  );

  return {
    total_students: parseInt(users[0].count),
    total_courses: parseInt(courses[0].count),
    total_lessons: parseInt(lessons[0].count),
    total_quiz_attempts: parseInt(quizAttempts[0].count),
    total_certificates: parseInt(certificates[0].count),
    total_completions: parseInt(progress[0].count),
  };
};

// ─── USER QUERIES ─────────────────────────────────────────────
const getAllUsers = async () => {
  const [rows] = await pool.query(
    `SELECT 
       u.id,
       u.name,
       u.email,
       u.role,
       u.created_at,
       COUNT(DISTINCT p.lesson_id)  AS lessons_completed,
       COUNT(DISTINCT cert.id)      AS certificates_earned
     FROM users u
     LEFT JOIN progress p    ON p.user_id = u.id AND p.completed = TRUE
     LEFT JOIN certificates cert ON cert.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`,
  );
  return rows;
};

// ─── COURSE QUERIES ───────────────────────────────────────────
const getAllCoursesAdmin = async () => {
  const [rows] = await pool.query(
    `SELECT 
       c.id,
       c.title,
       c.description,
       c.created_at,
       COUNT(l.id) AS lesson_count
     FROM courses c
     LEFT JOIN lessons l ON l.course_id = c.id
     GROUP BY c.id
     ORDER BY c.id ASC`,
  );
  return rows;
};

const createCourse = async (title, description) => {
  const [result] = await pool.query(
    `INSERT INTO courses (title, description) VALUES (?, ?)`,
    [title.trim(), description.trim()],
  );
  return result.insertId;
};

const updateCourse = async (courseId, title, description) => {
  await pool.query(
    `UPDATE courses SET title = ?, description = ? WHERE id = ?`,
    [title.trim(), description.trim(), courseId],
  );
};

const deleteCourse = async (courseId) => {
  // ON DELETE CASCADE handles lessons, quizzes, questions, progress, certificates
  await pool.query(`DELETE FROM courses WHERE id = ?`, [courseId]);
};

// ─── LESSON QUERIES ───────────────────────────────────────────
const getLessonsByCourse = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT id, course_id, title, content, order_number, created_at
     FROM lessons
     WHERE course_id = ?
     ORDER BY order_number ASC`,
    [courseId],
  );
  return rows;
};

const getLessonById = async (lessonId) => {
  const [rows] = await pool.query(
    `SELECT id, course_id, title, content, order_number
     FROM lessons WHERE id = ?`,
    [lessonId],
  );
  return rows[0];
};

const createLesson = async (courseId, title, content, orderNumber) => {
  const [result] = await pool.query(
    `INSERT INTO lessons (course_id, title, content, order_number)
     VALUES (?, ?, ?, ?)`,
    [courseId, title.trim(), content.trim(), orderNumber],
  );
  return result.insertId;
};

const updateLesson = async (lessonId, title, content, orderNumber) => {
  await pool.query(
    `UPDATE lessons 
     SET title = ?, content = ?, order_number = ?
     WHERE id = ?`,
    [title.trim(), content.trim(), orderNumber, lessonId],
  );
};

const deleteLesson = async (lessonId) => {
  await pool.query(`DELETE FROM lessons WHERE id = ?`, [lessonId]);
};

// Get the highest order_number in a course (for auto-numbering new lessons)
const getMaxOrderNumber = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT COALESCE(MAX(order_number), 0) AS max_order
     FROM lessons WHERE course_id = ?`,
    [courseId],
  );
  return parseInt(rows[0].max_order);
};

module.exports = {
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
};
