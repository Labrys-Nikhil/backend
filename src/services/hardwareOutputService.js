const { prisma } = require('../lib/prisma.js');
const logger = require('../utils/logger');

const createHardwareOutputs = async (data) => {
    try {
        const { hardwareId, outputs } = data;
        
        const createdOutputs = await Promise.all(
            outputs.map(async (output) => {
                return await prisma.hardwareoutput.create({
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
        const hardwareOutputs = await prisma.hardwareoutput.findMany({
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
            const output = await prisma.hardwareoutput.findMany({
                where: { id: {in:id} },
            });

            return output;
        } catch (error) {
            console.error("Error fetching hardwareOutput by ID:", error);
            throw new Error("Database query failed");
        }
};

const updateHardwareOutput = async (id, data) => {
    try {
        return await prisma.hardwareoutput.update({
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
        return await prisma.hardwareoutput.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error(`Failed to delete hardwareOutput: ${error.message}`, { error });
        throw new Error("Error deleting hardwareOutput");
    }
};

const getHardwareOutputByhardwareId =  async (hardwareId) =>{
    try {
        return await prisma.hardwareoutput.findMany({
            where: { hardwareId }
        });
    } catch (error) {
        console.error("Error fetching hardware output:", error);
        throw new Error("Failed to fetch hardware outputs.");
    }
}

const getAllHardwareOutputsByCustomerId = async (customerId) => {
    try {
        const hardwareOutputs = await prisma.hardwareoutput.findMany();
        return hardwareOutputs;
    } catch (error) {
        logger.error(`Failed to retrieve hardwareOutputs by customer ID: ${error.message}`, { error });
        throw new Error("Error retrieving hardwareOutputs by customer ID");
    }
};

module.exports = {
    createHardwareOutputs,
    getAllHardwareOutputs,
    getHardwareOutputById,
    updateHardwareOutput,
    deleteHardwareOutput,
    getHardwareOutputByhardwareId,
    getAllHardwareOutputsByCustomerId
};

