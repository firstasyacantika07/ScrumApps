const express = require('express');
const router = express.Router();

const db = require('../config/db');
const bcrypt = require('bcryptjs');

const { verifyToken, authorize } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// ================= MIDDLEWARE =================
router.use(verifyToken);

// ================= GET ALL USERS =================
router.get('/', authorize('Superadmin'), async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, name, email, role, phone_number, gender
      FROM tbr_users
    `);

    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= CREATE USER =================
router.post('/', authorize('Superadmin'), async (req, res) => {
  try {
    const { name, email, password, role, phone_number, gender } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      `INSERT INTO tbr_users (name, email, password, role, phone_number, gender)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, phone_number, gender]
    );

    res.status(201).json({ message: "User berhasil dibuat" });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE USER =================
router.put('/:id', authorize('Superadmin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, gender, email, phone_number, password } = req.body;

    let query = `
      UPDATE tbr_users
      SET name=?, gender=?, email=?, phone_number=?
    `;

    let params = [name, gender, email, phone_number];

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += `, password=?`;
      params.push(hashedPassword);
    }

    query += ` WHERE id=?`;
    params.push(userId);

    await db.query(query, params);

    res.json({ message: "User berhasil diupdate" });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE USER =================
router.delete('/:id', authorize('Superadmin'), async (req, res) => {
  try {
    await db.query('DELETE FROM tbr_users WHERE id=?', [req.params.id]);
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;