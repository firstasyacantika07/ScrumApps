const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Route khusus Super Admin
router.get('/admin', verifyToken, authorizeRole(['Super Admin']), (req, res) => {
    res.json({ message: "Welcome to Super Admin Dashboard" });
});

// Route khusus Business Analyst
router.get('/analyst', verifyToken, authorizeRole(['Business Analyst']), (req, res) => {
    res.json({ message: "Welcome to Business Analyst Dashboard" });
});

// Route khusus Team Developer
router.get('/developer', verifyToken, authorizeRole(['Team Developer']), (req, res) => {
    res.json({ message: "Welcome to Developer Dashboard" });
});

module.exports = router;