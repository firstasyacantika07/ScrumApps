const db = require('../config/db');

/**
 * CREATE PROJECT (With SaaS Limit)
 */
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Ambil data paket user & jumlah proyek saat ini
    const [userPlan] = await db.query(
      `SELECT package_type, subscription_status, subscription_ends_at FROM tbr_users WHERE id = ?`,
      [userId]
    );

    const [projectCount] = await db.query(
      `SELECT COUNT(*) as total FROM tbr_projects WHERE user_id = ?`,
      [userId]
    );

    const package = userPlan[0].package_type || 'FREE';
    const currentTotal = projectCount[0].total;

    // 2. Logika Limitasi Proyek
    if (package === 'FREE' && currentTotal >= 1) {
      return res.status(403).json({ 
        message: "Limit paket FREE tercapai (Maks 1 Proyek). Silakan upgrade ke PRO." 
      });
    }

    if (package === 'PRO' && currentTotal >= 15) {
      return res.status(403).json({ 
        message: "Limit paket PRO tercapai (Maks 15 Proyek). Silakan hubungi admin untuk paket ENTERPRISE." 
      });
    }

    // 3. Eksekusi Insert jika lolos validasi
    const sql = `
      INSERT INTO tbr_projects 
      (name, start_date, end_date, status, icon, label, user_id, \`read\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
      message: "Project created",
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
    // Menampilkan proyek milik sendiri atau proyek di mana user menjadi member
    const [rows] = await db.query(
      `SELECT p.* FROM tbr_projects p 
       LEFT JOIN tbr_teams t ON p.id = t.project_id
       WHERE p.user_id = ? OR t.user_id = ?
       GROUP BY p.id`,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query(
      `UPDATE tbr_projects SET name=?, start_date=?, end_date=?, status=? WHERE id=? AND user_id=?`,
      [req.body.name, req.body.start_date, req.body.end_date, req.body.status, req.params.id, userId]
    );
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await db.query(`DELETE FROM tbr_projects WHERE id=? AND user_id=?`, [req.params.id, req.user.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT status, COUNT(*) as total FROM tbr_projects WHERE user_id = ? GROUP BY status`,
      [req.user.id]
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