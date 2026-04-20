const pool = require("../config/db");

// ─── Get quiz by ID with all its questions ────────────────────
// Note: We do NOT send correct_option to the frontend here.
// Correct answers are only used server-side during submission.
const getQuizWithQuestions = async (quizId) => {
  // First get the quiz info
  const [quizRows] = await pool.query(
    `SELECT q.id, q.title, q.course_id, q.lesson_id,
            c.title AS course_title
     FROM quizzes q
     JOIN courses c ON c.id = q.course_id
     WHERE q.id = ?`,
    [quizId],
  );

  if (quizRows.length === 0) return null;

  // Then get the questions — WITHOUT correct_option
  const [questions] = await pool.query(
    `SELECT id, question_text, option_a, option_b, option_c, option_d
     FROM questions
     WHERE quiz_id = ?
     ORDER BY id ASC`,
    [quizId],
  );

  return {
    ...quizRows[0],
    questions,
  };
};

// ─── Get correct answers for a quiz (server-side only) ────────
// Called during submission to check answers
const getCorrectAnswers = async (quizId) => {
  const [rows] = await pool.query(
    `SELECT id, correct_option
     FROM questions
     WHERE quiz_id = ?`,
    [quizId],
  );
  return rows; // [{ id: 1, correct_option: 'b' }, ...]
};

// ─── Get quiz linked to a specific lesson ─────────────────────
// Used in LessonDetail to show "Take Quiz" button
const getQuizByLessonId = async (lessonId) => {
  const [rows] = await pool.query(
    `SELECT id, title FROM quizzes WHERE lesson_id = ?`,
    [lessonId],
  );
  return rows[0]; // undefined if no quiz for this lesson
};

// ─── Save a quiz attempt ──────────────────────────────────────
// If student already has an attempt, only update if new score is HIGHER
const saveQuizAttempt = async (userId, quizId, score, total) => {
  // Check if an attempt already exists
  const [existing] = await pool.query(
    `SELECT id, score FROM quiz_attempts
     WHERE user_id = ? AND quiz_id = ?`,
    [userId, quizId],
  );

  if (existing.length === 0) {
    // No previous attempt — insert new row
    await pool.query(
      `INSERT INTO quiz_attempts (user_id, quiz_id, score, total)
       VALUES (?, ?, ?, ?)`,
      [userId, quizId, score, total],
    );
  } else if (score > existing[0].score) {
    // Previous attempt exists — only update if new score is better
    await pool.query(
      `UPDATE quiz_attempts
       SET score = ?, attempted_at = NOW()
       WHERE user_id = ? AND quiz_id = ?`,
      [score, userId, quizId],
    );
  }
  // If new score is lower or equal, do nothing — keep the best score
};

// ─── Get a user's best attempt for a quiz ────────────────────
const getUserAttempt = async (userId, quizId) => {
  const [rows] = await pool.query(
    `SELECT score, total, attempted_at
     FROM quiz_attempts
     WHERE user_id = ? AND quiz_id = ?`,
    [userId, quizId],
  );
  return rows[0]; // undefined if never attempted
};

module.exports = {
  getQuizWithQuestions,
  getCorrectAnswers,
  getQuizByLessonId,
  saveQuizAttempt,
  getUserAttempt,
};
