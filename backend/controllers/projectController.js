const db = require('../config/db');

/**
 * ==========================================
 * 1. PROJECT CORE (CRUD & STATS)
 * ==========================================
 */

exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const [userPlan] = await db.query(`SELECT package_type FROM tbr_users WHERE id = ?`, [userId]);
    const [projectCount] = await db.query(`SELECT COUNT(*) as total FROM tbr_projects WHERE user_id = ?`, [userId]);

    const packageType = userPlan[0]?.package_type || 'FREE';
    const currentTotal = projectCount[0]?.total || 0;

    if (packageType === 'FREE' && currentTotal >= 1) return res.status(403).json({ message: "Limit paket FREE tercapai." });
    if (packageType === 'PRO' && currentTotal >= 15) return res.status(403).json({ message: "Limit paket PRO tercapai." });

    const sql = `INSERT INTO tbr_projects (name, start_date, end_date, status, icon, label, user_id, \`read\`, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const values = [req.body.name, req.body.start_date || null, req.body.end_date || null, req.body.status || 'hold', req.body.icon || 'ki-duotone ki-star', req.body.label || 'external', userId, 0];

    const [result] = await db.query(sql, values);
    res.status(201).json({ message: "Project created", id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT p.* FROM tbr_projects p LEFT JOIN tbr_teams t ON p.id = t.project_id WHERE p.user_id = ? OR t.user_id = ? GROUP BY p.id ORDER BY p.created_at DESC`,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getProjectById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.* FROM tbr_projects p LEFT JOIN tbr_teams t ON p.id = t.project_id WHERE p.id = ? AND (p.user_id = ? OR t.user_id = ?) GROUP BY p.id`,
      [req.params.id, req.user.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateProject = async (req, res) => {
  try {
    await db.query(`UPDATE tbr_projects SET name=?, start_date=?, end_date=?, status=?, updated_at=NOW() WHERE id=? AND user_id=?`, [req.body.name, req.body.start_date, req.body.end_date, req.body.status, req.params.id, req.user.id]);
    res.json({ message: "Project updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteProject = async (req, res) => {
  try {
    await db.query(`DELETE FROM tbr_projects WHERE id=? AND user_id=?`, [req.params.id, req.user.id]);
    res.json({ message: "Project deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getProjectStats = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT status, COUNT(*) as total FROM tbr_projects WHERE user_id = ? GROUP BY status`, [req.user.id]);
    const result = {
      total: rows.reduce((a, b) => a + Number(b.total), 0),
      hold: rows.find(r => r.status === 'hold')?.total || 0,
      onProgress: rows.find(r => r.status === 'on_progress')?.total || 0,
      done: rows.find(r => r.status === 'done')?.total || 0,
    };
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

/**
 * ==========================================
 * 2. DEVELOPMENT / TASK MANAGEMENT
 * ==========================================
 */

exports.getProjectDevelopments = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM tbr_developments WHERE project_id = ? ORDER BY created_at DESC`, [req.params.projectId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createDevelopment = async (req, res) => {
  try {
    const { title, description, status, link } = req.body;
    const sql = `INSERT INTO tbr_developments (name, \`desc\`, status, link, project_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
    await db.query(sql, [title, description, status || 'todo', link || null, req.params.projectId]);
    res.status(201).json({ message: "Task created" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateDevelopmentStatus = async (req, res) => {
  try {
    await db.query(`UPDATE tbr_developments SET status = ?, updated_at = NOW() WHERE id = ?`, [req.body.status, req.params.devId]);
    res.json({ message: "Status updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteDevelopment = async (req, res) => {
  try {
    await db.query(`DELETE FROM tbr_developments WHERE id = ?`, [req.params.devId]);
    res.json({ message: "Task deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

/**
 * ==========================================
 * 3. SPRINT MANAGEMENT
 * ==========================================
 */

exports.getProjectSprints = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM tbr_sprints WHERE project_id = ? ORDER BY start_date DESC`, [req.params.projectId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createSprint = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;
    await db.query(`INSERT INTO tbr_sprints (project_id, name, description, start_date, end_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`, 
    [req.params.projectId, name, description, start_date, end_date, status || 'planned']);
    res.status(201).json({ message: "Sprint created" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteSprint = async (req, res) => {
  try {
    await db.query(`DELETE FROM tbr_sprints WHERE id = ?`, [req.params.sprintId]);
    res.json({ message: "Sprint deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

/**
 * ==========================================
 * 4. BACKLOG MANAGEMENT
 * ==========================================
 */

exports.getProjectBacklogs = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM tbr_backlogs WHERE project_id = ? ORDER BY created_at DESC`, [req.params.projectId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createBacklog = async (req, res) => {
  try {
    const { name, description, priority, applicant, status, sprint_id } = req.body;
    const sql = `INSERT INTO tbr_backlogs (name, description, priority, applicant, status, sprint_id, project_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    await db.query(sql, [name, description, priority, applicant, status, sprint_id, req.params.projectId, req.user.id]);
    res.status(201).json({ message: "Backlog created" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateBacklog = async (req, res) => {
  try {
    const { name, description, priority, applicant, status, sprint_id } = req.body;
    await db.query(`UPDATE tbr_backlogs SET name=?, description=?, priority=?, applicant=?, status=?, sprint_id=?, updated_at=NOW() WHERE id=?`, 
    [name, description, priority, applicant, status, sprint_id, req.params.id]);
    res.json({ message: "Backlog updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteBacklog = async (req, res) => {
  try {
    await db.query(`DELETE FROM tbr_backlogs WHERE id = ?`, [req.params.id]);
    res.json({ message: "Backlog deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

/**
 * ==========================================
 * 5. VISION BOARD MANAGEMENT
 * ==========================================
 */

exports.getProjectVisions = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM tbr_vision_boards WHERE project_id = ? ORDER BY created_at DESC`, [req.params.projectId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createVision = async (req, res) => {
  try {
    const { name, vision, target_group, needs, products, business_goals, competitors } = req.body;
    const sql = `INSERT INTO tbr_vision_boards (name, vision, target_group, needs, products, business_goals, competitors, project_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    await db.query(sql, [name, vision, target_group, needs, products, business_goals, competitors, req.params.projectId]);
    res.status(201).json({ message: "Vision created" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateVision = async (req, res) => {
  try {
    const { name, vision, target_group, needs, products, business_goals, competitors } = req.body;
    const sql = `UPDATE tbr_vision_boards SET name=?, vision=?, target_group=?, needs=?, products=?, business_goals=?, competitors=?, updated_at=NOW() WHERE id=?`;
    await db.query(sql, [name, vision, target_group, needs, products, business_goals, competitors, req.params.id]);
    res.json({ message: "Vision updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteVision = async (req, res) => {
  try {
    await db.query(`DELETE FROM tbr_vision_boards WHERE id = ?`, [req.params.id]);
    res.json({ message: "Vision deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

/**
 * ==========================================
 * 6. ACTIVITY LOGS (Tabel: tbr_activity_logs)
 * ==========================================
 */

exports.getProjectLogs = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Pastikan nama tabel tbr_activity_logs
    const sql = `
      SELECT 
        al.id, 
        al.activity, 
        al.created_at, 
        u.fullname as user_name 
      FROM tbr_activity_logs al
      LEFT JOIN tbr_users u ON al.user_id = u.id
      WHERE al.project_id = ?
      ORDER BY al.created_at DESC
    `;

    const [rows] = await db.query(sql, [projectId]);
    res.json(rows);
  } catch (err) {
    console.error("DATABASE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};