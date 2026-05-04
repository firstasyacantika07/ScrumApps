// middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Token diperlukan" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [rows] = await db.query(
      `SELECT id, name, email, role, package_type, subscription_status 
       FROM tbr_users WHERE id = ?`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "User tidak ditemukan" 
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: "Token tidak valid" 
    });
  }
};

module.exports = auth;