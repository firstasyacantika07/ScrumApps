const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.tenantId = decoded.tenant_id || 0;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token tidak valid / expired" });
  }
};

// 🔥 TAMBAHAN INI (WAJIB)
const authorize = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: akses ditolak" });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorize
};