const { prisma } = require('../lib/prisma.js');
const logger = require('../utils/logger'); 

// Create a new hardware attribute
const createHardwareAttribute = async (data) => {
    try {
        return await prisma.hardwareAttributes.create({
            data,
        });
    } catch (error) {
        logger.error("Error creating hardware attribute:", { error });
        throw new Error("Error creating hardware attribute");
    }
};

// Get all hardware attributes
const getAllHardwareAttributes = async () => {
    try {
        return await prisma.hardwareAttributes.findMany({
            include: {
                hardware: true, // Include related hardware data
            },
        });
    } catch (error) {
        logger.error("Error retrieving hardware attributes:", { error });
        throw new Error("Error retrieving hardware attributes");
    }
};

// Get a hardware attribute by ID
const getHardwareAttributeById = async (id) => {
    try {
        return await prisma.hardwareAttributes.findUnique({
            where: { id: parseInt(id) },
            include: {
                hardware: true, // Include related hardware data
            },
        });
    } catch (error) {
        logger.error(`Error retrieving hardware attribute with ID ${id}:`, { error });
        throw new Error("Error retrieving hardware attribute");
    }
};

// Update a hardware attribute
const updateHardwareAttribute = async (id, data) => {
    try {
        return await prisma.hardwareAttributes.update({
            where: { id: parseInt(id) },
            data,
        });
    } catch (error) {
        logger.error(`Error updating hardware attribute with ID ${id}:`, { error });
        throw new Error("Error updating hardware attribute");
    }
};

// Delete a hardware attribute
const deleteHardwareAttribute = async (id) => {
    try {
        return await prisma.hardwareAttributes.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error(`Error deleting hardware attribute with ID ${id}:`, { error });
        throw new Error("Error deleting hardware attribute");
    }
};

module.exports = {
    createHardwareAttribute,
    getAllHardwareAttributes,
    getHardwareAttributeById,
    updateHardwareAttribute,
    deleteHardwareAttribute,
};
