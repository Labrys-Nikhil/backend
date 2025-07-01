const deviceService = require('../services/deviceService');


//const createDevice = async (req, res) => {
//  const {deviceData} = req.body;

//  try {
//    const customerId = req.user.id;
    // Check if the deviceId already exists
//    console.log("checking the frontend data----->",deviceData);
//    console.log("deviceId",deviceData.deviceId);
//    const existingDevice = await prisma.device.findUnique({
//      where: {
//        deviceId: deviceData.deviceId,
//      },
//    });
//	  const orgId = await prisma.organization.findFirst({
//      where:{
//        customerId:customerId
//      },
//      select:{
//        id:true
//      }
//    })


//    if (existingDevice) {
//      return res.status(400).json({
//        success: false,
//        error: `Device with deviceId '${deviceData.deviceId}' already exists.`,
//      })
//    }

    // Check if hardwareId, networkId, organizationId, and projectId exist using Promise.allSettled
//    const results = await Promise.allSettled([
//      prisma.hardware.findUnique({ where: { id: deviceData.hardwareId } }),
//      prisma.networkmodel.findUnique({ where: { id: deviceData.networkId } }),
//      prisma.organization.findFirst({ where: { customerId:customerId } }),
//      prisma.projects.findUnique({ where: { id: deviceData.projectId } }),
//    ]);
//
//    // Validate the results of the checks
//    const [hardware, network, organization, projects] = results.map((result) =>
//      result.status === "fulfilled" ? result.value : null
//    );
//
//    if (!hardware) {
//      return res.status(404).json({
//        success: false,
//        error: `Hardware with ID '${deviceData.hardwareId}' not found.`,
//      });
//    }
//    if (!network) {
//      return res.status(404).json({
//        success: false,
//        error: `Network with ID '${deviceData.networkId}' not found.`,
//      });
//    }
//    if (!organization) {
//      return res.status(404).json({
//        success: false,
//        error: `Organization with ID '${organization}' not found.`,
////      });
//    }
//    if (!projects) {
//      return res.status(404).json({
//        success: false,
//        error: `Project with ID '${deviceData.projectId}' not found.`,
//      });
//    }
//    // Insert a single device using create
//    const newDevice = await prisma.device.create({
//      data: {
//	      name:deviceData.name,
//        manufacture:deviceData.manufacture,
//        mainOutput: {
//		data:deviceData.mainOutput
//        },
//        hardware: {
//          connect: {
//            id: deviceData.hardwareId
//          }
//        },
//        networkId: deviceData.networkId,
//        projects: {
//          connect: {
//            id: deviceData.projectId
//          }
//        },
//        organization: {
//          connect: {
//            id: orgId.id
//          }
//        },
//	      hardwareOutputId:deviceData.hardwareOutputId,
//              deviceId:deviceData.deviceId,
//        location:deviceData.location,
//        deviceLocationName:deviceData.deviceLocationName,
//        currentLocation:deviceData.currentLocation,
//        network:deviceData.network,
//      }
//    });
//
//    res.status(201).json({ message: 'Device added successfully', newDevice });
//  } catch (error) {
//    console.error('Error adding device:', error);
//    res.status(500).json({ error: 'Failed to add device' });
//  }
//};
const createDevice = async (req, res) => {
  console.log(req.body);
  const  deviceData  = req.body;

  try {
    const customerId = req.user.id;

    console.log("Checking frontend data ----->", deviceData);
//    console.log("Device ID:", deviceData.deviceId);

    const existingDevice = await prisma.device.findUnique({
      where: {
        deviceId: deviceData.deviceId,
      },
    });

    if (existingDevice) {
      return res.status(400).json({
        success: false,
        error: `Device with deviceId '${deviceData.deviceId}' already exists.`,
      });
    }

    const orgId = await prisma.organization.findFirst({
      where: {
        customerId: customerId,
      },
      select: {
        id: true,
      },
    });

    const results = await Promise.allSettled([
      prisma.hardware.findUnique({ where: { id: deviceData.hardwareId } }),
      prisma.networkmodel.findUnique({ where: { id: deviceData.networkId } }),
      prisma.organization.findFirst({ where: { customerId: customerId } }),
      prisma.projects.findUnique({ where: { id: deviceData.projectId } }),
    ]);

    const [hardware, network, organization, projects] = results.map((result) =>
      result.status === "fulfilled" ? result.value : null
    );

    if (!hardware) {
      return res.status(404).json({
        success: false,
        error: `Hardware with ID '${deviceData.hardwareId}' not found.`,
      });
    }
    if (!network) {
      return res.status(404).json({
        success: false,
        error: `Network with ID '${deviceData.networkId}' not found.`,
      });
    }
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: `Organization with ID '${orgId?.id}' not found.`,
      });
    }
    if (!projects) {
      return res.status(404).json({
        success: false,
        error: `Project with ID '${deviceData.projectId}' not found.`,
      });
    }

    const deviceCount = await prisma.device.count({
      where: {
        projectId: deviceData.projectId,
      },
    });

    if (deviceCount >= projects.setLimit) {
      return res.status(500).json({
        success: false,
        error: `Device limit reached for project '${deviceData.projectId}'. Maximum allowed: ${projects.setLimit}`,
      });
    }

    // ✅ Create the device
    const newDevice = await prisma.device.create({
      data: {
        name: deviceData.name,
        manufacture: deviceData.manufacture,
        mainOutput: {
          data: deviceData.mainOutput,
        },
        hardware: {
          connect: {
            id: deviceData.hardwareId,
          },
        },
        networkId: deviceData.networkId,
        projects: {
          connect: {
            id: deviceData.projectId,
          },
        },
        organization: {
          connect: {
            id: orgId.id,
          },
        },
        hardwareOutputId: deviceData.hardwareOutputId,
        deviceId: deviceData.deviceId,
        location: deviceData.location,
        deviceLocationName: deviceData.deviceLocationName,
        currentLocation: deviceData.currentLocation,
        network: deviceData.network,
      },
    });

    // ✅ Fetch and add hardware outputs for the created device
    const hardwareOutputs = await prisma.hardwareoutput.findMany({
      where: { hardwareId: deviceData.hardwareId },
    });

    console.log("Fetched hardware outputs:", hardwareOutputs);

    const outputData = hardwareOutputs.map(output => ({
      deviceId: newDevice.id,
      name: output.name,
      unit: output.unit,
      type: output.type,
      description: "", 
      linkedTo: ""
    }));

    if (outputData.length > 0) {
      await prisma.output.createMany({ data: outputData });
      console.log("Outputs created successfully.");
    } else {
      console.log("No hardware outputs found for this hardware.");
    }

    res.status(201).json({
      message: "Device added successfully",
      newDevice,
    });

  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ error: "Failed to add device" });
  }
};    

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
// Device Controller

const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { selectedAttributes, ...deviceData } = req.body; // Extract selectedAttributes separately

  try {
    const updatedDevice = await deviceService.updateDevice(
      parseInt(id),
      deviceData,
      selectedAttributes
    );

    if (!updatedDevice) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    res.status(200).json({ success: true, data: updatedDevice });
  } catch (error) {
    console.error("Error updating device:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating device",
      error: error.message,
    });
  }
};

// // Delete Device
// const deleteDevice = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deleted = await deviceService.deleteDevice(parseInt(id));

//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "Device not found" });
//     }

//     res.status(200).json({ success: true, message: "Device deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting device:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting device",
//       error: error.message,
//     });
//   }
// };

// Delete Device
const deleteDevice = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deviceService.deleteDevice(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    res.status(200).json({ success: true, message: "Device deleted successfully" });
  } catch (error) {
    console.error("Error deleting device:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting device",
      error: error.message,
    });
  }
};

const devicesByCustomerId = async (req,res) => {

  const customerId = req.user.id; // Extracted from JWT token
  console.log("req user", customerId);
  try {
      const organization = await prisma.organization.findFirst({
          where: { customerId: customerId }
      });
      console.log("customer data", organization);
      const organizationId = organization.id;
      const devices = await prisma.device.findMany({
          where: {
              organizationId: organizationId,
          },
      });
      console.log("location name array",devices);
      res.json(devices);
  } catch (error) {
      console.error('Error fetching hardware data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}
const createDeviceTest = async (req, res) => {
  try {
    const { deviceData, selectedAttributes } = req.body;

    // ✅ Validation for required fields
    if (!deviceData || !deviceData.name || !deviceData.deviceId) {
      return res.status(400).json({
        success: false,
        message: "Missing required device data",
      });
    }

    if (!selectedAttributes || !Array.isArray(selectedAttributes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing selected attributes",
      });
    }

    console.log("Received request to create device with data:", deviceData);
    console.log("Selected attributes:", selectedAttributes);

    // ✅ Call the service to create the device and insert attributes
    const device = await deviceService.createDeviceService(deviceData, selectedAttributes);

    res.status(201).json({
      success: true,
      message: "Device created successfully",
      device,
    });
  } catch (error) {
    console.error("Error in createDevice controller:", error);
    res.status(500).json({
      success: false,
      error: "Error creating device",
      details: error.message,
    });
  }
};

const getAttributesByHardwareId = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await deviceService.getAttributesByHardwareId(parseInt(id));
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.status(200).json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving Device', error: error.message });
  }
};
module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDeviceByDevEui,
  getDeviceByProjectId,
  devicesByCustomerId,
	createDeviceTest,
  getAttributesByHardwareId
  //addDevice
};

