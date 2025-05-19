

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger'); 
const addProject = async (projectData) => {
    try {
        // Check if customer exists
        const customer = await prisma.customer.findUnique({
            where: { id: projectData.customerId },
        });
        const organization = await prisma.organization.findFirst({
            where:{
                customerId:customer.id,
            },
            select:{
                id:true,
            }
        })
        console.log("checking the orgID",organization);

        if (!customer) {
            throw new Error("Customer not found");
        }

        // Use a transaction to ensure both project and default pages are created
        const newProject = await prisma.$transaction(async (prisma) => {
            // Create project
            const project = await prisma.projects.create({
                data: {
                    name: projectData.name,
                    solutions: projectData.solutions,
                    area: projectData.area,
                    estLat: projectData.estLat,
                    estLng: projectData.estLng, 
                    setLimit: projectData.setLimit,
                    customerId: projectData.customerId,
                    enabled: projectData.enabled,
		    organizationId:organization.id
                },
            });

            // Create two default pages for the project
            await prisma.pages.createMany({
                data: [
                    {
                        pageName: "LiveDashboard",
                        projectId: project.id,
                        isDefault: true,
                    },
                    {
                        pageName: "MyDashboard",
                        projectId: project.id,
                        isDefault: true,
                    },
                ],
            });

            return project;
        });

        return newProject;
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error(error.message); 
    }
};
    const getAllProjects = async () => {
        try {
            const projects = await prisma.projects.findMany({
                include: { device: true },
            });
    
            return projects.map((project) => ({
                ...project,
                deviceCount: project.device.length,
            }));
        } catch (error) {
            console.error("Error retrieving all projects:", error); // Log error
            throw new Error("Error retrieving projects");
        }
    };
    
const getProjectsByCustomerId = async (customerId) => {
    try {
        // Check if the customer exists before fetching projects
        const customerExists = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customerExists) {
            throw new Error(`Customer with ID ${customerId} does not exist.`);
        }

        // Fetch projects if the customer exists
        const projects = await prisma.projects.findMany({
            where: { customerId: customerId }, 
            include: { device: true }, 
        });

        return projects.map((project) => ({
            ...project,
            deviceCount: project.device.length,
        }));

    } catch (error) {
        console.error(`Database error while retrieving projects for customer ID ${customerId}:`, error);
        throw new Error("Database query failed. Please check the logs for more details.");
    }
};
// project Service

const getProjectById = async (id) => {
    try {
        return await prisma.projects.findMany({
            where: { customerId: parseInt(id) },
        });
    } catch (error) {
        logger.error(`Error retrieving project with ID ${id}:, { error }`);
        throw new Error("Error retrieving project");
    }
};

const updateProject = async (id, projectData) => {
    try {
        // Check if project exists before updating
        const existingProject = await prisma.projects.findUnique({
            where: { id: parseInt(id) },
            include: { device: true }, // Include devices to check count
        });

        if (!existingProject) {
            throw new Error("Project not found");
        }

        // Get the current device count
        const deviceCount = existingProject.device.length;

        // Validate setLimit: It cannot be lower than the current device count
        if (projectData.setLimit !== undefined && projectData.setLimit < deviceCount) {
            throw new Error(
                `setLimit (${projectData.setLimit}) cannot be less than the current device count (${deviceCount}). Please remove devices first.`
            );
        }

        // Prepare update data
        const updateData = {
            name: projectData.name,
            solutions: projectData.solutions,
            area: projectData.area,
            estLat: projectData.estLat !== null ? projectData.estLat : undefined,
            estLng: projectData.estLng !== null ? projectData.estLng : undefined,
            setLimit: projectData.setLimit,
            enabled: projectData.enabled
        };

        // Update customer relation only if customerId is provided
        if (projectData.customerId) {
            updateData.customer = { connect: { id: projectData.customerId } };
        }

        // Update the project
        const updatedProject = await prisma.projects.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return updatedProject;
    } catch (error) {
        console.error(`Error updating project with ID ${id}:`, error);
        throw new Error(error.message || "Error updating project");
    }
};

const deleteProject = async (id) => {
    try {
        const projectId = parseInt(id);

        // First, delete associated "Live Dashboard" pages
        await prisma.pages.deleteMany({
            where: {
                projectId: projectId,
                pageName: "LiveDashboard",
                isDefault: true,
            },
        });

        // Then, delete the project
        const deletedProject = await prisma.projects.delete({
            where: { id: projectId },
        });

        return deletedProject; // Return only after both operations are successful
    } catch (error) {
        console.error(`Error deleting project with ID ${id}:`, error);
        throw new Error("Error deleting project");
    }
};



const getProjectName = async (id) => {
    try {
        return await prisma.projects.findFirst({
            where: { id: parseInt(id) },
            select:{
                name:true
            }
        });
    } catch (error) {
        logger.error(`Error deleting project with ID ${id}:`, { error });
        throw new Error("Error deleting project");
    }
}

const getProjectInfo = async (id) => {
    try {
        return await prisma.projects.findFirst({
            where: { id: parseInt(id) },
            include:{
                device:{
                    include:{
                        output:true
                    }
                }
            }
        });
    } catch (error) {
        logger.error(`Error deleting project with ID ${id}:, ${ error }`);
        throw new Error("Error deleting project");
    }
}
module.exports = {
    addProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectsByCustomerId,
    getProjectName,
    getProjectInfo
};

