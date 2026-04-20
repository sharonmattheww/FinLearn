const jwt = require("jsonwebtoken");

// Generate a JWT token for a logged-in user.
// Payload contains user id and role — enough to identify them on protected routes.
// Token expires in 7 days — user stays logged in for a week.
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Verify an incoming JWT token.
// Returns the decoded payload { id, role, iat, exp } if valid.
// Throws an error if the token is expired or tampered with.
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
