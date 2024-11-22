// controllers/hardwareController.js

const hardwareService = require('../services/hardwareService');
const customerService = require('../services/getOrgIdbyCustomerID'); 
const { Console } = require('winston/lib/winston/transports');

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

module.exports = {
  createHardware,
  getAllHardware,
  getHardwareById,
  updateHardware,
  deleteHardware
};
