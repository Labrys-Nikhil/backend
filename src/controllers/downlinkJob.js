const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const winston = require('winston');
const {controllerPDUByModel} = require('../helper/controllerPDUbyModel');

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

    const deviceData = await prisma.device.findFirst({
      where: {
        deviceId: devEui
      },
      select: {
        hardwareId: true
      }
    })

    const hardwareData = await prisma.hardware.findFirst({
      where: {
        id: deviceData.hardwareId,
      },
      select: {
        id: true,
        //decoderPDU:true,
        modelNo: true
      }
    });
    console.log("device and hardware data", deviceData, hardwareData);

    //then call the decodePDU for that hardware
    const modelNumber = hardwareData.modelNo;

    //last step to call the mapping;
    const controllerPDUData = {
      downlinkController: downlinkController,
      pdu: pdu
    }
    console.log(controllerPDUData);
    const responseOfControllerPDU = await controllerPDUByModel(controllerPDUData, modelNumber);

    console.log("data after the controllerPDU", responseOfControllerPDU);

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

    //first get the hardware through devEUI and modelNumber.
    const deviceData = await prisma.device.findFirst({
      where: {
        deviceId: devEui
      },
      select: {
        hardwareId: true
      }
    })

    const hardwareData = await prisma.hardware.findFirst({
      where: {
        hardwareID: deviceData.hardwareId,
      },
      select: {
        hardwareID: true,
        decoderPDU: true,
        modelNo: true
      }
    });


    //then call the decodePDU for that hardware
    const modelNumber = hardwareData.modelNo;

    //last step to call the mapping;
    const controllerPDUData = {
      downlinkController: downlinkController,
      pdu: pdu
    }
    const responseOfControllerPDU = await controllerPDUByModel(controllerPDUData, modelNumber);

    console.log("data after the controllerPDU", responseOfControllerPDU);

    const device = await prisma.device.findFirst({
      where: { deviceId: devEui },
    });
    console.log("device acording to the devEUI in the autodownlink Settimeout", device);
    
    if (!device) {
      console.log("Device not found with ID:", devEui);
      return res.status(404).json({ message: "Device not found" });
    }
    
    const network = await prisma.networkdata.findFirst({
      where: {
        organizationId: device.organizationId,
        networkId: device.networkId,
        customerId: customerId,
      }
    })
    
    console.log("device acording to the network in the maptheDownlinkTospecificServer", network);
    
    if (!network) {
      return res.status(500).json({ message: "network not found" });
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
      message: 'Error sending data to SenRa',
      details: error.response?.data || error.message
    };
  };
};


module.exports = { checkDownlinkStatuses };

