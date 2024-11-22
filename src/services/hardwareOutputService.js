const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger'); // Assuming you have a logger setup

const createHardwareOutputs = async (data) => {
    try {
        const { hardwareId, outputs } = data;
        
        const createdOutputs = await Promise.all(
            outputs.map(async (output) => {
                return await prisma.hardwareOutput.create({
                    data: {
                        hardwareId: hardwareId,
                        outputId: output.outputId,
                        createdAt: new Date(),
                    },
                });
            })
        );

        return createdOutputs;
    } catch (error) {
        logger.error(`Failed to create hardwareOutputs: ${error.message}`, { error });
        throw new Error("Error creating hardwareOutputs");
    }
};

const getAllHardwareOutputs = async () => {
    try {
        const hardwareOutputs = await prisma.hardwareOutput.findMany({
            include: {
                hardware: true,
                output: true,
            },
        });

        // Organize the data by hardware
        const hardwareMap = hardwareOutputs.reduce((acc, hwOutput) => {
            const hardwareId = hwOutput.hardware.id;

            // If hardware entry doesn't exist, create it
            if (!acc[hardwareId]) {
                acc[hardwareId] = {
                    id: hardwareId,
                    name: hwOutput.hardware.name,
                    type: hwOutput.hardware.type,
                    description: hwOutput.hardware.description,
                    modelNo: hwOutput.hardware.modelNo,
                    gpsSupported: hwOutput.hardware.gpsSupported,
                    configured: hwOutput.hardware.configured,
                    createdAt: hwOutput.hardware.createdAt,
                    outputs: [],
                };
            }

            // Add the output to the hardware's output list
            acc[hardwareId].outputs.push({
                id: hwOutput.output.id,
                name: hwOutput.output.name,
                code: hwOutput.output.code,
                createdAt: hwOutput.output.createdAt,
            });

            return acc;
        }, {});

        // Convert the hardwareMap object back to an array
        const structuredResponse = Object.values(hardwareMap);

        return structuredResponse;
    } catch (error) {
        logger.error(`Failed to retrieve hardwareOutputs: ${error.message}`, { error });
        throw new Error("Error retrieving hardwareOutputs");
    }
};

const getHardwareOutputById = async (id) => {
    try {
        const hardwareOutputs = await prisma.hardwareOutput.findMany({
            where: { hardwareId: parseInt(id) },
            include: {
                hardware: true,
                output: true,
            },
        });

        if (!hardwareOutputs || hardwareOutputs.length === 0) {
            return null;
        }

        // Structuring the response
        const structuredResponse = {
            hardwareId: hardwareOutputs[0].hardwareId,
            hardware: {
                name: hardwareOutputs[0].hardware.name,
                type: hardwareOutputs[0].hardware.type,
                description: hardwareOutputs[0].hardware.description,
                modelNo: hardwareOutputs[0].hardware.modelNo,
                gpsSupported: hardwareOutputs[0].hardware.gpsSupported,
                configured: hardwareOutputs[0].hardware.configured,
                createdAt: hardwareOutputs[0].hardware.createdAt,
            },
            outputs: hardwareOutputs.map((hwOutput) => ({
                id: hwOutput.output.id,
                name: hwOutput.output.name,
                code: hwOutput.output.code,
                createdAt: hwOutput.output.createdAt,
            })),
        };

        return structuredResponse;
    } catch (error) {
        logger.error(`Failed to retrieve hardwareOutput by ID: ${error.message}`, { error });
        throw new Error("Error retrieving hardwareOutput");
    }
};


const updateHardwareOutput = async (id, data) => {
    try {
        return await prisma.hardwareOutput.update({
            where: { id: parseInt(id) },
            data,
        });
    } catch (error) {
        logger.error(`Failed to update hardwareOutput: ${error.message}`, { error });
        throw new Error("Error updating hardwareOutput");
    }
};

const deleteHardwareOutput = async (id) => {
    try {
        return await prisma.hardwareOutput.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error(`Failed to delete hardwareOutput: ${error.message}`, { error });
        throw new Error("Error deleting hardwareOutput");
    }
};

module.exports = {
    createHardwareOutputs,
    getAllHardwareOutputs,
    getHardwareOutputById,
    updateHardwareOutput,
    deleteHardwareOutput,
};
