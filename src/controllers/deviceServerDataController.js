// controllers/deviceController.js
const deviceService = require('../services/deviceServerData');

const getAllDevices = async (req, res) => {
  try {
    console.log('Fetching all devices...'); // Log before fetching
    const devices = await deviceService.getAllDevices();
    console.log('Devices fetched successfully:', devices); // Log successful fetch
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error); // Log error
    res.status(500).json({ message: 'Error fetching devices', error });
  }
};


const getRecentDevices = async (req, res) => {
  try {
    console.log('Fetching all devices...'); // Log before fetching
    const devices = await deviceService.getRecentDevice();
    console.log('Devices fetched successfully:', devices); // Log successful fetch
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error); // Log error
    res.status(500).json({ message: 'Error fetching devices', error });
  }
};

// const getDeviceById = async (req, res) => {
//   try {
//     console.log(`Fetching device with ID: ${req.params.id}`); // Log the ID being fetched
//     const device = await deviceService.getDeviceById(req.params.id);
//     if (device) {
//       console.log('Device fetched successfully:', device); // Log successful fetch
//       res.status(200).json(device);
//     } else {
//       console.warn('Device not found'); // Log if device not found
//       res.status(404).json({ message: 'data not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching device:', error); // Log error
//     res.status(500).json({ message: 'Error fetching device', error });
//   }
// };
const getDeviceById = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10; // Default pageSize to 10 if not provided
    const currentPage = parseInt(req.query.pageNo) || 1; // Default pageNo to 1 if not provided
    const date = req.query.date || "today";
    // Call the service with dynamic pagination values
    const device = await deviceService.getDeviceById(req.params.id, currentPage, pageSize, date);

    if (device) {
      res.status(200).json(device);
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device', error });
  }
};

const createDevice = async (req, res) => {
  try {
    // console.log('Creating a new device with data:', req.body); // Log the data being used to create the device
    
    const newDevice = await deviceService.createDevice(req.body);

    if(newDevice === null) return res.status(500).json({ message : "invalid pdu in decoder"});
    // console.log('Device created successfully:', newDevice); // Log successful creation
    res.status(201).json(newDevice);
  } catch (error) {
    // console.error('Error creating device:', error); // Log error
    res.status(500).json({ message: 'Error creating device', error });
  }
};

const updateDevice = async (req, res) => {
  try {
    console.log(`Updating device with ID: ${req.params.id} with data:`, req.body); // Log the ID and data being updated
    const updatedDevice = await deviceService.updateDevice(req.params.id, req.body);
    console.log('Device updated successfully:', updatedDevice); // Log successful update
    res.status(200).json(updatedDevice);
  } catch (error) {
    console.error('Error updating device:', error); // Log error
    res.status(500).json({ message: 'Error updating device', error });
  }
};

const deleteDevice = async (req, res) => {
  try {
    console.log(`Deleting device with ID: ${req.params.id}`); // Log the ID being deleted
    await deviceService.deleteDevice(req.params.id);
    console.log('Device deleted successfully'); // Log successful deletion
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting device:', error); // Log error
    res.status(500).json({ message: 'Error deleting device', error });
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getRecentDevices
};
