const db = require('../config/db');

class UserModel {
    static async getAll() {
        const [rows] = await db.query('SELECT id, name, email, role, created_at FROM tbr_users');
        return rows;
    }

    static async create(data) {
        const { name, email, password, role } = data;
        const [result] = await db.query(
            'INSERT INTO tbr_users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { name, email, role } = data;
        await db.query(
            'UPDATE tbr_users SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, role, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM tbr_users WHERE id = ?', [id]);
    }
}

module.exports = UserModel;