const db = require('../config/db');

exports.addTeamMember = async (req, res) => {
  try {
    const { project_id, user_id, role } = req.body;
    const superadminId = req.user.id;

    // 1. Dapatkan info paket Superadmin (pemilik proyek)
    const [owner] = await db.query(
      `SELECT u.package_type FROM tbr_users u 
       JOIN tbr_projects p ON u.id = p.user_id 
       WHERE p.id = ?`, [project_id]
    );

    // 2. Hitung jumlah member saat ini di proyek tersebut
    const [currentMembers] = await db.query(
      `SELECT COUNT(*) as total FROM tbr_teams WHERE project_id = ?`, [project_id]
    );

    const package = owner[0].package_type || 'FREE';
    const totalMembers = currentMembers[0].total;

    // 3. Validasi Limit Tim
    if (package === 'FREE' && totalMembers >= 5) {
      return res.status(403).json({ message: "Limit member paket FREE maksimal 5 orang." });
    }
    if (package === 'PRO' && totalMembers >= 20) {
      return res.status(403).json({ message: "Limit member paket PRO maksimal 20 orang." });
    }

    // 4. Insert member baru
    await db.query(
      `INSERT INTO tbr_teams (project_id, user_id, role) VALUES (?, ?, ?)`,
      [project_id, user_id, role]
    );

    res.status(201).json({ message: "Member berhasil ditambahkan ke tim." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeamByProject = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, u.name, u.email FROM tbr_teams t 
       JOIN tbr_users u ON t.user_id = u.id 
       WHERE t.project_id = ?`, [req.params.projectId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};