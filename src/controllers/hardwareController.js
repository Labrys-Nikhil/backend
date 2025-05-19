// controllers/hardwareController.js

const hardwareService = require('../services/hardwareService');
const customerService = require('../services/getOrgIdbyCustomerID'); 
const { Console } = require('winston/lib/winston/transports');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createHardware = async (req, res) => {
  try {
    // const customerId = req.user.id; 
    const customerId = 1;
    console.log(customerId);

    // Fetch organization ID from the customer service
    const organization = await customerService.getOrganizationIdByCustomerId(customerId);
    console.log("---->",organization);

    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found for this customer.' });
    }
    
    // Prepare the hardware data with organizationId
    const hardwareData = {
      ...req.body,
      organizationId: organization, // Use the organization ID obtained
    };
    
    const hardware = await hardwareService.createHardware(hardwareData);
    res.status(201).json(hardware);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllHardware = async (req, res) => {
  try {
    const hardwareList = await hardwareService.getAllHardware();
    res.status(200).json(hardwareList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHardwareById = async (req, res) => {
  try {
    const hardware = await hardwareService.getHardwareById(req.params.id);
    if (!hardware) {
      return res.status(404).json({ message: 'Hardware not found' });
    }
    res.status(200).json(hardware);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHardware = async (req, res) => {
  try {
    const updatedHardware = await hardwareService.updateHardware(req.params.id, req.body);
    if (!updatedHardware) {
      return res.status(404).json({ message: 'Hardware not found' });
    }
    res.status(200).json(updatedHardware);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHardware = async (req, res) => {
  try {
    const deletedHardware = await hardwareService.deleteHardware(req.params.id);
    if (!deletedHardware) {
      return res.status(404).json({ message: 'Hardware not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const hardwareDataToperticular  = async(req,res)=>{
  const customerId  = req.user.id; // Extracted from JWT token
  console.log("req user",customerId);

  try {
    // Step 1: Fetch organizationId for the given customerId
    const organization = await prisma.organization.findFirst({
      where: { customerId : customerId }
    });
    console.log("customer data",organization);
    const organizationId = organization.id;
    const devices = await prisma.device.findMany({
      where: {
        organizationId: organizationId,
      },
      select: {
        hardwareId: true,
      },
    });

    if (!devices.length) {
      return res.status(404).json({ message: 'No devices found for this organization' });
    }

    // Step 3: Extract unique hardwareIds
    const hardwareIds = [...new Set(devices.map((device) => device.hardwareId))];

    // Step 4: Fetch hardware details for the extracted hardwareIds
    const hardwareDetails = await prisma.hardware.findMany({
      where: {
        id: { in: hardwareIds },
      }
    });

    res.json(hardwareDetails);
  } catch (error) {
    console.error('Error fetching hardware data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getHardwareOutputById = async (req, res) => {
    try {
        const { id } = req.params; // Assuming IDs are passed as a query parameter (e.g., ?ids=1,2,3)

        if (!id || typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid request format. IDs should be a comma-separated string.",
            });
        }

        // Convert "1,2,3" -> [1, 2, 3]
        const parsedIds = id.split(",").map(id => parseInt(id)).filter(id => !isNaN(id));

        if (parsedIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid ID values provided",
            });
        }

        const outputs = await hardwareOutputService.getHardwareOutputById(parsedIds);

        if (!outputs || outputs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No output found for the provided IDs",
            });
        }

        return res.status(200).json({
            success: true,
            data: outputs,
            message: "Outputs fetched successfully",
        });
    } catch (error) {
        console.error("Error in getHardwareOutputByIds Controller:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching outputs",
        });
    }
};
module.exports = {
  createHardware,
  getAllHardware,
  getHardwareById,
  updateHardware,
  deleteHardware,
  hardwareDataToperticular,
	getHardwareOutputById
};
