const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 1. STATISTIK PROYEK (Untuk Dashboard) ---
// Letakkan rute statis (tanpa :id) di atas agar tidak bentrok dengan rute dinamis
router.get('/stats', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM tbr_projects) as total,
                (SELECT COUNT(*) FROM tbr_projects WHERE project_status = 'Hold') as hold,
                (SELECT COUNT(*) FROM tbr_projects WHERE project_status = 'In Progress') as progress,
                (SELECT COUNT(*) FROM tbr_projects WHERE project_status = 'Done') as done
        `);
        res.json(rows[0]);
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- 2. MANAJEMEN PROYEK (CRUD) ---

// Get All Projects
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbr_projects ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Project
router.post('/', async (req, res) => {
    const { project_name, client_name, project_type, project_status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tbr_projects (project_name, client_name, project_type, project_status) VALUES (?, ?, ?, ?)',
            [project_name, client_name, project_type, project_status || 'In Progress']
        );
        res.status(201).json({ id: result.insertId, message: "Proyek berhasil dibuat" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Detail Project by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbr_projects WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Proyek tidak ditemukan" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Project
router.put('/:id', async (req, res) => {
    const { project_name, client_name, project_type, project_status } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE tbr_projects SET project_name = ?, client_name = ?, project_type = ?, project_status = ? WHERE id = ?',
            [project_name, client_name, project_type, project_status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Proyek gagal diperbarui" });
        res.json({ message: "Proyek berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Project
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM tbr_projects WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Proyek tidak ditemukan" });
        res.json({ message: "Proyek berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. MANAJEMEN BACKLOG ---

// Get Backlogs by Project ID
router.get('/:id/backlogs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbr_backlogs WHERE project_id = ?', [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Backlog to Project
router.post('/:id/backlogs', async (req, res) => {
    const { user_story, priority } = req.body;
    const project_id = req.params.id;
    try {
        const [result] = await db.query(
            'INSERT INTO tbr_backlogs (project_id, user_story, priority, is_done) VALUES (?, ?, ?, 0)',
            [project_id, user_story, priority]
        );
        res.status(201).json({ id: result.insertId, project_id, user_story, priority, is_done: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. MANAJEMEN SPRINT ---

// Get Sprints by Project ID
router.get('/:id/sprints', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbr_sprints WHERE project_id = ?', [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;