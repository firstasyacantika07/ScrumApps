const db = require('../config/db');

// CREATE: Tambah Proyek Baru
exports.createProject = async (req, res) => {
    const { project_name, client_name, project_status, category, duration, po_name } = req.body;
    try {
        const query = `INSERT INTO tbr_projects (project_name, client_name, project_status, category, duration, po_name) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [project_name, client_name, project_status || 'Hold', category, duration, po_name]);
        res.status(201).json({ id: result.insertId, message: "Proyek berhasil dibuat" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE: Edit Proyek
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { project_name, client_name, project_status } = req.body;
    try {
        await db.query(
            'UPDATE tbr_projects SET project_name = ?, client_name = ?, project_status = ? WHERE id = ?',
            [project_name, client_name, project_status, id]
        );
        res.json({ message: "Proyek berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE: Hapus Proyek
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM tbr_projects WHERE id = ?', [id]);
        res.json({ message: "Proyek berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};