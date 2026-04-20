const pool = require("../config/db");

// Find a user by their email address.
// Used during login to check if the user exists.
const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0]; // returns undefined if not found
};

// Find a user by their ID.
// Used in the /me route to return logged-in user profile.
const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id],
  );
  return rows[0];
};

// Insert a new user into the database.
// Password must already be hashed before calling this.
const createUser = async (name, email, hashedPassword) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, "student"],
  );
  return result.insertId; // returns the new user's ID
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
