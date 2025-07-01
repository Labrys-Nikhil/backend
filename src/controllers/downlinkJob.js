
const axios = require('axios');
const {controllerPDUByModel} = require('../helper/controllerPDUbyModel');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' }),
  ],
});

// Function to check the AutoDownlinkWithDelay model and set timeouts for downlink API calls
const checkDownlinkStatuses = async () => {
  try {
    // Fetch active downlinks that are not yet confirmed (i.e., isActive is true and not processing)
    const downlinks = await prisma.autodownlinkwithdelay.findMany({
      where: { isActive: true, isProcessing: false },  // Only consider active and not being processed
    });
    console.log("Downlinks fetched", downlinks);

    // Loop through each downlink entry
    for (const downlink of downlinks) {
      const { id, timeoutMinutes, deviceId, downlinkController, devEui, pdu, port, classType, createdAt } = downlink;

      // Calculate the timeout based on the createdAt timestamp and timeoutMinutes
      const elapsedMinutes = (new Date() - new Date(createdAt)) / 60000; // Time difference in minutes
      const remainingMinutes = timeoutMinutes - elapsedMinutes;

      if (remainingMinutes > 0) {
        // Convert remainingMinutes to milliseconds for setTimeout
        const timeout = remainingMinutes * 60 * 1000;

        // Mark as processing before starting the downlink
        const updatedIsProcessing = await prisma.autodownlinkwithdelay.update({
          where: { id: downlink.id },
          data: { isProcessing: true },
        });
        console.log("isProcessing updated to true:", updatedIsProcessing);

        // find the newtwork id =====> on behalf of that you will get the down linkflow.


        setTimeout(async () => {
          try {
            // Toggle the pdu value: If it's 'on' change it to 'off', and if it's 'off' change it to 'on'
            const updatedPdu = pdu === 'on' ? 'off' : 'on';

            // Prepare the data to be passed to postDownlinkDevice
            const data = {
              downlinkController,
              classType,
              devEui,
              pdu: updatedPdu,
              confirmed: 'false',
              timeoutMinutes,
              deviceId
            }

            // Log the updated data before sending
            console.log("Sending updated downlink data:", data);

            // Call the postDownlinkDeviceOFF function directly with the updated data

            const device = await prisma.device.findFirst({
              where: { deviceId: devEui },
            });

            const newtworkId = device.networkId;


            if (newtworkId === 1) {
              //senra
              const response = await postDownlinkDeviceOFF(data);

              console.log("Response from downlink:", response);
              if (response.status === 200) {
                console.log("AutoDownlink is successful.");
              }

              // Mark as complete (processed)
              await prisma.autodownlinkwithdelay.update({
                where: { id: downlink.id },
                data: { isActive: false, isProcessing: false },
              });

            } else if (newtworkId === 2) {
              //ttn

            } else if (newtworkId === 3) {
              //loriot
              const response = await downlinkLoriotDeviceOFf(data);

              console.log("Response from downlink:", response);
              if (response.status === 200) {
                console.log("AutoDownlink is successful.");
              }

              // Mark as complete (processed)
              await prisma.autodownlinkwithdelay.update({
                where: { id: downlink.id },
                data: { isActive: false, isProcessing: false },
              });

            } else {
              console.error(`Network ID not found for device ${deviceId}`);
              return;
            }

          } catch (error) {
            console.error(`Error processing Downlink ID ${id}:`, error);
            // Even if there’s an error, reset `isProcessing` to false
            await prisma.autodownlinkwithdelay.update({
              where: { id: downlink.id },
              data: { isProcessing: false },
            });
          }
        }, timeout);
      } else {
        console.log(`Downlink for device ${deviceId} has already passed the timeout.`);
        // Optionally, mark the downlink as inactive if it has passed its timeout
        await prisma.autodownlinkwithdelay.update({
          where: { id },
          data: { isActive: false },
        });
      }
    }
  } catch (error) {
    console.error('Error checking downlink statuses:', error);
  }
};

// Post downlink function
const postDownlinkDeviceOFF = async (data) => {
  try {
    const {
      downlinkController,
      classType,
      devEui,
      pdu,
      confirmed = 'false',
      timeoutMinutes,
      deviceId
    } = data;

    console.log("Received request data:", {
      downlinkController,
      classType,
      devEui,
      pdu,
      confirmed,
      timeoutMinutes,
      deviceId
    });

    let packet;
    let relay1State = 'off';
    let relay2State = 'off';

    if (downlinkController === "relay 1") {
      packet = generateRelay1Packet(pdu);
      relay1State = pdu === 'on' ? 'on' : 'off';
    } else if (downlinkController === "relay 2") {
      packet = generateRelay2Packet(pdu);
      relay2State = pdu === 'on' ? 'on' : 'off';
    } else if (downlinkController === "relay 1+2") {
      packet = generateBothRelayPacket(pdu);
      relay1State = pdu === 'on' ? 'on' : 'off';
      relay2State = pdu === 'on' ? 'on' : 'off';
    } else {
      console.log("Invalid downlinkController:", downlinkController);
      return { status: 400, message: "Invalid downlink controller" };
    }

    console.log("Generated packet:", packet);

    const device = await prisma.device.findFirst({
      where: { id: deviceId },
    });

    if (!device) {
      console.log("Device not found with ID:", deviceId);
      return { status: 404, message: "Device not found" };
    }

    const params = new URLSearchParams();
    params.append('class', classType);
    params.append('confirmed', confirmed);
    params.append('devEui', devEui);
    params.append('pdu', packet["Payload"]);
    params.append('port', packet["Port"]);
    params.append('timeoutMinutes', timeoutMinutes);

    const response = await axios.post(
      `https://portal.senraco.io/rest/current/device/sendmsg?${params.toString()}`,
      {},
      {
        headers: {
          'authorization': 'AK3:UARIci2iL6EeCbhbupMqFaevRxt59CnqGqFFRRwCx'
        }
      }
    );

    if (response.status === 200) {
      const savedDownlink = await prisma.downlinkdevice.create({
        data: {
          downlinkController: data.downlinkController,
          classType: data.classType,
          devEui: data.devEui,
          pdu: data.pdu,
          port: packet["Port"],
          payload: packet["Payload"],
          deviceId: data.deviceId,
          timeoutMinutes: data.timeoutMinutes
        }
      });
      console.log("Saved Downlink Device:", savedDownlink);
    }

    return { status: response.status, data: response.data };

  } catch (error) {
    console.error("Error:", error);
    return {
      status: error.response?.status || 500,
      message: 'Error sending data to SenRa',
      details: error.response?.data || error.message
    };
  }
};



const downlinkLoriotDeviceOFf = async (data) => {

  try {

    logger.info("Received downlink request.");
    const {
      downlinkController,
      classType,
      devEui,
      pdu,
      confirmed = 'false',
      timeoutMinutes,
      deviceId
    } = data;

    const device = await prisma.device.findFirst({
      where: { deviceId: devEui },
    });

    const hardwareData = await prisma.hardware.findFirst({
      where: {
        id: device.hardwareId,
      },
      select: {
        id: true,
        //decoderPDU:true,
        modelNo: true
      }
    });
    console.log("device and hardware data", device, hardwareData);

    //then call the decodePDU for that hardware
    const modelNumber = hardwareData.modelNo;

    //last step to call the mapping;
    const controllerPDUData = {
      downlinkController: downlinkController,
      pdu: pdu
    }
    console.log(controllerPDUData);
    const responseOfControllerPDU = await controllerPDUByModel(controllerPDUData, modelNumber);


    const customerId = await prisma.organization.findFirst({
      where: {
        id: device.organizationId,
      },
      select: {
        customerId: true,
      }
    })
    console.log("cutomerId----->", customerId);
    if (!device) {
      logger.warn("Device not found in loriot downlink.");
      return res.status(400).json({ error: 'Invalid: device not found in loriot downlink' });
    }

    logger.info("Device found:", { device });
    console.log(device.networkId);
    // Fetch network details
    const network = await prisma.networkdata.findFirst({
      where: {
        networkId: device.networkId, // Use networkId from selected fields
        organizationId: device.organizationId,
        customerId: customerId.customerId,
      },
    });

    if (!network) {
      logger.warn("Network not found for the given device.");
      return res.status(400).json({ error: 'Invalid: network not found' });
    }

    logger.info("Network found:", { network });


    const servername = network.hostname;
    const serverToken = network.token;
    logger.info("Fetched network details:", { servername });

    const fullServerName = `${servername}.loriot.io`;
    const baseUrl = `https://${fullServerName}/1/rest`;
    logger.info("Constructed base URL:", { baseUrl });

    // Prepare downlink payload
    const payload = {
      cmd: 'tx',
      EUI: devEui,
      port: Number(responseOfControllerPDU?.Port),
      confirmed: confirmed,
      priority: 2,
      data: responseOfControllerPDU?.Payload,
      appid: network.appid
    };

    logger.info("Downlink payload:", { payload });

    // Send downlink request
    const response = await axios.post(baseUrl, payload, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${serverToken}` },
    });

    logger.info("Downlink API response:", { response: response });

    if (response.status === 200) {
      const savedDownlink = await prisma.downlinkdevice.create({
        data: {
          downlinkController: downlinkController,
          classType: classType,
          devEui: devEui,
          pdu: pdu,
          port: responseOfControllerPDU?.Port,
          payload: responseOfControllerPDU?.Payload,
          deviceId: deviceId,
          timeoutMinutes: timeoutMinutes
        }
      });
      console.log("Saved Downlink Device:", savedDownlink);
    }

    return { status: response.status, data: response.data };

  } catch (error) {
    logger.error("Error processing downlink:", { error: error.message });
    return {
      status: error.response?.status || 500,
      message: 'Error sending data',
      details: error.response?.data || error.message
    };
  };
};

// Function to generate packet for Relay 1
function generateRelay1Packet(value) {
  const packet = {};
  if (value.toLowerCase() === 'on') {
    packet["Payload"] = "030111"; // Relay 1: On
  } else if (value.toLowerCase() === 'off') {
    packet["Payload"] = "030011"; // Relay 1: Off
  } else {
    packet["Payload"] = "031111"; // Relay 1: No change
  }
  packet["Port"] = "2";
  return packet;
}

// Function to generate packet for Relay 2
function generateRelay2Packet(value) {
  const packet = {};
  if (value.toLowerCase() === 'on') {
    packet["Payload"] = "031101"; // Relay 2: On
  } else if (value.toLowerCase() === 'off') {
    packet["Payload"] = "031100"; // Relay 2: Off
  } else {
    packet["Payload"] = "031111"; // Relay 2: No change
  }
  packet["Port"] = "2";
  return packet;
}

// Function to generate packet for Relay 1 and Relay 2
function generateBothRelayPacket(value) {
  const packet = {};
  if (value.toLowerCase() === 'on') {
    packet["Payload"] = "030101"; // Both Relays: On
  } else if (value.toLowerCase() === 'off') {
    packet["Payload"] = "030000"; // Both Relays: Off
  } else {
    packet["Payload"] = "031111"; // No change
  }
  packet["Port"] = "2";
  return packet;
}

module.exports = { checkDownlinkStatuses };

