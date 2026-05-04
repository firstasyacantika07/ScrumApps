const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      `SELECT id, name, email, password, role, tenant_id, subscription_status 
       FROM tbr_users WHERE email = ?`,
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Email/password salah" });
    }

    let hashedPassword = user.password;
    if (hashedPassword.startsWith('$2y$')) {
      hashedPassword = '$2a$' + hashedPassword.slice(4);
    }

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return res.status(401).json({ message: "Email/password salah" });
    }

    if (user.subscription_status !== 'active') {
      return res.status(403).json({ message: "Subscription tidak aktif" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        tenant_id: user.tenant_id || 0
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};