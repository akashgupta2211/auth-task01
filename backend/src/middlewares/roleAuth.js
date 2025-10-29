// src/middleware/roleAuth.js
export const isManagerOrAdmin = (req, res, next) => {
  if (req.user.role === "manager" || req.user.role === "admin") return next();
  return res.status(403).json({ message: "Access denied" });
};
