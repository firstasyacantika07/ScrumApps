const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: "Token diperlukan" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query(
      `SELECT id, name, email, role FROM tbr_users WHERE id = ?`,
      [decoded.id]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "User tidak ditemukan" });

    req.user = rows[0];
    next();

  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userRole = req.user.role?.toLowerCase().trim();
    const allowedRoles = roles.map(r => r.toLowerCase().trim());

    if (userRole === "superadmin") return next();

    if (roles.length && !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorize
};