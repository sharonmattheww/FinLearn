const {
  checkCourseCompletion,
  getCertificate,
  getAllCertificatesForUser,
  issueCertificate,
} = require("../queries/certificateQueries");

// ─── GET OR GENERATE CERTIFICATE ─────────────────────────────
// GET /api/certificates/:courseId
// Returns certificate data if eligible.
// If eligible and not yet issued, issues it automatically.
const getCertificateHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    if (isNaN(courseId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    // ── Step 1: Check completion eligibility ─────────────────
    const completion = await checkCourseCompletion(userId, courseId);

    if (!completion.eligible) {
      return res.status(403).json({
        status: "error",
        message: "You have not completed all lessons in this course yet.",
        progress: {
          completed: completion.completedLessons,
          total: completion.totalLessons,
          remaining: completion.totalLessons - completion.completedLessons,
        },
      });
    }

    // ── Step 2: Issue certificate if not already issued ───────
    // issueCertificate uses INSERT IGNORE so calling it twice is safe
    const certificate = await issueCertificate(userId, courseId);

    if (!certificate) {
      return res.status(500).json({
        status: "error",
        message: "Failed to generate certificate. Please try again.",
      });
    }

    // ── Step 3: Return certificate data ───────────────────────
    res.status(200).json({
      status: "success",
      certificate: {
        id: certificate.id,
        student_name: certificate.student_name,
        course_title: certificate.course_title,
        course_id: certificate.course_id,
        issued_at: certificate.issued_at,
      },
    });
  } catch (err) {
    console.error("getCertificate error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to load certificate. Please try again.",
    });
  }
};

// ─── GET ALL CERTIFICATES FOR USER ───────────────────────────
// GET /api/certificates
// Returns all certificates earned by the logged-in user
const getAllCertificatesHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificates = await getAllCertificatesForUser(userId);

    res.status(200).json({
      status: "success",
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    console.error("getAllCertificates error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to load certificates.",
    });
  }
};

module.exports = {
  getCertificateHandler,
  getAllCertificatesHandler,
};
