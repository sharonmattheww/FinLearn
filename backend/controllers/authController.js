const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwtUtils");
const {
  findUserByEmail,
  findUserById,
  createUser,
} = require("../queries/userQueries");

// ─── Helper: Input Validators ─────────────────────────────────

// Checks if email format is valid using a simple regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Checks if password meets minimum requirements
const isValidPassword = (password) => {
  return password && password.length >= 8;
};

// ─── REGISTER ─────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new student account
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Step 1: Validate all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required: name, email, password",
      });
    }

    // ── Step 2: Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Name must be at least 2 characters long",
      });
    }

    // ── Step 3: Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      });
    }

    // ── Step 4: Validate password length
    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    // ── Step 5: Check if email is already registered
    const existingUser = await findUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "An account with this email already exists",
      });
    }

    // ── Step 6: Hash the password
    // Salt rounds = 10 means bcrypt runs 2^10 = 1024 hashing rounds
    // Higher = more secure but slower. 10 is the standard for most apps.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ── Step 7: Save user to database
    const newUserId = await createUser(
      name.trim(),
      email.toLowerCase(),
      hashedPassword,
    );

    // ── Step 8: Generate JWT token for the new user
    const token = generateToken(newUserId, "student");

    // ── Step 9: Send success response
    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      token,
      user: {
        id: newUserId,
        name: name.trim(),
        email: email.toLowerCase(),
        role: "student",
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Server error during registration. Please try again.",
    });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────
// POST /api/auth/login
// Logs in an existing user and returns a JWT token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Step 1: Validate fields present
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // ── Step 2: Find user by email
    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      // Use a generic message — do not tell attackers whether
      // the email exists or not
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // ── Step 3: Compare entered password with hashed password in DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // ── Step 4: Generate JWT token
    const token = generateToken(user.id, user.role);

    // ── Step 5: Send response (never send password back)
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Server error during login. Please try again.",
    });
  }
};

// ─── GET ME ───────────────────────────────────────────────────
// GET /api/auth/me
// Returns the currently logged-in user's profile
// Requires valid JWT (uses protect middleware)
const getMe = async (req, res) => {
  try {
    // req.user.id was set by the protect middleware
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    console.error("GetMe error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Server error. Please try again.",
    });
  }
};

module.exports = { register, login, getMe };
