// src/services/manufactureService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

// Add a new manufacture
const addManufacture = async (data) => {
    try {
        return await prisma.manufacturer.create({
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
        return await prisma.manufacturer.findMany();
    } catch (error) {
	console.log("error in service of getallmaufacture",error);
        logger.error("Error retrieving manufactures:", { error });
        throw new Error("Error retrieving manufactures");
    }
};

// Get manufacture by ID
const getManufactureById = async (id) => {
    try {
        return await prisma.manufacturer.findUnique({
            where: { id: parseInt(id) },
        });
    } catch (error) {
          console.log("error in service of getmaufacturebyid",error);
	    logger.error("Error retrieving manufacture:", { error });
        throw new Error("Error retrieving manufacture");
    }
};

// Update manufacture by ID
const updateManufacture = async (id, data) => {
    try {
        return await prisma.manufacturer.update({
            where: { id: parseInt(id) },
            data,
        });
    } catch (error) {
	  console.log("error in service of updatemaufacture",error);
        logger.error("Error updating manufacture:", { error });
        throw new Error("Error updating manufacture");
    }
};

// Delete manufacture by ID
const deleteManufacture = async (id) => {
    try {
        return await prisma.manufacturer.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
	  console.log("error in service of deletemaufacture",error);
        logger.error("Error deleting manufacture:", { error });
        throw new Error("Error deleting manufacture");
    }
};
const getManufacturerNameById = async (manufacturerId) => {
    try {
      const hardware = await prisma.hardware.findUnique({
        where: { manufacturerId: parseInt(manufacturerId) },
        include: {
          manufacturer: {
            select: { name: true,
                id:true,
             },
          },
        },
      });
  
      if (!hardware || !hardware.manufacturer) {
        return { message: 'Manufacturer not found for the given manufacturerId' };
      }
  
      return { manufacturerName: hardware.manufacturer.name };
    } catch (error) {
      console.error('Error fetching manufacturer name:', error);
      throw new Error('Failed to fetch manufacturer name');
    }
  };
module.exports = {
    addManufacture,
    getAllManufactures,
    getManufactureById,
    updateManufacture,
    deleteManufacture,
    getManufacturerNameById
};
