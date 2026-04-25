const db = require('../config/db');
class ProjectModel {
static async getAll() {
const [rows] = await db.query('SELECT * FROM tbr_projects ORDER BY created_at DESC');
return rows;
}
static async getById(id) {
const [rows] = await db.query('SELECT * FROM tbr_projects WHERE id = ?',
[id]);
return rows[0];
}
}
module.exports = ProjectModel;