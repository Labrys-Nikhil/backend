const { prisma } = require('../lib/prisma.js');
const logger = require('../utils/logger');

// Create a new hardware controller
const createHardwareController = async (data) => {
    try {
        const newController = await prisma.hardwareController.create({
            data: {
                code: data.code || "function(value){\n    const packet = {};\n    packet[\"Payload\"] =\"\";\n    return packet;\n}",
                hardwareId: data.hardwareId,
            },
        });
        return newController;
    } catch (error) {
        logger.error("Error creating hardware controller:", { error });
        throw new Error("Error creating hardware controller");
    }
};

// Get all hardware controllers
const getAllHardwareControllers = async () => {
    try {
        return await prisma.hardwareController.findMany({
            include: { hardware: true },
        });
    } catch (error) {
        logger.error("Error retrieving hardware controllers:", { error });
        throw new Error("Error retrieving hardware controllers");
    }
};

// Get a hardware controller by ID
const getHardwareControllerById = async (id) => {
    try {
        return await prisma.hardwareController.findUnique({
            where: { id: parseInt(id) },
            include: { hardware: true },
        });
    } catch (error) {
        logger.error("Error retrieving hardware controller by ID:", { error });
        throw new Error("Error retrieving hardware controller");
    }
};

// Update a hardware controller by ID
const updateHardwareController = async (id, data) => {
    try {
        const updatedController = await prisma.hardwareController.update({
            where: { id: parseInt(id) },
            data: {
                code: data.code,
            },
        });
        return updatedController;
    } catch (error) {
        logger.error("Error updating hardware controller:", { error });
        throw new Error("Error updating hardware controller");
    }
};

// Delete a hardware controller by ID
const deleteHardwareController = async (id) => {
    try {
        return await prisma.hardwareController.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error("Error deleting hardware controller:", { error });
        throw new Error("Error deleting hardware controller");
    }
};

module.exports = {
    createHardwareController,
    getAllHardwareControllers,
    getHardwareControllerById,
    updateHardwareController,
    deleteHardwareController
};

