const db = require('../config/db');

/**
 * CREATE PROJECT (With SaaS Limit)
 */
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Ambil data paket user & jumlah proyek saat ini
    const [userPlan] = await db.query(
      `SELECT package_type FROM tbr_users WHERE id = ?`,
      [userId]
    );

    const [projectCount] = await db.query(
      `SELECT COUNT(*) as total FROM tbr_projects WHERE user_id = ?`,
      [userId]
    );

    const packageType = userPlan[0]?.package_type || 'FREE';
    const currentTotal = projectCount[0]?.total || 0;

    // 2. Logika Limitasi Proyek
    if (packageType === 'FREE' && currentTotal >= 1) {
      return res.status(403).json({ 
        message: "Limit paket FREE tercapai (Maks 1 Proyek). Silakan upgrade ke PRO." 
      });
    }

    if (packageType === 'PRO' && currentTotal >= 15) {
      return res.status(403).json({ 
        message: "Limit paket PRO tercapai (Maks 15 Proyek)." 
      });
    }

    // 3. Eksekusi Insert
    const sql = `
      INSERT INTO tbr_projects 
      (name, start_date, end_date, status, icon, label, user_id, \`read\`, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      req.body.name,
      req.body.start_date || null,
      req.body.end_date || null,
      req.body.status || 'hold',
      req.body.icon || 'ki-duotone ki-star',
      req.body.label || 'external',
      userId,
      0 
    ];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      message: "Project created successfully",
      id: result.insertId
    });

  } catch (err) {
    console.error("❌ CREATE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET PROJECTS
 */
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT p.* FROM tbr_projects p 
       LEFT JOIN tbr_teams t ON p.id = t.project_id
       WHERE p.user_id = ? OR t.user_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET PROJECT BY ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const [rows] = await db.query(
      `SELECT p.* FROM tbr_projects p 
       LEFT JOIN tbr_teams t ON p.id = t.project_id
       WHERE p.id = ? AND (p.user_id = ? OR t.user_id = ?)
       GROUP BY p.id`,
      [projectId, userId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Proyek tidak ditemukan." });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * =====================================================
 * DEVELOPMENT PROGRESS (Fungsi Baru untuk Fix Error)
 * =====================================================
 */

// 1. GET DEVELOPMENTS
exports.getProjectDevelopments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM tbr_developments WHERE project_id = ? ORDER BY created_at DESC`,
      [projectId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. CREATE DEVELOPMENT (Milestone)
exports.createDevelopment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, progress, description } = req.body;
    
    await db.query(
      `INSERT INTO tbr_developments (project_id, title, progress, description, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [projectId, title, progress, description]
    );
    
    res.status(201).json({ message: "Milestone created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. DELETE DEVELOPMENT
exports.deleteDevelopment = async (req, res) => {
  try {
    const { devId } = req.params;
    
    const [result] = await db.query(`DELETE FROM tbr_developments WHERE id = ?`, [devId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Milestone tidak ditemukan." });
    }
    
    res.json({ message: "Milestone deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * =====================================================
 * UPDATE & DELETE PROJECT
 * =====================================================
 */

exports.updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const [result] = await db.query(
      `UPDATE tbr_projects SET name=?, start_date=?, end_date=?, status=?, updated_at=NOW() 
       WHERE id=? AND user_id=?`,
      [req.body.name, req.body.start_date, req.body.end_date, req.body.status, projectId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gagal update proyek." });
    }

    res.json({ message: "Project updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const [result] = await db.query(
      `DELETE FROM tbr_projects WHERE id=? AND user_id=?`, 
      [projectId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Proyek tidak ditemukan." });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET PROJECT STATS
 */
exports.getProjectStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT status, COUNT(*) as total FROM tbr_projects WHERE user_id = ? GROUP BY status`,
      [userId]
    );

    const result = {
      total: rows.reduce((a, b) => a + Number(b.total), 0),
      hold: rows.find(r => r.status === 'hold')?.total || 0,
      onProgress: rows.find(r => r.status === 'on_progress')?.total || 0,
      done: rows.find(r => r.status === 'done')?.total || 0,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};