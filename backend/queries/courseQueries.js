const pool = require("../config/db");

// Get all courses — used for the courses listing page
const getAllCourses = async () => {
  const [rows] = await pool.query(
    `SELECT 
       c.id,
       c.title,
       c.description,
       c.thumbnail_url,
       c.created_at,
       COUNT(l.id) AS lesson_count
     FROM courses c
     LEFT JOIN lessons l ON l.course_id = c.id
     GROUP BY c.id
     ORDER BY c.id ASC`,
  );
  return rows;
};

// Get a single course by ID — used for the course detail page
const getCourseById = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT id, title, description, thumbnail_url, created_at
     FROM courses
     WHERE id = ?`,
    [courseId],
  );
  return rows[0]; // undefined if not found
};

// Get all lessons belonging to a course, ordered by order_number
const getLessonsByCourseId = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT id, course_id, title, order_number, created_at
     FROM lessons
     WHERE course_id = ?
     ORDER BY order_number ASC`,
    [courseId],
  );
  return rows;
};

module.exports = {
  getAllCourses,
  getCourseById,
  getLessonsByCourseId,
};
