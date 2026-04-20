const pool = require("../config/db");

// Get a single lesson by ID — includes full content
// Also fetches the course title so the frontend can show breadcrumbs
const getLessonById = async (lessonId) => {
  const [rows] = await pool.query(
    `SELECT 
       l.id,
       l.course_id,
       l.title,
       l.content,
       l.order_number,
       l.created_at,
       c.title AS course_title
     FROM lessons l
     JOIN courses c ON c.id = l.course_id
     WHERE l.id = ?`,
    [lessonId],
  );
  return rows[0];
};

// Get the next lesson in the same course after the current one
// Used to show a "Next Lesson" button at the bottom of lesson page
const getNextLesson = async (courseId, currentOrderNumber) => {
  const [rows] = await pool.query(
    `SELECT id, title, order_number
     FROM lessons
     WHERE course_id = ? AND order_number > ?
     ORDER BY order_number ASC
     LIMIT 1`,
    [courseId, currentOrderNumber],
  );
  return rows[0]; // undefined if this is the last lesson
};

// Get the previous lesson in the same course
const getPrevLesson = async (courseId, currentOrderNumber) => {
  const [rows] = await pool.query(
    `SELECT id, title, order_number
     FROM lessons
     WHERE course_id = ? AND order_number < ?
     ORDER BY order_number DESC
     LIMIT 1`,
    [courseId, currentOrderNumber],
  );
  return rows[0];
};

// Mark a lesson as completed for a specific user
// Uses INSERT ... ON DUPLICATE KEY UPDATE so calling it twice is safe
const markLessonComplete = async (userId, courseId, lessonId) => {
  await pool.query(
    `INSERT INTO progress (user_id, course_id, lesson_id, completed, completed_at)
     VALUES (?, ?, ?, TRUE, NOW())
     ON DUPLICATE KEY UPDATE
       completed = TRUE,
       completed_at = NOW()`,
    [userId, courseId, lessonId],
  );
};

// Check if a specific lesson is already completed by the user
const isLessonCompleted = async (userId, lessonId) => {
  const [rows] = await pool.query(
    `SELECT completed FROM progress
     WHERE user_id = ? AND lesson_id = ?`,
    [userId, lessonId],
  );
  return rows[0]?.completed === 1;
};

module.exports = {
  getLessonById,
  getNextLesson,
  getPrevLesson,
  markLessonComplete,
  isLessonCompleted,
};
