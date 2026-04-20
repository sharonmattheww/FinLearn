const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes — no token needed
// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// Protected route — valid JWT required
// GET /api/auth/me
router.get("/me", protect, getMe);

module.exports = router;
