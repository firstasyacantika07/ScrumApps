const db = require('../config/db');

/**
 * GET PROJECTS
 */
exports.getProjects = async (req, res) => {
  try {
    console.log("USER:", req.user);

    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id || 0;

    const [rows] = await db.query(
      `SELECT * FROM tbr_projects WHERE user_id = ? AND tenant_id = ?`,
      [userId, tenantId]
    );

    res.json(rows);

  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
/**
 * CREATE PROJECT
 */
exports.createProject = async (req, res) => {
  try {
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id || 0;

    const sql = `
      INSERT INTO tbr_projects 
      (name, start_date, end_date, status, icon, label, user_id, tenant_id, \`read\`, trello_board_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.name,
      req.body.start_date || null,
      req.body.end_date || null,
      req.body.status || 'hold',
      req.body.icon || 'ki-duotone ki-star',
      req.body.label || 'external',
      userId,
      tenantId,
      0,
      null
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
 * UPDATE PROJECT
 */
exports.updateProject = async (req, res) => {
  try {
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id || 0;

    await db.query(
      `UPDATE tbr_projects 
       SET name=?, start_date=?, end_date=?, status=? 
       WHERE id=? AND user_id=? AND tenant_id=?`,
      [
        req.body.name,
        req.body.start_date || null,
        req.body.end_date || null,
        req.body.status,
        req.params.id,
        userId,
        tenantId
      ]
    );

    res.json({ message: "Updated" });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE PROJECT
 */
exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user?.id;
    const tenantId = req.user?.tenant_id || 0;

    await db.query(
      `DELETE FROM tbr_projects WHERE id=? AND user_id=? AND tenant_id=?`,
      [req.params.id, userId, tenantId]
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * PROJECT STATS
 */
exports.getProjectStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    const [rows] = await db.query(
      `SELECT status, COUNT(*) as total 
       FROM tbr_projects 
       WHERE user_id = ?
       GROUP BY status`,
      [userId]
    );

    const result = {
      total: rows.reduce((a, b) => a + Number(b.total), 0),
      hold: rows.find(r => r.status === 'hold')?.total || 0,
      onProgress: rows.find(r => r.status === 'on_progress')?.total || 0,
      done: rows.find(r => r.status === 'done')?.total || 0,
      archive: rows.find(r => r.status === 'archive')?.total || 0,
    };

    res.json(result);

  } catch (err) {
    console.error("❌ STATS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};