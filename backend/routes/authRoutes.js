const express = require('express');
const router = express.Router();

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// =====================
// GET ME (SAFE VERSION)
// =====================
router.get('/me', verifyToken, (req, res) => {
    if (!authController || !authController.getMe) {
        return res.status(500).json({
            message: "authController.getMe tidak ditemukan"
        });
    }

    return authController.getMe(req, res);
});

// =====================
// LOGIN
// =====================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM tbr_users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: "Email tidak terdaftar!"
            });
        }

        const user = rows[0];

        // fix bcrypt php hash
        let hash = user.password;
        if (hash.startsWith('$2y$')) {
            hash = '$2a$' + hash.slice(4);
        }

        const isMatch = await bcrypt.compare(password, hash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Kata sandi salah!"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                tenant_id: user.tenant_id || 0
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                role: user.role,
                package_type: user.package_type,
                subscription_status: user.subscription_status,
                trial_ends_at: user.trial_ends_at,
                subscription_ends_at: user.subscription_ends_at,
                token
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;