const express = require('express');
const router = express.Router();

const { verifyToken, authorize } = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const teamController = require('../controllers/teamController');

// Semua route di bawah ini membutuhkan login
router.use(verifyToken);

/* =====================================================
    PROJECT CORE ROUTES (CRUD & Dashboard Stats)
   ===================================================== */
router.get('/stats', projectController.getProjectStats);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authorize(['superadmin']), projectController.createProject); 
router.put('/:id', authorize(['superadmin']), projectController.updateProject);
router.delete('/:id', authorize(['superadmin']), projectController.deleteProject);

/* =====================================================
    TEAM ROUTES
   ===================================================== */
router.get('/:projectId/members', teamController.getTeamByProject);
router.post('/:projectId/members', authorize(['superadmin']), teamController.addTeamMember);
router.put('/:projectId/members/:memberId', authorize(['superadmin']), teamController.updateTeamMember);
router.delete('/:projectId/members/:memberId', authorize(['superadmin']), teamController.deleteTeamMember);

/* =====================================================
    BACKLOG ROUTES
   ===================================================== */
router.get('/:projectId/backlogs', projectController.getProjectBacklogs);
router.post('/:projectId/backlogs', authorize(['superadmin']), projectController.createBacklog);
router.put('/backlogs/:id', authorize(['superadmin']), projectController.updateBacklog);
router.delete('/backlogs/:id', authorize(['superadmin']), projectController.deleteBacklog);

/* =====================================================
    SPRINT ROUTES
   ===================================================== */
router.get('/:projectId/sprints', projectController.getProjectSprints);
router.post('/:projectId/sprints', authorize(['superadmin']), projectController.createSprint);
router.delete('/:projectId/sprints/:sprintId', authorize(['superadmin']), projectController.deleteSprint);

/* =====================================================
    DEVELOPMENT / TASK ROUTES
   ===================================================== */
router.get('/:projectId/developments', projectController.getProjectDevelopments);
router.post('/:projectId/developments', authorize(['superadmin']), projectController.createDevelopment);
router.patch('/developments/:devId/status', authorize(['superadmin']), projectController.updateDevelopmentStatus);
router.delete('/developments/:devId', authorize(['superadmin']), projectController.deleteDevelopment);

/* =====================================================
    VISION BOARD ROUTES
   ===================================================== */
router.get('/:projectId/vision-boards', projectController.getProjectVisions);
router.post('/:projectId/vision-boards', authorize(['superadmin']), projectController.createVision);
router.put('/vision-boards/:id', authorize(['superadmin']), projectController.updateVision);
router.delete('/vision-boards/:id', authorize(['superadmin']), projectController.deleteVision);

/* =====================================================
    ACTIVITY LOG ROUTES
   ===================================================== */
router.get('/:projectId/logs', projectController.getProjectLogs);

module.exports = router;