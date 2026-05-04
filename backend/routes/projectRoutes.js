const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');

router.use(verifyToken);

// GET
router.get('/', projectController.getProjects);

// STATS
router.get('/stats', projectController.getProjectStats);

// CREATE
router.post('/', projectController.createProject);

// UPDATE
router.put('/:id', projectController.updateProject);

// DELETE
router.delete('/:id', projectController.deleteProject);

module.exports = router;