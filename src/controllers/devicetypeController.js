const deviceTypeService = require('../services/deviceTypeService');

// Create a new Device Type
exports.createDeviceType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const deviceType = await deviceTypeService.createDeviceType({ name, description });
    return res.status(201).json(deviceType);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create Device Type' });
  }
};

// Get all Device Types
exports.getDeviceTypes = async (req, res) => {
  try {
    const deviceTypes = await deviceTypeService.getDeviceTypes();
    return res.status(200).json(deviceTypes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch Device Types' });
  }
};

// Get a single Device Type by ID
exports.getDeviceType = async (req, res) => {
  const { id } = req.params;
  try {
    const deviceType = await deviceTypeService.getDeviceType(id);
    if (!deviceType) {
      return res.status(404).json({ error: 'Device Type not found' });
    }
    return res.status(200).json(deviceType);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch Device Type' });
  }
};

// Update a Device Type
exports.updateDeviceType = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedDeviceType = await deviceTypeService.updateDeviceType(id, { name, description });
    if (!updatedDeviceType) {
      return res.status(404).json({ error: 'Device Type not found' });
    }
    return res.status(200).json(updatedDeviceType);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update Device Type' });
  }
};

// Delete a Device Type
exports.deleteDeviceType = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDeviceType = await deviceTypeService.deleteDeviceType(id);
    if (!deletedDeviceType) {
      return res.status(404).json({ error: 'Device Type not found' });
    }
    return res.status(200).json({ message: 'Device Type deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete Device Type' });
  }
};
