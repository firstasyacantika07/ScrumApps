const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
router.get('/', projectController.getAllProjects);
module.exports = router;

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
        res.status(500).json({ error: err.message });
    }
});