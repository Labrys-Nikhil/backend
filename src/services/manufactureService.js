// src/services/manufactureService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

// Add a new manufacture
const addManufacture = async (data) => {
    try {
        return await prisma.manufacture.create({
            data,
        });
    } catch (error) {
        logger.error("Error creating manufacture:", { error });
        throw new Error("Error creating manufacture");
    }
};

// Get all manufactures
const getAllManufactures = async () => {
    try {
        return await prisma.manufacture.findMany();
    } catch (error) {
        logger.error("Error retrieving manufactures:", { error });
        throw new Error("Error retrieving manufactures");
    }
};

// Get manufacture by ID
const getManufactureById = async (id) => {
    try {
        return await prisma.manufacture.findUnique({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error("Error retrieving manufacture:", { error });
        throw new Error("Error retrieving manufacture");
    }
};

// Update manufacture by ID
const updateManufacture = async (id, data) => {
    try {
        return await prisma.manufacture.update({
            where: { id: parseInt(id) },
            data,
        });
    } catch (error) {
        logger.error("Error updating manufacture:", { error });
        throw new Error("Error updating manufacture");
    }
};

// Delete manufacture by ID
const deleteManufacture = async (id) => {
    try {
        return await prisma.manufacture.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error("Error deleting manufacture:", { error });
        throw new Error("Error deleting manufacture");
    }
};

module.exports = {
    addManufacture,
    getAllManufactures,
    getManufactureById,
    updateManufacture,
    deleteManufacture,
};


