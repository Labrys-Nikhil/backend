const deviceService = require('../services/deviceService');

const createDevice= async(req, res)=> {
  const deviceData = req.body; // Extract device data from the request body

  console.log("Received request to create device with data:", deviceData); // Debug: log incoming device data

  try {
      const result = await deviceService.createDeviceAndAttributes(deviceData);
      console.log("Response from service:", result); // Debug: log service response
      res.status(201).json(result); // Respond with created device and success message
  } catch (error) {
      console.error("Error in createDevice controller:", error); // Debug: log error details
      res.status(500).json({ error: error.message }); // Handle any errors
  }
}


// Get All Devices
const getAllDevices = async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.status(200).json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving Devices', error: error.message });
  }
};

// Get Device by ID
const getDeviceById = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await deviceService.getDeviceById(parseInt(id));
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.status(200).json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving Device', error: error.message });
  }
};

const getDeviceByProjectId = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await deviceService.getDeviceByProjectId(parseInt(id));
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.status(200).json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving Device', error: error.message });
  }
};


const getDeviceByDevEui = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await deviceService.getDeviceByIDevEuiId(id);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.status(200).json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving Device', error: error.message });
  }
};

// Update Device
const updateDevice = async (req, res) => {
  const { id } = req.params;
  const deviceData = req.body;
  try {
    const updatedDevice = await deviceService.updateDevice(parseInt(id), deviceData);
    if (!updatedDevice) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.status(200).json({ success: true, data: updatedDevice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating Device', error: error.message });
  }
};

// Delete Device
const deleteDevice = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDevice = await deviceService.deleteDevice(parseInt(id));
    if (!deletedDevice) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.status(200).json({ success: true, message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting Device', error: error.message });
  }
};

module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDeviceByDevEui,
  getDeviceByProjectId
};
