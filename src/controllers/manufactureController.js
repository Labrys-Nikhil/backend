// src/controllers/manufactureController.js

const manufactureService = require('../services/manufactureService');

// Create a new manufacture
const createManufacture = async (req, res) => {
    try {
        const newManufacture = await manufactureService.addManufacture(req.body);
        res.status(201).json({ success: true, data: newManufacture });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating manufacture', error: error.message });
    }
};

// Get all manufactures
const getAllManufactures = async (req, res) => {
    try {
        const manufactures = await manufactureService.getAllManufactures();
        res.status(200).json({ success: true, data: manufactures });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving manufactures', error: error.message });
    }
};

// Get manufacture by ID
const getManufactureById = async (req, res) => {
    try {
        const manufacture = await manufactureService.getManufactureById(req.params.id);
        if (manufacture) {
            res.status(200).json({ success: true, data: manufacture });
        } else {
            res.status(404).json({ success: false, message: 'Manufacture not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving manufacture', error: error.message });
    }
};

// Update manufacture by ID
const updateManufacture = async (req, res) => {
    try {
        const updatedManufacture = await manufactureService.updateManufacture(req.params.id, req.body);
        if (updatedManufacture) {
            res.status(200).json({ success: true, data: updatedManufacture });
        } else {
            res.status(404).json({ success: false, message: 'Manufacture not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating manufacture', error: error.message });
    }
};

// Delete manufacture by ID
const deleteManufacture = async (req, res) => {
    try {
        const deletedManufacture = await manufactureService.deleteManufacture(req.params.id);
        if (deletedManufacture) {
            res.status(204).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Manufacture not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting manufacture', error: error.message });
    }
};
const getManufactureName = async (req, res) => {
    try {
      // Get manufacturerId from URL parameter
      const { manufacturerId } = req.params;
  
      // Ensure manufacturerId is present and is a valid number
      if (!manufacturerId || isNaN(manufacturerId)) {
        return res.status(400).json({ message: 'Valid manufacturerId is required' });
      }
  
      // Call service function to get manufacturer name
      const result = await manufactureService.getManufacturerNameById(manufacturerId);
  
      // Return result from service
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
module.exports = {
    createManufacture,
    getAllManufactures,
    getManufactureById,
    updateManufacture,
    deleteManufacture,
    getManufactureName
};
