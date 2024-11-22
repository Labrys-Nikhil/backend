// src/services/hardwareService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createHardware = async (data) => {
  // Include the organizationId in the data being passed to Prisma
  console.log({data});
  return await prisma.hardware.create({
    data: {
      ...data, // Spread the existing hardware data
    },
  });
};  

const getAllHardware = async () => {
  return await prisma.hardware.findMany();
};

const getHardwareById = async (id) => {
  return await prisma.hardware.findUnique({
    where: { id },
  });
};

const updateHardware = async (id, data) => {
  return await prisma.hardware.update({
    where: { id },
    data,
  });
};

const deleteHardware = async (id) => {
  return await prisma.hardware.delete({
    where: { id },
  });
};

module.exports = {
    createHardware,
    getAllHardware,
    getHardwareById,
    updateHardware,
    deleteHardware,
};
