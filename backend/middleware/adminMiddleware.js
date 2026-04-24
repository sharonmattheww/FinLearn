// adminOnly middleware
// Must be used AFTER the protect middleware.
// protect verifies the JWT and sets req.user.
// adminOnly then checks if that user's role is 'admin'.

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Not authenticated. Please login first.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. This area is for administrators only.",
    });
  }

  next();
};

module.exports = { adminOnly };
