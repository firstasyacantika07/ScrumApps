const express = require('express');
const router = express.Router();

const { verifyToken, authorize } = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const teamController = require('../controllers/teamController');

// Proteksi semua route di bawah ini dengan token
router.use(verifyToken);

/* =====================================================
    TEAM ROUTES
    (Sub-resource: Anggota Tim dalam Proyek)
   ===================================================== */

// Ambil semua anggota tim berdasarkan ID proyek
router.get('/:projectId/members', teamController.getTeamByProject);

// Tambah anggota tim baru
router.post('/:projectId/members', authorize(['superadmin']), teamController.addTeamMember);

// Update role anggota tim (misal: dari viewer ke editor)
router.put('/:projectId/members/:memberId', authorize(['superadmin']), teamController.updateTeamMember);

// Hapus anggota tim dari proyek
router.delete('/:projectId/members/:memberId', authorize(['superadmin']), teamController.deleteTeamMember);


/* =====================================================
    DEVELOPMENT ROUTES
    (Sub-resource: Progress Milestone Proyek)
   ===================================================== */

// Ambil semua data perkembangan/milestone proyek
router.get('/:projectId/developments', projectController.getProjectDevelopments);

// Tambah milestone baru (Create)
router.post('/:projectId/developments', authorize(['superadmin']), projectController.createDevelopment);

// Hapus milestone tertentu (Delete)
router.delete('/:projectId/developments/:devId', authorize(['superadmin']), projectController.deleteDevelopment);


/* =====================================================
    PROJECT ROUTES (Core CRUD)
   ===================================================== */

// 1. Route Stats (Wajib di atas /:id agar 'stats' tidak dianggap sebagai ID)
router.get('/stats', projectController.getProjectStats);

// 2. Detail Proyek (Berdasarkan ID)
router.get('/:id', projectController.getProjectById);

// 3. List Semua Proyek (Milik sendiri + Tim)
router.get('/', projectController.getProjects);

// 4. Create Project Baru
router.post('/', authorize(['superadmin']), projectController.createProject); 

// 5. Update Data Proyek
router.put('/:id', authorize(['superadmin']), projectController.updateProject);

// 6. Hapus Proyek
router.delete('/:id', authorize(['superadmin']), projectController.deleteProject);

module.exports = router;