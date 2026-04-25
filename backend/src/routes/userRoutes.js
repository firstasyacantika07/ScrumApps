const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- 1. ROUTE LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cari user berdasarkan email
        const [rows] = await db.query('SELECT * FROM tbr_users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: "Email tidak terdaftar!" });
        }

        const user = rows[0];

        // Bandingkan password input dengan hash di DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Kata sandi salah!" });
        }

        // Login sukses: Kirim data user tanpa password
        const { password: _, ...userData } = user;
        return res.status(200).json({ 
            message: "Login berhasil", 
            user: userData 
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// --- 2. ROUTE UPDATE PROFIL (Digunakan di KelolaProfil.jsx) ---
router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, gender, nik, alamat, phone, email } = req.body;

    try {
        const query = `
            UPDATE tbr_users 
            SET username = ?, gender = ?, nik = ?, alamat = ?, phone = ?, email = ? 
            WHERE id = ?
        `;
        
        const [result] = await db.query(query, [
            username, 
            gender, 
            nik, 
            alamat, 
            phone, 
            email, 
            userId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        console.log(`[Update Success] User ID: ${userId} telah diperbarui.`);
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
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Tambah user baru (Register / Admin Create)
router.post('/', async (req, res) => {
    try {
        const { password } = req.body;
        
        // Proteksi: Hash password sebelum disimpan jika user baru dibuat
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userData = { ...req.body, password: hashedPassword };
        const id = await User.create(userData);
        
        res.status(201).json({ id, message: "User berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Hapus user
router.delete('/:id', async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.json({ message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;