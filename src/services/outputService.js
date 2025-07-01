const { prisma } = require('../lib/prisma.js');
const logger = require('../utils/logger'); // Assuming logger is already configured


const createOutput = async (data) =>{
    try {
        return await prisma.output.create({
            data,
          });

    } catch (error) {
        logger.error(`Failed to create output: ${error.message}`);
        console.error(error);
    }
}


// Get all Outputs
const getAllOutputs = async () => {
    return await prisma.output.findMany();
  };
  
  // Get a specific Output by ID
  const getOutputById = async (id) => {
    return await prisma.output.findUnique({
      where: { id },
    });
  };
  
  // Update an Output by ID
  const updateOutput = async (id, data) => {
    const intId = parseInt(id)
    return await prisma.output.update({
      where: { id:intId },
      data,
    });
  };
  
  // Delete an Output by ID
  const deleteOutput = async (id) => {
    const intId = parseInt(id)
    return await prisma.output.delete({
      where: { id:intId },
    });
  };
  
  module.exports = {
    createOutput,
    getAllOutputs,
    getOutputById,
    updateOutput,
    deleteOutput,
  };


  