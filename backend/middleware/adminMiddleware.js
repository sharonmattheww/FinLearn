// This middleware must always be used AFTER protect middleware.
// protect puts req.user on the request — we check its role here.
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Admins only.",
    });
  }
  next();
};

module.exports = { adminOnly };
