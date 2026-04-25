const Project = require('../models/projectModel');
exports.getAllProjects = async (req, res) => {
try {
const projects = await Project.getAll();
res.status(200).json(projects);
} catch (error) {
res.status(500).json({ error: error.message });
}
};