// src/services/deviceService.js

const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Initialize PrismaClient

// 1. **Add Device**
// const createDeviceAndAttributes = async (deviceData) => {
//     try {
//         console.log("Creating device with data:", deviceData); // Debug: log device data

//         // Create the device
//         const device = await prisma.device.create({
//             data: deviceData,
//         });

//         console.log("Device created successfully:", device); // Debug: log created device

//         // Fetch hardware attributes based on the hardwareId of the created device
//         const hardwareAttributes = await prisma.hardwareAttributes.findMany({
//             where: {
//                 hardwareId: device.hardwareId, // Use the hardwareId from the device
//             },
//         });

//         console.log("Fetched hardware attributes:", hardwareAttributes); // Debug: log fetched attributes

//         // Prepare device attributes data
//         const deviceAttributes = hardwareAttributes.map(attr => ({
//             deviceId: device.id, // Use the newly created device ID
//             name: attr.key,      // Use key as name
//             value: attr.value,   // Use value from the fetched attributes
//         }));

//         console.log("Preparing to create device attributes:", deviceAttributes); // Debug: log attributes data

//         // Create device attributes associated with the newly created device
//         await prisma.deviceAttribute.createMany({
//             data: deviceAttributes,
//         });

//         console.log("Device attributes created successfully."); // Debug: confirm attributes creation

//         return {
//             device,
//             message: 'Device and attributes created successfully',
//         };
//     } catch (error) {
//         console.error("Error creating device and attributes:", error); // Debug: log error details
//         throw new Error("Error creating device and attributes");
//     }
// };

const createDeviceAndAttributes = async (deviceData) => {
    try {
        console.log("Creating device with data:", deviceData); // Debug: log device data

        // Start a transaction to create the device and its attributes
        const result = await prisma.$transaction(async (prisma) => {
            // Create the device
            const device = await prisma.device.create({
                data: deviceData,
            });

            console.log("Device created successfully:", device); // Debug: log created device

            // Fetch hardware attributes based on the hardwareId of the created device
            const hardwareAttributes = await prisma.hardwareAttributes.findMany({
                where: {
                    hardwareId: device.hardwareId, // Use the hardwareId from the device
                },
            });

            console.log("Fetched hardware attributes:", hardwareAttributes); // Debug: log fetched attributes

            // Prepare device attributes data
            const deviceAttributes = hardwareAttributes.map(attr => ({
                deviceId: device.id, // Use the newly created device ID
                name: attr.key,      // Use key as name
                value: attr.value,   // Use value from the fetched attributes
            }));

            console.log("Preparing to create device attributes:", deviceAttributes); // Debug: log attributes data

            // Create device attributes associated with the newly created device
            await prisma.deviceAttribute.createMany({
                data: deviceAttributes,
            });

            console.log("Device attributes created successfully."); // Debug: confirm attributes creation

            return device; // Return the created device from the transaction
        });

        return {
            device: result,
            message: 'Device and attributes created successfully',
        };
    } catch (error) {
        console.error("Error creating device and attributes:", error); // Debug: log error details
        throw new Error("Error creating device and attributes");
    }
};

// 2. **Get All Devices**
const getAllDevices = async () => {
    try {
        const devices = await prisma.device.findMany({
            include: {
                attributes: true // Include device attributes
            }
        });
        console.log("Devices found:", devices);
        return devices; // Return devices without res.status
    } catch (error) {
        console.error("Error fetching devices:", error);
        throw new Error(error.message); // Throw error for handling elsewhere
    }
};

// 3. **Get Device by ID**
const getDeviceById = async (id) => {
    try {
        const device = await prisma.device.findUnique({
            where: { id: parseInt(id) },
        });

        if (!device) {
            throw new Error('Device not found');
        }

        return device; // Return device without res.status
    } catch (error) {
        console.error("Error fetching device by ID:", error);
        throw new Error(error.message);
    }
};

const getDeviceByProjectId = async (id) => {
    try {
        const device = await prisma.device.findMany({
            where: {
                projectId: parseInt(id)
            },
          
        });

        if (!device) {
            throw new Error('Device not found');
        }
        console.log("data chal raha hai getbyproid",device);
        return device; // Return device without res.status
    } catch (error) {
        console.error("Error fetching device by ID:", error);
        throw new Error(error.message);
    }
};

// 4. **Get Device by Device EUI ID**
const getDeviceByIDevEuiId = async (data) => {
    try {
        const device = await prisma.device.findMany({
            where: { deviceId: data },
        });

        if (!device) {
            throw new Error('Device not found');
        }
        return device;
    } catch (error) {
        throw error; // Rethrow the error for higher-level handling
    }
};

// 5. **Update Device**
const updateDevice = async (id, deviceData) => {
    try {
        const updatedDevice = await prisma.device.update({
            where: { id: parseInt(id) },
            data: deviceData,
        });

        return updatedDevice; // Return updated device without res.status
    } catch (error) {
        console.error("Error updating device:", error);
        throw new Error(error.message);
    }
};

// 6. **Delete Device**
const deleteDevice = async (id) => {
    try {
        await prisma.device.delete({
            where: { id: parseInt(id) }
        });
        return { message: 'Device deleted successfully' }; // Return success message without res.status
    } catch (error) {
        console.error("Error deleting device:", error);
        throw new Error(error.message);
    }
};

// 7. **Add Device Attributes**
const createDeviceAttributes = async (deviceId, attributes) => {
    try {
        const createdAttributes = await prisma.deviceAttribute.createMany({
            data: attributes.map(attr => ({
                name: attr.name,
                value: attr.value,
                deviceId: parseInt(deviceId)
            }))
        });

        return createdAttributes; // Return created attributes without res.status
    } catch (error) {
        console.error("Error creating device attributes:", error);
        throw new Error(error.message);
    }
};

// 8. **Get Device Attributes by Device ID**
const getAttributesByDeviceId = async (deviceId) => {
    try {
        const attributes = await prisma.deviceAttribute.findMany({
            where: { deviceId: parseInt(deviceId) }
        });

        return attributes; // Return attributes without res.status
    } catch (error) {
        console.error("Error fetching attributes by device ID:", error);
        throw new Error(error.message);
    }
};

// 9. **Update Device Attribute**
const updateDeviceAttribute = async (id, attributeData) => {
    try {
        const updatedAttribute = await prisma.deviceAttribute.update({
            where: { id: parseInt(id) },
            data: attributeData
        });

        return updatedAttribute; // Return updated attribute without res.status
    } catch (error) {
        console.error("Error updating device attribute:", error);
        throw new Error(error.message);
    }
};

// 10. **Delete Device Attribute**
const deleteDeviceAttribute = async (id) => {
    try {
        await prisma.deviceAttribute.delete({
            where: { id: parseInt(id) }
        });

        return { message: 'Attribute deleted successfully' }; // Return success message without res.status
    } catch (error) {
        console.error("Error deleting device attribute:", error);
        throw new Error(error.message);
    }
};

module.exports = {
    createDeviceAndAttributes,
    updateDevice,
    getAllDevices,
    getDeviceById,
    deleteDevice,
    deleteDeviceAttribute,
    updateDeviceAttribute,
    getAttributesByDeviceId,
    createDeviceAttributes,
    getDeviceByIDevEuiId,
    getDeviceByProjectId
};
