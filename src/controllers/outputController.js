const outputService = require('../services/outputService')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOutput = async (req, res) => {
    try {
        const outputData = req.body;
        const newOutput = await outputService.createOutput(outputData)

        res.status(201).json({ success: true, data: newOutput })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get all Outputs
const getAllOutputs = async (req, res) => {
    try {
        const outputs = await outputService.getAllOutputs();
        res.status(200).json({ success: true, data: outputs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving outputs', error });
    }
};

// Get an Output by ID
const getOutputById = async (req, res) => {
    try {
        const { id } = req.params;
        const output = await outputService.getOutputById(id);
        if (output) {
            res.status(200).json({ success: true, data: output });
        } else {
            res.status(404).json({ success: false, message: 'Output not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving output', error });
    }
};

// Update an Output by ID
const updateOutput = async (req, res) => {
    try {
        const { id } = req.params;
        const outputData = req.body;

        const updatedOutput = await outputService.updateOutput(id, outputData);
        res.status(200).json({ success: true, data: updatedOutput });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating output', error });
    }
};

// Delete an Output by ID
const deleteOutput = async (req, res) => {
    try {
        const { id } = req.params;
        await outputService.deleteOutput(id);
        res.status(200).json({ success: true, message: 'Output deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting output', error });
    }
};

const getOutputsByDeviceId = async (req, res) => {
    try {
        const { id } = req.params; // Get deviceId from request params

        if (!id) {
            return res.status(400).json({ error: 'Device ID is required' });
        }

        // Fetch outputs associated with the given device ID
        const outputs = await prisma.output.findMany({
            where: {
                deviceId: parseInt(id), // Ensure deviceId is passed as a number
            },
        });

        return res.status(200).json(outputs);
    } catch (error) {
        console.error('Error fetching outputs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const LocationBasesOnCustomerId = async (req,res) => {

    const {projectId} = req.params;
    const customerId = req.user.id; // Extracted from JWT token
    console.log("req user", customerId);
    try {
        const organization = await prisma.organization.findFirst({
            where: { customerId: customerId }
        });
        console.log("customer data", organization);
        const organizationId = organization.id;
        const LocationName = await prisma.device.findMany({
            where: {
                organizationId: organizationId,
                projectId:parseInt(projectId)
            },
        });
        console.log("location name array",LocationName);
        res.json(LocationName);
    } catch (error) {
        console.error('Error fetching hardware data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// const outputBasesOnCustomerId = async (req,res) => {

//     const customerId = req.user.id; // Extracted from JWT token
//     console.log("req user", customerId);
//     try {
//         const organization = await prisma.organization.findFirst({
//             where: { customerId: customerId }
//         });
//         console.log("customer data", organization);
//         const organizationId = organization.id;
//         const devices = await prisma.device.findMany({
//             where: {
//                 organizationId: organizationId,
//             },
//             select:{
//                 id : true,
//             }
//         });
//         console.log("deviceId name array",devices);
//         const output = await prisma.output.findMany({
//             where:{
//                 deviceId
//             }
//         })
//         res.json(devices);
//     } catch (error) {
//         console.error('Error fetching hardware data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

const outputBasesOnCustomerId = async (req, res) => {
    const customerId = req.user.id; // Extracted from JWT token
    console.log("req user", customerId);
  
    try {
      // Fetch the organization associated with the customer ID
      const organization = await prisma.organization.findFirst({
        where: { customerId: customerId },
      });
  
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
  
      console.log("customer data", organization);
      const organizationId = organization.id;
  
      // Fetch all device IDs for the organization
      const devices = await prisma.device.findMany({
        where: {
          organizationId: organizationId,
        },
        select: {
          id: true,
        },
      });
  
      console.log("deviceId name array", devices);
  
      if (devices.length === 0) {
        return res.status(404).json({ message: "No devices found" });
      }
  
      // Extract device IDs into an array
      const deviceIds = devices.map((device) => device.id);
  
      // Fetch all outputs corresponding to the device IDs
      const outputs = await prisma.output.findMany({
        where: {
          deviceId: {
            in: deviceIds, // Match any of the device IDs
          },
        },
      });
  
      console.log("outputs based on device IDs", outputs);
  
      res.json(outputs);
    } catch (error) {
      console.error("Error fetching output data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
module.exports = {
    createOutput,
    getAllOutputs,
    getOutputById,
    updateOutput,
    deleteOutput,
    getOutputsByDeviceId,
    LocationBasesOnCustomerId,
    outputBasesOnCustomerId
};
