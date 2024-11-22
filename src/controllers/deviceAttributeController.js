// const deviceAttributeService = require('../services/deviceService');

// // Create Device Attribute
// const createDeviceAttribute = async (req, res) => {
//     const deviceAttributeData = req.body;
//     try {
//         const newDeviceAttribute = await deviceAttributeService.createDeviceAttribute(deviceAttributeData);
//         res.status(201).json({ success: true, data: newDeviceAttribute });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error creating Device Attribute', error: error.message });
//     }
// };

// // Get All Device Attributes
// const getAllDeviceAttributes = async (req, res) => {
//     try {
//         const deviceAttributes = await deviceAttributeService.getAllDeviceAttributes();
//         res.status(200).json({ success: true, data: deviceAttributes });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error retrieving Device Attributes', error: error.message });
//     }
// };

// // Get Device Attribute by ID
// const getDeviceAttributeById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const deviceAttribute = await deviceAttributeService.getDeviceAttributeById(parseInt(id));
//         if (!deviceAttribute) {
//             return res.status(404).json({ success: false, message: 'Device Attribute not found' });
//         }
//         res.status(200).json({ success: true, data: deviceAttribute });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error retrieving Device Attribute', error: error.message });
//     }
// };

// // Update Device Attribute
// const updateDeviceAttribute = async (req, res) => {
//     const { id } = req.params;
//     const deviceAttributeData = req.body;
//     try {
//         const updatedDeviceAttribute = await deviceAttributeService.updateDeviceAttribute(parseInt(id), deviceAttributeData);
//         if (!updatedDeviceAttribute) {
//             return res.status(404).json({ success: false, message: 'Device Attribute not found' });
//         }
//         res.status(200).json({ success: true, data: updatedDeviceAttribute });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error updating Device Attribute', error: error.message });
//     }
// };

// // Delete Device Attribute
// const deleteDeviceAttribute = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const deletedDeviceAttribute = await deviceAttributeService.deleteDeviceAttribute(parseInt(id));
//         if (!deletedDeviceAttribute) {
//             return res.status(404).json({ success: false, message: 'Device Attribute not found' });
//         }
//         res.status(200).json({ success: true, message: 'Device Attribute deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error deleting Device Attribute', error: error.message });
//     }
// };

// module.exports = {
//     createDeviceAttribute,
//     getAllDeviceAttributes,
//     getDeviceAttributeById,
//     updateDeviceAttribute,
//     deleteDeviceAttribute,
// };
