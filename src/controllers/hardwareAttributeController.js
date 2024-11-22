const hardwareAttributeService = require('../services/hardwareAttributeService');

// Create a hardware attribute
const createHardwareAttribute = async (req, res) => {
    const attributeData = req.body;
    try {
        const newAttribute = await hardwareAttributeService.createHardwareAttribute(attributeData);
        res.status(201).json({ success: true, data: newAttribute });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating hardware attribute', error: error.message });
    }
};

// Get all hardware attributes
const getAllHardwareAttributes = async (req, res) => {
    try {
        const attributes = await hardwareAttributeService.getAllHardwareAttributes();
        res.status(200).json({ success: true, data: attributes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving hardware attributes', error: error.message });
    }
};

// Get a hardware attribute by ID
const getHardwareAttributeById = async (req, res) => {
    const { id } = req.params;
    try {
        const attribute = await hardwareAttributeService.getHardwareAttributeById(id);
        if (!attribute) {
            return res.status(404).json({ success: false, message: 'Hardware attribute not found' });
        }
        res.status(200).json({ success: true, data: attribute });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving hardware attribute', error: error.message });
    }
};

// Update a hardware attribute
const updateHardwareAttribute = async (req, res) => {
    const { id } = req.params;
    const attributeData = req.body;
    try {
        const updatedAttribute = await hardwareAttributeService.updateHardwareAttribute(id, attributeData);
        res.status(200).json({ success: true, data: updatedAttribute });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating hardware attribute', error: error.message });
    }
};

// Delete a hardware attribute
const deleteHardwareAttribute = async (req, res) => {
    const { id } = req.params;
    try {
        await hardwareAttributeService.deleteHardwareAttribute(id);
        res.status(204).json({ success: true, message: 'Hardware attribute deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting hardware attribute', error: error.message });
    }
};

module.exports = {
    createHardwareAttribute,
    getAllHardwareAttributes,
    getHardwareAttributeById,
    updateHardwareAttribute,
    deleteHardwareAttribute,
};
