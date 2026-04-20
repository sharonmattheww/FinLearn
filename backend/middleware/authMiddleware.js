const { verifyToken } = require("../utils/jwtUtils");

const protect = (req, res, next) => {
  try {
    // The frontend sends the token in the Authorization header like:
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }

    // Extract the token part after "Bearer "
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. Token is missing.",
      });
    }

    // Verify the token using our secret key
    // If invalid or expired, jwt.verify throws an error
    const decoded = verifyToken(token);

    // Attach decoded user info to req so route handlers can use it
    // Any protected route can now access req.user.id and req.user.role
    req.user = decoded;

    next(); // move to the actual route handler
  } catch (err) {
    // JsonWebTokenError = tampered token
    // TokenExpiredError = token is older than 7 days
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Session expired. Please login again.",
      });
    }
    return res.status(401).json({
      status: "error",
      message: "Invalid token. Please login again.",
    });
  }
};

module.exports = { protect };
