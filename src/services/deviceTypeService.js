const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();// Assuming Prisma is configured and exported from this file

// Create a new Device Type
exports.createDeviceType = async ({ name, description }) => {
  try {
    return await prisma.deviceType.create({
      data: {
        name,
        description
      }
    });
  } catch (error) {
    console.error('Error creating Device Type:', error);
    throw new Error('Error creating Device Type');
  }
};


// Get all Device Types
exports.getDeviceTypes = async () => {
  try {
    return await prisma.deviceType.findMany();
  } catch (error) {
    console.error('Error fetching Device Types:', error);
    throw new Error('Error fetching Device Types');
  }
};

// Get a single Device Type by ID
exports.getDeviceType = async (id) => {
  try {
    return await prisma.deviceType.findUnique({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    console.error('Error fetching Device Type:', error);
    throw new Error('Error fetching Device Type');
  }
};

// Update a Device Type
exports.updateDeviceType = async (id, { name, description }) => {
  try {
    return await prisma.deviceType.update({
      where: { id: parseInt(id) },
      data: { name, description }
    });
  } catch (error) {
    console.error('Error updating Device Type:', error);
    throw new Error('Error updating Device Type');
  }
};

// Delete a Device Type
exports.deleteDeviceType = async (id) => {
  try {
    return await prisma.deviceType.delete({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    console.error('Error deleting Device Type:', error);
    throw new Error('Error deleting Device Type');
  }
};
