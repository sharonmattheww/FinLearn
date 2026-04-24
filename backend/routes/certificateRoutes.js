const express = require("express");
const router = express.Router();
const {
  getCertificateHandler,
  getAllCertificatesHandler,
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/certificates
// All certificates earned by logged-in user
router.get("/", protect, getAllCertificatesHandler);

// GET /api/certificates/:courseId
// Get or generate certificate for a specific course
router.get("/:courseId", protect, getCertificateHandler);

module.exports = router;
