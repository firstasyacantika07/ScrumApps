const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

router.use(verifyToken);

router.get('/', projectController.getProjects);
router.get('/stats', projectController.getProjectStats);

router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;