const pool = require("../config/db");

// ─── Check if user has completed ALL lessons in a course ──────
// A user is eligible for a certificate only when every lesson
// in the course has a completed = TRUE row in the progress table
const checkCourseCompletion = async (userId, courseId) => {
  // Total lessons in the course
  const [totalResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?`,
    [courseId],
  );
  const totalLessons = parseInt(totalResult[0].total);

  // If course has no lessons, not eligible
  if (totalLessons === 0)
    return { eligible: false, totalLessons: 0, completedLessons: 0 };

  // Lessons completed by this user in this course
  const [doneResult] = await pool.query(
    `SELECT COUNT(*) AS done
     FROM progress
     WHERE user_id = ? AND course_id = ? AND completed = TRUE`,
    [userId, courseId],
  );
  const completedLessons = parseInt(doneResult[0].done);

  return {
    eligible: completedLessons >= totalLessons,
    totalLessons,
    completedLessons,
  };
};

// ─── Get existing certificate for a user + course ─────────────
const getCertificate = async (userId, courseId) => {
  const [rows] = await pool.query(
    `SELECT 
       cert.id,
       cert.user_id,
       cert.course_id,
       cert.issued_at,
       u.name        AS student_name,
       c.title       AS course_title
     FROM certificates cert
     JOIN users   u ON u.id = cert.user_id
     JOIN courses c ON c.id = cert.course_id
     WHERE cert.user_id = ? AND cert.course_id = ?`,
    [userId, courseId],
  );
  return rows[0]; // undefined if not yet issued
};

// ─── Get all certificates for a user ─────────────────────────
const getAllCertificatesForUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
       cert.id,
       cert.course_id,
       cert.issued_at,
       c.title AS course_title
     FROM certificates cert
     JOIN courses c ON c.id = cert.course_id
     WHERE cert.user_id = ?
     ORDER BY cert.issued_at DESC`,
    [userId],
  );
  return rows;
};

// ─── Issue a new certificate ──────────────────────────────────
// Uses INSERT IGNORE so duplicate calls don't cause an error
// (UNIQUE KEY unique_user_course on the table handles this)
const issueCertificate = async (userId, courseId) => {
  const [result] = await pool.query(
    `INSERT IGNORE INTO certificates (user_id, course_id)
     VALUES (?, ?)`,
    [userId, courseId],
  );

  // Fetch and return the certificate (whether just created or existing)
  return getCertificate(userId, courseId);
};

module.exports = {
  checkCourseCompletion,
  getCertificate,
  getAllCertificatesForUser,
  issueCertificate,
};
