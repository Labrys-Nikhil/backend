
const projectService = require('../services/projectService');
const logger = require('../utils/logger')

const addProjects = async (req, res) => {
    const { name, solutions, area, estLng, estLat, setLimit, enabled } = req.body; // Collect necessary fields
    const customerId = req.user?.id; // Assuming customer ID is set in req.user

    console.log(name, solutions, area, setLimit, estLng, estLat, customerId, enabled);

    if (!name || !solutions || !area || setLimit === undefined || !customerId) {
        return res.status(400).json({ message: 'Name, solutions, area, setLimit, and customerId are required.' });
    }

    // Convert setLimit to integer
    const parsedSetLimit = parseInt(setLimit, 10);

    if (isNaN(parsedSetLimit)) {
        return res.status(400).json({ message: 'setLimit must be a valid integer.' });
    }

    try {
        const newProject = await projectService.addProject({
            name,
            solutions,
            area,
            estLng,
            estLat,
            setLimit: parsedSetLimit,
            customerId,
            enabled,
        });

        return res.status(201).json(newProject);
    } catch (error) {
        if (error.message === "Customer not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};


const getAllProjects = async (req, res) => {
    
    try {
        const projects = await projectService.getAllProjects();
        res.json({success:true, data:projects});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
};


const getProjectByCustomerId = async (req, res) => {
    try {
        // Extract customerId from URL params
        const  customerId  = req.user.id; 

        // Validate customerId
        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: "Customer ID is required in the URL.",
            });
        }

        // Convert to integer
        const parsedCustomerId = parseInt(customerId, 10);
        if (isNaN(parsedCustomerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Customer ID format. It must be a number.",
            });
        }

        console.log("Requested Customer ID:", parsedCustomerId);

        // Fetch projects by customerId
        const projects = await projectService.getProjectsByCustomerId(parsedCustomerId);

        // Return successful response
        res.status(200).json({ success: true, data: projects });

    } catch (error) {
        console.error(`Error retrieving projects for customer ID ${req.params.customerId}:`, error);
        
        // Return a 404 error if the customer does not exist
        if (error.message.includes("does not exist")) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving projects.",
            error: error.message,
        });
    }
};
// project controller


const getDeviceLimitById = async (req, res) => {
    try {
        const id = req.params.id; // Get project ID from request params
        const project = await projectService.getProjectById(id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error(`Error retrieving project with ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: "Error retrieving project", error: error.message });
    }
};

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

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: "Invalid project ID." });
        }

        const { name, solutions, area, estLng, estLat, setLimit, customerId, enabled } = req.body;

        const updatedProject = await projectService.updateProject(id, {
            name,
            solutions,
            area,
            estLng,
            estLat,
            setLimit,
            customerId: customerId || req.user?.id, // Get customerId from request body or authenticated user
            enabled,
        });

        return res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(error.message === "Project not found" ? 404 : 500).json({ message: error.message });
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

const getProjectByProjectId = async (req, res) => {
    try{

        const { id } = req.params;
        const data = await projectService.getProjectName(id);
        res.status(200).json({ success: true, name:data?.name });

    } catch(error){
        logger.error(`Error getting project with ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
    }
}
const getProjectInfoByProjectId = async (req, res) => {
    try{

        const { id } = req.params;
        const data = await projectService.getProjectInfo(id);
        res.status(200).json({ success: true, data });

    } catch(error){
        logger.error(`Error getting project with ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
    }
}
module.exports = {
    addProjects,
    getAllProjects,
    getDeviceLimitById,
    updateProject,
    deleteProject,
    getProjectByCustomerId,
    getProjectById,
    getProjectByProjectId,
    getProjectInfoByProjectId
};

