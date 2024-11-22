const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger'); 

// Function to add a new project
const addProject = async (projectData) => {
    try {
        // Check if customer exists
        const customer = await prisma.customer.findUnique({
            where: { id: projectData.customerId },
        });

        if (!customer) {
            throw new Error("Customer not found");
        }

        // Proceed with creating the project if customer exists
        const newProject = await prisma.projects.create({
            data: {
                name: projectData.name,
                solutions: projectData.solutions,
                area: projectData.area,
                setLimit: projectData.setLimit,
                customerId: projectData.customerId, 
                createdAt: new Date(),
            },
        });
        return newProject;
    } catch (error) {
        logger.error("Error creating project:", { error: error.message, stack: error.stack }); // Log the actual error
        throw new Error(error.message); // Throwing the actual error message
    }
};
// Function to get all projects (Read)
const getAllProjects = async () => {
    try {
        return await prisma.projects.findMany();
    } catch (error) {
        logger.error("Error retrieving all projects:", { error });
        throw new Error("Error retrieving projects");
    }
};

// Function to get a single project by ID (Read)
const getProjectById = async (id) => {
    try {
        return await prisma.projects.findMany({
            where: { customerId: parseInt(id) },
        });
    } catch (error) {
        logger.error(`Error retrieving project with ID ${id}:`, { error });
        throw new Error("Error retrieving project");
    }
};

// Function to update a project by ID (Update)
const updateProject = async (id, projectData) => {
    try {
        const updatedProject = await prisma.projects.update({
            where: { id: parseInt(id) },
            data: {
                name: projectData.name,
                solutions: projectData.solutions,
                area: projectData.area,
                setLimit: projectData.setLimit,
                customerId: projectData.customerId,
                updatedAt: new Date(), // Assuming you want to track the update time
            },
        });
        return updatedProject;
    } catch (error) {
        logger.error(`Error updating project with ID ${id}:`, { error });
        throw new Error("Error updating project");
    }
};

// Function to delete a project by ID (Delete)
const deleteProject = async (id) => {
    try {
        return await prisma.projects.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error(`Error deleting project with ID ${id}:`, { error });
        throw new Error("Error deleting project");
    }
};

module.exports = {
    addProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
};
