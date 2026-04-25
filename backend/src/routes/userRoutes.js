const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- 1. ROUTE LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM tbr_users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: "Email tidak terdaftar!" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Kata sandi salah!" });
        }

        // Menghapus password agar tidak terkirim ke frontend
        const { password: _, ...userData } = user;
        return res.status(200).json({ message: "Login berhasil", user: userData });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// --- 2. ROUTE UPDATE PROFIL (Digunakan di KelolaProfil.jsx) ---
router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, gender, nik, alamat, phone, email, password } = req.body;

    try {
        // Menggunakan 'name' sesuai dengan struktur database Anda
        let query = `UPDATE tbr_users SET name = ?, gender = ?, nik = ?, alamat = ?, phone = ?, email = ?`;
        let params = [name, gender, nik, alamat, phone, email];

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += `, password = ?`;
            params.push(hashedPassword);
        }

        query += ` WHERE id = ?`;
        params.push(userId);
        
        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.status(200).json({ message: "Profil berhasil diperbarui" });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Gagal memperbarui database" });
    }
});

// --- 3. ROUTE CRUD LAINNYA ---

// GET: Ambil semua user (untuk halaman Daftar Pengguna)
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, phone, gender, nik, alamat FROM tbr_users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Register / Tambah User Baru
router.post('/', async (req, res) => {
    const { name, email, password, phone, gender, nik, alamat } = req.body;
    try {
        if (!password) return res.status(400).json({ message: "Password wajib diisi" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const query = `INSERT INTO tbr_users (name, email, password, phone, gender, nik, alamat) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [
            name, email, hashedPassword, phone, gender, nik, alamat
        ]);
        
        res.status(201).json({ id: result.insertId, message: "User berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Hapus user
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM tbr_users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
        res.json({ message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;