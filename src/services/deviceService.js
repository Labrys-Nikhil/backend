// const { prisma } = require('../lib/prisma.js'); // Initialize PrismaClient

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


const createDeviceAndAttributes = async (deviceData, selectedAttributes) => {
  try {
    console.log("Creating device with data:", deviceData);

    // Validation
    if (!deviceData.name || deviceData.name.trim() === "") {
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
    if (
      !deviceData.deviceLocationName ||
      deviceData.deviceLocationName.trim() === ""
    ) {
      throw new Error("Device Location Name is required.");
    }
    if (!deviceData.location || deviceData.location.trim() === "") {
      throw new Error("Location is required.");
    }

    // Check if deviceId already exists
    const existingDevice = await prisma.device.findUnique({
      where: { deviceId: deviceData.deviceId },
    });
    if (existingDevice) {
      throw new Error(
        "Device ID already exists. Please enter a different Device ID."
      );
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
    console.log("----> creating device", deviceData);

    const device = await prisma.device.create({
      data: deviceData,
    });

    console.log("Device created successfully:", device);

    // Fetch hardware outputs based on the hardwareId of the created device
    const hardwareOutputs = await prisma.hardwareoutput.findMany({
      where: { hardwareId: device.hardwareId },
    });

    console.log("Fetched hardware outputs:", hardwareOutputs);

    // Prepare output data
    const outputData = hardwareOutputs.map((output) => ({
      deviceId: device.id, // Link to the created device
      name: output.name,
      unit: output.unit,
      type: output.type,
      description: "", // If needed, provide a default description
      linkedTo: "", // Set a default or dynamic linkedTo value
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
        attributes: true, // Include device attributes
      },
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
      throw new Error("Device not found");
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
      throw new Error("No devices found for this project");
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
      include: {
        hardware: true,
        output: true,
      },
    });

    if (!device) {
      throw new Error("Device not found");
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
    if (
      !deviceData.deviceLocationName ||
      deviceData.deviceLocationName.trim() === ""
    ) {
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
      const deviceAttributes = selectedAttributes.map((attr) => ({
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
// // device servie

// const deleteDevice = async (id) => {
//     try {
//         const deviceId = parseInt(id);

//         // Ensure the device exists before attempting deletion
//         const deviceExists = await prisma.device.findUnique({
//             where: { id: deviceId },
//         });

//         if (!deviceExists) {
//             throw new Error("Device not found");
//         }

//         // Delete related outputs first
//         await prisma.output.deleteMany({
//             where: { deviceId: deviceId },
//         });
//         console.log("Related outputs deleted.");

//         // Delete related device attributes
//         await prisma.deviceattribute.deleteMany({
//             where: { deviceId: deviceId },
//         });
//         console.log("Related device attributes deleted.");

//         // Now delete the device itself
//         await prisma.device.delete({
//             where: { id: deviceId },
//         });

//         console.log("Device deleted successfully.");

//         return { message: "Device and related data deleted successfully" };
//     } catch (error) {
//         console.error("Error deleting device and related data:", error.message);
//         throw new Error(error.message || "Error deleting device and related data");
//     }
// };

const deleteDevice = async (id) => {
  try {
    const deviceId = parseInt(id);

    const deviceExists = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!deviceExists) {
      throw new Error("Device not found");
    }

    const devEuiMatch = deviceExists.deviceId;

    console.log("============", devEuiMatch);

    await prisma.$transaction(async (tx) => {
      // // 1. Notifications (including via alerts)

      // Step 1: Fetch the customerId through device → project → customerId
      const device = await tx.device.findUnique({
        where: { id: deviceId },
        select: {
          projects: {
            select: { customerId: true },
          },
        },
      });

      if (!device || !device.projects)
        throw new Error("Device or associated project not found");

      const customerId = device.projects.customerId;

      // Step 2: Find notifications related to this device
      const notifications = await tx.notification.findMany({
        where: {
          OR: [
            { deviceId },
            { alerts: { deviceId } }, // assumes alerts is a relation
          ],
        },
      });

      // Step 3: Backup and delete notifications
      if (notifications.length) {
        await tx.notification_delete_bkp.createMany({
          data: notifications.map((n) => ({
            message: n.message,
            deviceId: n.deviceId,
            alertId: n.alertId,
            createdAt: n.createdAt,
            customerId, // from device.project
          })),
        });

        await tx.notification.deleteMany({
          where: {
            OR: [{ deviceId }, { alerts: { deviceId } }],
          },
        });
      }

      // 2. Alerts
      const alerts = await tx.alerts.findMany({ where: { deviceId } });
      if (alerts.length) {
        await tx.alerts_delete_bkp.createMany({
          data: alerts.map((a) => ({
            name: a.name,
            deviceId: a.deviceId,
            operator: a.operator,
            value: a.value,
            bitwiseOperator: a.bitwiseOperator,
            readingBeforeAlerts: a.readingBeforeAlerts,
            customerId,
          })),
        });
        await tx.alerts.deleteMany({ where: { deviceId } });
      }

      // 3. Outputs
      const outputs = await tx.output.findMany({ where: { deviceId } });
      if (outputs.length) {
        await tx.output_delete_bkp.createMany({
          data: outputs.map((o) => ({
            deviceId: o.deviceId,
            name: o.name,
            unit: o.unit,
            type: o.type,
            description: o.description,
            linkedTo: o.linkedTo,
            customerId,
          })),
        });
        await tx.output.deleteMany({ where: { deviceId } });
      }

      // 4. Device Attributes
      const attributes = await tx.deviceattribute.findMany({
        where: { deviceId },
      });
      if (attributes.length) {
        await tx.deviceattribute_delete_bkp.createMany({
          data: attributes.map((a) => ({
            name: a.name,
            value: a.value,
            deviceId: a.deviceId,
            customerId,
          })),
        });
        await tx.deviceattribute.deleteMany({ where: { deviceId } });
      }

      // 5. Decoded Data
      const decodedData = await tx.devicedecodedata.findMany({
        where: { deviceId },
      });
      if (decodedData.length) {
        await tx.devicedecodedata_delete_bkp.createMany({
          data: decodedData.map((d) => ({
            devEui: d.devEui,
            attributesName: d.attributesName,
            attributesValue: d.attributesValue,
            timestamp: d.timestamp,
            deviceId: d.deviceId,
            attributesUnits: d.attributesUnits,
            customerId,
          })),
        });
        await tx.devicedecodedata.deleteMany({ where: { deviceId } });
      }

      // 6. Server Data
      const serverData = await tx.deviceserverdata.findMany({
        where: { deviceId },
      });
      if (serverData.length) {
        await tx.deviceserverdata_delete_bkp.createMany({
          data: serverData.map((s) => ({
            ...s,
            customerId,
          })),
        });
        await tx.deviceserverdata.deleteMany({ where: { deviceId } });
      }

      // 7. Downlink Devices
      const downlinks = await tx.downlinkdevice.findMany({
        where: { deviceId },
      });
      if (downlinks.length) {
        await tx.downlinkdevice_delete_bkp.createMany({
          data: downlinks.map((d) => ({
            devEui: d.devEui,
            downlinkController: d.downlinkController,
            classType: d.classType,
            pdu: d.pdu,
            confirmed: d.confirmed,
            timeoutMinutes: d.timeoutMinutes,
            port: d.port,
            payload: d.payload,
            deviceId: d.deviceId,
            createdAt: d.createdAt,
            customerId,
          })),
        });
        await tx.downlinkdevice.deleteMany({ where: { deviceId } });
      }

      // 8. Auto Downlink with Delay
      const autoDownlinks = await tx.autodownlinkwithdelay.findMany({
        where: { deviceId },
      });
      if (autoDownlinks.length) {
        await tx.autodownlinkwithdelay_delete_bkp.createMany({
          data: autoDownlinks.map((a) => ({
            downlinkController: a.downlinkController,
            isActive: a.isActive,
            timeoutMinutes: a.timeoutMinutes,
            classType: a.classType,
            port: a.port,
            deviceId: a.deviceId,
            devEui: a.devEui,
            pdu: a.pdu,
            isProcessing: a.isProcessing,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            customerId,
          })),
        });
        await tx.autodownlinkwithdelay.deleteMany({ where: { deviceId } });
      }

      // // 9. Labels
      // const labels = await tx.label.findMany({ where: { deviceId } });
      // if (labels.length) {
      //   await tx.label_delete_bkp.createMany({
      //     data: labels.map((l) => ({
      //       name: l.name,
      //       description: l.description,
      //       color: l.color,
      //       projectId: l.projectId,
      //       deviceId: l.deviceId,
      //       outputId: l.outputId,
      //       outputName: l.outputName,
      //       conditionValue: l.conditionValue,
      //       conditionOperator: l.conditionOperator,
      //       createdAt: l.createdAt,
      //       updatedAt: l.updatedAt,
      //       customerId,
      //     })),
      //   });
      //   await tx.label.deleteMany({ where: { deviceId } });
      // }

      // 9. Labels
      const labels = await tx.label.findMany({
        where: {
          deviceId: {
            array_contains: deviceId, // deviceId is a number like 23
          },
        },
      });

      if (labels.length) {
        await tx.label_delete_bkp.createMany({
          data: labels.map((l) => ({
            name: l.name,
            description: l.description,
            color: l.color,
            projectId: l.projectId,
            deviceId: l.deviceId,
            outputId: l.outputId,
            outputName: l.outputName,
            conditionValue: l.conditionValue,
            conditionOperator: l.conditionOperator,
            createdAt: l.createdAt,
            updatedAt: l.updatedAt,
            customerId,
          })),
        });

        await tx.label.deleteMany({
          where: {
            deviceId: {
              array_contains: deviceId, // same logic for deletion
            },
          },
        });
      }

      // 10. Cards
      const cards = await tx.card.findMany({ where: { deviceId } });
      if (cards.length) {
        await tx.card_delete_bkp.createMany({
          data: cards.map((c) => ({
            title: c.title,
            deviceId: c.deviceId,
            projectId: c.projectId,
            devEUI: c.devEUI,
            pageName: c.pageName,
            output: c.output,
            displayFormula: c.displayFormula,
            displayUnit: c.displayUnit,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            displayFormulaSecondary: c.displayFormulaSecondary,
            displayUnitSecondary: c.displayUnitSecondary,
            customerId,
          })),
        });
        await tx.card.deleteMany({ where: { deviceId } });
      }

      // 11. Widgets
      const widgets = await tx.addwidget.findMany();

      for (const widget of widgets) {
        const devices = widget.stepTwoData?.devices;

        if (Array.isArray(devices) && devices.includes(deviceId)) {
          // Backup widget data before deleting
          await tx.addwidget_delete_bkp.create({
            data: {
              pageName: widget.pageName,
              stepOneData: widget.stepOneData,
              stepTwoData: widget.stepTwoData,
              stepThreeData: widget.stepThreeData,
              createdAt: widget.createdAt,
              updatedAt: widget.updatedAt,
              projectId: widget.projectId,
              customerId, // fetched earlier from project
              // deletedAt is auto-defaulted
            },
          });

          await tx.addwidget.delete({
            where: { id: widget.id },
          });
        }
      }

      // 14. Delete the device and store the deleted data

      if (devEuiMatch) {
        const reports = await tx.addreport.findMany();

        for (const report of reports) {
          // Ensure deviceId is an array and check if devEuiMatch exists
          if (
            Array.isArray(report.deviceId) &&
            report.deviceId.includes(devEuiMatch) // check if devEuiMatch is in the array
          ) {
            // Assuming projectId is an array, handle it properly
            const projectIds = report.projectId; // This will be an array of projectIds

            if (!Array.isArray(projectIds) || projectIds.length === 0) {
              throw new Error("Invalid or missing projectId in report");
            }

            // Fetch customerId from the first related project
            const project = await tx.projects.findMany({
              where: {
                id: {
                  in: projectIds, // Handle multiple project IDs if necessary
                },
              },
              select: { customerId: true },
            });

            // Handle case where project might not be found
            if (!project || project.length === 0) {
              throw new Error("Project not found");
            }

            const customerId = project[0].customerId; // Fallback to the first project if multiple exist

            // Backup the report before deletion
            await tx.addreport_delete_bkp.create({
              data: {
                reportName: report.reportName,
                description: report.description,
                duration: report.duration,
                hardwareId: report.hardwareId,
                deviceId: report.deviceId,
                createdAt: report.createdAt,
                updatedAt: report.updatedAt,
                projectId: report.projectId, // Assuming projectId is an array, keeping it as is
                customerId: customerId, // Using the customerId from the first project
              },
            });

            // Delete the report after backup, matching the deviceId in the JSON array format
            await tx.addreport.deleteMany({
              where: {
                deviceId: {
                  array_contains: devEuiMatch, // This checks if the deviceId JSON array contains the value
                },
              },
            });
          }
        }
      }

      const deletedDevice = await tx.device.delete({
        where: { id: deviceId },
        select: {
          name: true,
          manufacture: true,
          mainOutput: true,
          currentLocation: true,
          hardwareId: true,
          networkId: true,
          organizationId: true,
          projectId: true,
          hardwareOutputId: true,
          deviceId: true,
          location: true,
          hardwareType: true,
          network: true,
          deviceLocationName: true,
        },
      });

      // 15. Insert deleted device data into backup table
      await tx.device_delete_bkp.create({
        data: {
          ...deletedDevice,
          customerId,
        },
      });
    });

    return {
      message:
        "Device and all related data backed up and deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting device with backup:", error.message);
    throw new Error(error.message || "Transaction failed");
  }
};

const createDeviceAttributes = async (deviceId, attributes) => {
  try {
    const createdAttributes = await prisma.deviceattribute.createMany({
      data: attributes.map((attr) => ({
        name: attr.name,
        value: attr.value,
        deviceId: parseInt(deviceId),
      })),
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
      where: { deviceId: parseInt(deviceId) },
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
      data: attributeData,
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
      where: { id: parseInt(id) },
    });

    return { message: "Attribute deleted successfully" }; // Return success message without res.status
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
      throw new Error(
        "Device ID already exists. Please enter a different Device ID."
      );
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
      linkedTo: "", // Optional: Fill if needed
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

const getAttributesByHardwareId = async () => {
  try {
    const device = await deviceService.getAttributesByHardwareId(parseInt(id));
    if (!device) {
      return res
        .status(404)
        .json({ success: false, message: "Device not found" });
    }
    res.status(200).json({ success: true, data: device });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving Device",
        error: error.message,
      });
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
  getDeviceByProjectId,
  createDeviceService,
  getAttributesByHardwareId,
};
