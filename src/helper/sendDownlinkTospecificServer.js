
const { postDownlinkDevice } = require('../controllers/downlinkController');
const { downlinkLoriotForAuto } = require('../controllers/loriotAutoDownlink');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function SendDownlink(alert, deviceEui) {
  try {
    // Fetch the auto-downlink for the specific alertId
    const autoDownlink = await prisma.autodownlink.findFirst({
      where: {
        alertId: alert.id // Ensure we only fetch one downlink for each alert
      }
    });

    // If no downlink exists for the alert, log and return
    if (!autoDownlink) {
      console.log(`No auto-downlink found for alert ID: ${alert.id}`);
      return;
    }

    // Log downlink details for debugging
    console.log(`Sending downlink for alert ID: ${alert.id}`, autoDownlink);

    const device = await prisma.device.findUnique({
      where: {
        deviceId: deviceEui,
      }
    });
    // Prepare data for downlink
    const downlinkData = {
      downlinkController: autoDownlink.downlinkController,
      classType: autoDownlink.classType,
      devEui: autoDownlink.devEui,
      pdu: autoDownlink.pdu,
      timeoutMinutes: autoDownlink.timeout || 5, // Default timeout if none is provided
      port: autoDownlink.port || 2,
      deviceId: device.id
    };

    // Call function to send the downlink
    const response = postDownlinkDevice({ body: downlinkData });
    console.log('Downlink sent successfully', response);

  } catch (error) {
    console.error(`Error sending downlink for alert ID: ${alert.id}`, error);
  }
}
async function sendDownlinkToLoriot(alert, deviceEui) {
  try {
    // Fetch the auto-downlink for the specific alertId
    const autoDownlink = await prisma.autodownlink.findFirst({
      where: {
        alertId: alert.id // Ensure we only fetch one downlink for each alert
      }
    });

    // If no downlink exists for the alert, log and return
    if (!autoDownlink) {
      console.log(`No auto-downlink found for alert ID: ${alert.id}`);
      return;
    }

    // Log downlink details for debugging
    console.log(`Sending downlink for alert ID: ${alert.id}`, autoDownlink);

    const device = await prisma.device.findUnique({
      where: {
        deviceId: deviceEui,
      }
    });
    
    //senra payload
    const downlinkData = {
      downlinkController: autoDownlink.downlinkController,
      classType: autoDownlink.classType,
      devEui: autoDownlink.devEui,
      pdu: autoDownlink.pdu,
      timeoutMinutes: autoDownlink.timeout || 5, // Default timeout if none is provided
      port: autoDownlink.port || 2,
      deviceId: device.id
    };

    // Call function to send the downlink
    const response = downlinkLoriotForAuto({ body:downlinkData , devEui:deviceEui ,device:device });
    console.log('Downlink sent successfully', response);
    return response;
  } catch (error) {
    console.error(`Error sending downlink for alert ID: ${alert.id}`, error);
  }
}

async function sendDownlinkTospecificServer(serverName, alert, deviceEui) {
  if (serverName == 'Loriot') {
    return await sendDownlinkToLoriot(alert, deviceEui);
  }
  else if (serverName == 'SenRa') {
    return await SendDownlink(alert, deviceEui);
  }
}

module.exports = { sendDownlinkTospecificServer };

