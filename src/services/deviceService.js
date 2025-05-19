const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Initialize PrismaClient
const createDeviceAndAttributes = async (deviceData, selectedAttributes) => {
    try {
        console.log("Creating device with data:", deviceData);

        // Validation
        if (!deviceData.name || deviceData.name.trim() === "") {
            throw new Error("Device name is required.");
        }
        if (!deviceData.deviceId || deviceData.deviceId.length !== 16 || !/^[0-9A-F]*$/.test(deviceData.deviceId)) {
            throw new Error("Device ID must be a 16-digit hexadecimal string.");
        }
        if (!deviceData.mainOutput) {
            throw new Error("Main Output is required.");
        }
        if (!deviceData.hardwareId || isNaN(deviceData.hardwareId)) {
            throw new Error("Valid hardwareId is required.");
        }
        if (!deviceData.networkId || isNaN(deviceData.networkId)) {
            throw new Error("Valid networkId is required.");
        }
        if (!deviceData.deviceLocationName || deviceData.deviceLocationName.trim() === "") {
            throw new Error("Device Location Name is required.");
        }
        if (!deviceData.location || deviceData.location.trim() === "") {
            throw new Error("Location is required.");
        }

        // Check if deviceId already exists
        const existingDevice = await prisma.device.findUnique({
            where: { deviceId: deviceData.deviceId }
        });
        if (existingDevice) {
            throw new Error("Device ID already exists. Please enter a different Device ID.");
        }

        // Check project device limit
        const project = await prisma.projects.findUnique({
            where: { id: deviceData.projectId },
            include: { device: true },
        });

        if (!project) {
            throw new Error("Project not found");
        }

        if (project.device.length >= project.setLimit) {
            throw new Error("Device limit reached for this project");
        }

        // Create the device
	console.log("----> creating device",deviceData);
	
        const device = await prisma.device.create({
		data:deviceData
        });

        console.log("Device created successfully:", device);

        // Fetch hardware outputs based on the hardwareId of the created device
        const hardwareOutputs = await prisma.hardwareoutput.findMany({
            where: { hardwareId: device.hardwareId },
        });

        console.log("Fetched hardware outputs:", hardwareOutputs);

        // Prepare output data
        const outputData = hardwareOutputs.map(output => ({
            deviceId: device.id,  // Link to the created device
            name: output.name,
            unit: output.unit,
            type: output.type,
            description: "",  // If needed, provide a default description
            linkedTo: ""      // Set a default or dynamic linkedTo value
        }));

        // Insert outputs into the output table
        if (outputData.length > 0) {
            await prisma.output.createMany({
                data: outputData,
            });
            console.log("Outputs created successfully.");
        } else {
            console.log("No hardware outputs found for this hardware.");
        }

        return {
            device,
            message: "Device and outputs created successfully",
            success: true,
        };
    } catch (error) {
        console.error("Error creating device and outputs:", error);
        throw new Error(error.message || "Error creating device and outputs");
    }
};
// device service

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
        const devices = await prisma.device.findMany({
            where: {
                projectId: parseInt(id),
            },
            include: {
                deviceattribute: true, 
            },
        });

        if (!devices || devices.length === 0) {
            throw new Error('No devices found for this project');
        }

        console.log("Fetched devices with attributes:", devices);
        return devices;
    } catch (error) {
        console.error("Error fetching devices by project ID:", error);
        throw new Error(error.message);
    }
};
// device service


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


const updateDevice = async (id, deviceData, selectedAttributes) => {
    try {
        // Validate projectId existence
          // Validation
          if (!deviceData.name || deviceData.name.trim() === "") {
            throw new Error("Device name is required.");
        }
        if (!deviceData.deviceId || deviceData.deviceId.length !== 16 || !/^[0-9A-F]*$/.test(deviceData.deviceId)) {
            throw new Error("Device ID must be a 16-digit hexadecimal string.");
        }
        if (!deviceData.mainOutput) {
            throw new Error("Main Output is required.");
        }
        if (!deviceData.hardwareId || isNaN(deviceData.hardwareId)) {
            throw new Error("Valid hardwareId is required.");
        }
        if (!deviceData.networkId || isNaN(deviceData.networkId)) {
            throw new Error("Valid networkId is required.");
        }
        if (!deviceData.deviceLocationName || deviceData.deviceLocationName.trim() === "") {
            throw new Error("Device Location Name is required.");
        }
        if (!deviceData.location || deviceData.location.trim() === "") {
            throw new Error("Location is required.");
        }
       
        if (deviceData.projectId) {
            const projectExists = await prisma.projects.findUnique({
                where: { id: deviceData.projectId },
            });

            if (!projectExists) {
                throw new Error("Invalid projectId: No matching project found");
            }
        }

        // Validate hardwareId existence
        if (deviceData.hardwareId) {
            const hardwareExists = await prisma.hardware.findUnique({
                where: { id: deviceData.hardwareId },
            });

            if (!hardwareExists) {
                throw new Error("Invalid hardwareId: No matching hardware found");
            }
        }

        // Update the device details
        const updatedDevice = await prisma.device.update({
            where: { id: parseInt(id) },
            data: deviceData,
        });

        console.log("Device updated successfully:", updatedDevice); // Debug log

        // If selectedAttributes are provided, update device attributes
        if (selectedAttributes && selectedAttributes.length > 0) {
            // Delete existing attributes for this device
            await prisma.deviceattribute.deleteMany({
                where: { deviceId: updatedDevice.id },
            });

            console.log("Existing device attributes deleted."); // Debug log

            // Prepare new attributes data
            const deviceAttributes = selectedAttributes.map(attr => ({
                deviceId: updatedDevice.id,
                name: attr.key,
                value: attr.value,
            }));

            console.log("Preparing to update device attributes:", deviceAttributes); // Debug log

            // Insert new attributes
            await prisma.deviceattribute.createMany({
                data: deviceAttributes,
            });

            console.log("Device attributes updated successfully."); // Debug log
        }

        return {
            device: updatedDevice,
            message: "Device and attributes updated successfully",
        };
    } catch (error) {
        console.error("Error updating device and attributes:", error.message);
        throw new Error(error.message || "Error updating device and attributes");
    }
};
// device servie

const deleteDevice = async (id) => {
    try {
        const deviceId = parseInt(id);

        // Ensure the device exists before attempting deletion
        const deviceExists = await prisma.device.findUnique({
            where: { id: deviceId },
        });

        if (!deviceExists) {
            throw new Error("Device not found");
        }

        // Delete related outputs first
        await prisma.output.deleteMany({
            where: { deviceId: deviceId },
        });
        console.log("Related outputs deleted.");

        // Delete related device attributes
        await prisma.deviceattribute.deleteMany({
            where: { deviceId: deviceId },
        });
        console.log("Related device attributes deleted.");

        // Now delete the device itself
        await prisma.device.delete({
            where: { id: deviceId },
        });

        console.log("Device deleted successfully.");

        
        return { message: "Device and related data deleted successfully" };
    } catch (error) {
        console.error("Error deleting device and related data:", error.message);
        throw new Error(error.message || "Error deleting device and related data");
    }
};


const createDeviceAttributes = async (deviceId, attributes) => {
    try {
        const createdAttributes = await prisma.deviceattribute.createMany({
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
        const attributes = await prisma.deviceattribute.findMany({
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
        const updatedAttribute = await prisma.deviceattribute.update({
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
        await prisma.deviceattribute.delete({
            where: { id: parseInt(id) }
        });

        return { message: 'Attribute deleted successfully' }; // Return success message without res.status
    } catch (error) {
        console.error("Error deleting device attribute:", error);
        throw new Error(error.message);
    }
};
//const createDeviceService = async (deviceData, selectedAttributes) => {
  //Use a transaction to ensure atomicity
//  return await prisma.$transaction(async (prisma) => {
    // Create the device
//     console.log("Creating device with data:", deviceData);

        // Validation
//        if (!deviceData.name || deviceData.name.trim() === "") {
//            throw new Error("Device name is required.");
//        }
//        if (!deviceData.deviceId || deviceData.deviceId.length !== 16 || !/^[0-9A-F]*$/.test(deviceData.deviceId)) {
//            throw new Error("Device ID must be a 16-digit hexadecimal string.");
//        }
//        if (!deviceData.mainOutput) {
//            throw new Error("Main Output is required.");
//        }
//        if (!deviceData.hardwareId || isNaN(deviceData.hardwareId)) {
//            throw new Error("Valid hardwareId is required.");
//        }
//        if (!deviceData.networkId || isNaN(deviceData.networkId)) {
//            throw new Error("Valid networkId is required.");
//        }
//        if (!deviceData.deviceLocationName || deviceData.deviceLocationName.trim() === "") {
//            throw new Error("Device Location Name is required.");
//        }
//        if (!deviceData.location || deviceData.location.trim() === "") {
//            throw new Error("Location is required.");
//        }
	   // Check if deviceId already exists
//        const existingDevice = await prisma.device.findUnique({
//            where: { deviceId: deviceData.deviceId }
//        });
//        if (existingDevice) {
//            throw new Error("Device ID already exists. Please enter a different Device ID.");
//        }

        // Check project device limit
//        const project = await prisma.projects.findUnique({
//            where: { id: deviceData.projectId },
//            include: { device: true },
//        });

//        if (!project) {
//            throw new Error("Project not found");
//        }

//        if (project.device.length >= project.setLimit) {
//            throw new Error("Device limit reached for this project");
//        }
//    const device = await prisma.device.create({
//      data: deviceData,
 //   });

    // Insert attributes for the device
 // Fetch hardware outputs based on the hardwareId of the created device
//        const hardwareOutputs = await prisma.hardwareoutput.findMany({
//            where: { hardwareId: device.hardwareId },
//        });

//        console.log("Fetched hardware outputs:", hardwareOutputs);

        // Prepare output data
//        const outputData = hardwareOutputs.map(output => ({
//            deviceId: device.id,  // Link to the created device
//            name: output.name,
//            unit: output.unit,
//            type: output.type,
//            description: "",  // If needed, provide a default description
 //           linkedTo: ""      // Set a default or dynamic linkedTo value
//        }));
//
//        // Insert outputs into the output table
//        if (outputData.length > 0) {
//            await prisma.output.createMany({
//                data: outputData,
//            });
//            console.log("Outputs created successfully.");
//    return device;
//  });
//};
const createDeviceService = async (deviceData, selectedAttributes) => {
  // Use a transaction to ensure atomicity
  return await prisma.$transaction(async (prisma) => {
    console.log("Creating device with data:", deviceData);

    // === VALIDATION ===
    if (!deviceData.name?.trim()) {
      throw new Error("Device name is required.");
    }

    if (
      !deviceData.deviceId ||
      deviceData.deviceId.length !== 16 ||
      !/^[0-9A-F]*$/.test(deviceData.deviceId)
    ) {
      throw new Error("Device ID must be a 16-digit hexadecimal string.");
    }

    if (!deviceData.mainOutput) {
      throw new Error("Main Output is required.");
    }

    if (!deviceData.hardwareId || isNaN(deviceData.hardwareId)) {
      throw new Error("Valid hardwareId is required.");
    }

    if (!deviceData.networkId || isNaN(deviceData.networkId)) {
      throw new Error("Valid networkId is required.");
    }

    if (!deviceData.deviceLocationName?.trim()) {
      throw new Error("Device Location Name is required.");
    }

    if (!deviceData.location?.trim()) {
      throw new Error("Location is required.");
    }

    // === CHECK IF DEVICE ID EXISTS ===
    const existingDevice = await prisma.device.findUnique({
      where: { deviceId: deviceData.deviceId },
    });

    if (existingDevice) {
      throw new Error("Device ID already exists. Please enter a different Device ID.");
    }

    // === CHECK PROJECT DEVICE LIMIT ===
    const project = await prisma.projects.findUnique({
      where: { id: deviceData.projectId },
      include: { device: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.device.length >= project.setLimit) {
      throw new Error("Device limit reached for this project");
    }

    // === CREATE DEVICE ===
    const device = await prisma.device.create({
      data: deviceData,
    });

    // === FETCH HARDWARE OUTPUTS ===
    const hardwareOutputs = await prisma.hardwareoutput.findMany({
      where: { hardwareId: device.hardwareId },
    });

    console.log("Fetched hardware outputs:", hardwareOutputs);

    // === MAP OUTPUT DATA ===
    const outputData = hardwareOutputs.map((output) => ({
      deviceId: device.id,
      name: output.name,
      unit: output.unit,
      type: output.type,
      description: "", // Optional: Fill if needed
      linkedTo: "",     // Optional: Fill if needed
    }));

    // === INSERT DEVICE OUTPUTS ===
    if (outputData.length > 0) {
      await prisma.output.createMany({
        data: outputData,
      });
      console.log("Outputs created successfully.");
    }

    return device;
  });
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
    getDeviceByProjectId,
    createDeviceService
};

