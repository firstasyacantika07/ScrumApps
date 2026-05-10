const express = require('express');
const router = express.Router();

const { verifyToken, authorize } = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const teamController = require('../controllers/teamController'); // Import baru

router.use(verifyToken);

// Project Routes
router.get('/', projectController.getProjects);
router.get('/stats', projectController.getProjectStats);
router.post('/', authorize(['superadmin']), projectController.createProject); 
router.put('/:id', authorize(['superadmin']), projectController.updateProject);
router.delete('/:id', authorize(['superadmin']), projectController.deleteProject);

// Team Routes
router.get('/:projectId/members', teamController.getTeamByProject);
router.post('/members', authorize(['superadmin']), teamController.addTeamMember);

module.exports = router;