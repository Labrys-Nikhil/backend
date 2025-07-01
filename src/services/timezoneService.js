// services/timezoneService.js

const { prisma } = require('../lib/prisma.js');

// Create a new timezone
const createTimezone = async (name, offset) => {
    return await prisma.timezone.create({
        data: { name, offset }
    });
};

// Get all timezones
const getAllTimezones = async () => {
    return await prisma.timezone.findMany();
};

// Get a timezone by ID
const getTimezoneById = async (id) => {
    return await prisma.timezone.findUnique({
        where: { id }
    });
};

// Update a timezone
const updateTimezone = async (id, name, offset) => {
    return await prisma.timezone.update({
        where: { id },
        data: { name, offset }
    });
};

// Delete a timezone
const deleteTimezone = async (id) => {
    return await prisma.timezone.delete({
        where: { id }
    });
};


module.exports = {
    createTimezone,
    getAllTimezones,
    getTimezoneById,
    updateTimezone,
    deleteTimezone,
}