// autoDownlinkService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an AutoDownlink record
async function createAutoDownlink(alertId, timeout, schedule, port, downlinkController, classType, devEui, pdu) {
  try {
    const autoDownlink = await prisma.autodownlink.create({
      data: {
        alertId,
        timeout,
        schedule,
        port,
        downlinkController,
        classType,
        devEui,
        pdu
      }
    });

    return autoDownlink;
  } catch (error) {
    console.error("Error creating AutoDownlink:", error);
    throw new Error("Error creating AutoDownlink");
  }
}

// Get AutoDownlink by alertId
async function getAutoDownlinkByAlertId(alertId) {
  try {
    const autoDownlink = await prisma.autodownlink.findUnique({
      where: { alertId },
      include: {
        alerts: true // Optionally, include the related alert data
      }
    });

    if (!autoDownlink) {
      throw new Error("AutoDownlink not found");
    }

    return autoDownlink;
  } catch (error) {
    console.error("Error fetching AutoDownlink by alertId:", error);
    throw new Error("Error fetching AutoDownlink by alertId");
  }
}

// Update AutoDownlink by alertId
async function updateAutoDownlink(alertId, updateData) {
  try {
    const updatedAutoDownlink = await prisma.autodownlink.update({
      where: { alertId },
      data: updateData
    });

    return updatedAutoDownlink;
  } catch (error) {
    console.error("Error updating AutoDownlink:", error);
    throw new Error("Error updating AutoDownlink");
  }
}

// Delete AutoDownlink by alertId
async function deleteAutoDownlink(alertId) {
  try {
    const deletedAutoDownlink = await prisma.autodownlink.delete({
      where: { alertId }
    });

    return deletedAutoDownlink;
  } catch (error) {
    console.error("Error deleting AutoDownlink:", error);
    throw new Error("Error deleting AutoDownlink");
  }
}

module.exports = {
  createAutoDownlink,
  getAutoDownlinkByAlertId,
  updateAutoDownlink,
  deleteAutoDownlink
};
