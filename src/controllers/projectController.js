const projectService = require('../services/projectService');
const logger = require('../utils/logger')

const addProjects = async (req, res) => {
    const { name, solutions, area, setLimit } = req.body; // Collect necessary fields
    const customerId = req.user?.id; // Assuming customer ID is set in req.user

    console.log(name, solutions, area, setLimit, customerId);

    if (!name || !solutions || !area || setLimit === undefined || !customerId) {
        return res.status(400).json({ message: 'Name, solutions, area, setLimit, and customerId are required.' });
    }

    try {
        const newProject = await projectService.addProject({
            name,
            solutions,
            area,
            setLimit,
            customerId,
        });

        return res.status(201).json(newProject);
    } catch (error) {
        // Check for specific error messages to differentiate between customer not found and other errors
        if (error.message === "Customer not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

// Controller function to get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        logger.error(`Error retrieving all projects: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error retrieving projects', error: error.message });
    }
};

// Controller function to get a project by ID
const getProjectById = async (req, res) => {
    try {
        const id  = req.user.id;
        console.log("id", id)
        const project = await projectService.getProjectById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        logger.error(`Error retrieving project with ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error retrieving project', error: error.message });
    }
};

// Controller function to update a project by ID
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const projectData = req.body;
        const updatedProject = await projectService.updateProject(id, projectData);
        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        logger.error(`Error updating project with ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error updating project', error: error.message });
    }
};

// Controller function to delete a project by ID
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await projectService.deleteProject(id);
        res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting project with ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
    }
};

module.exports = {
    addProjects,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
};
