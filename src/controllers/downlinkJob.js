// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const { postDownlinkDevice } = require('../controllers/downlinkController'); // Import your function

// // Function to check the AutoDownlinkWithDelay model and set timeouts for downlink API calls
// const checkDownlinkStatuses = async () => {
//   try {
//     // Fetch active downlinks that are not yet confirmed (i.e., isActive is true and not processing)
//     const downlinks = await prisma.autoDownlinkWithDelay.findMany({
//       where: { isActive: true, isProcessing: false },  // Only consider active and not being processed
//     });
//     console.log("downlinks fetched",downlinks);
//     // Loop through each downlink entry
//     for (const downlink of downlinks) {
//       const { id, timeoutMinutes, deviceId, downlinkController, devEui, pdu, port, classType, createdAt } = downlink;

//       // Calculate the timeout based on the createdAt timestamp and timeoutMinutes
//       const elapsedMinutes = (new Date() - new Date(createdAt)) / 60000; // Time difference in minutes
//       const remainingMinutes = timeoutMinutes - elapsedMinutes;

//       if (remainingMinutes > 0) {
//         // Convert remainingMinutes to milliseconds for setTimeout
//         const timeout = remainingMinutes * 60 * 1000;

//         // Mark as processing before starting the downlink
//         const updatedIsProcessing = await prisma.autoDownlinkWithDelay.update({
//           where: { id: downlink.id },
//           data: { isProcessing: true },
//         });
//         console.log("isprocessing",updatedIsProcessing);

//         setTimeout(async () => {
//           try {
//             // Prepare the data to be passed to postDownlinkDevice
//             const data = {
//               downlinkController:downlink.downlinkController,
//               classType:downlink.downlinkController,
//               devEui:downlink.downlinkController,
//               pdu:downlink.pdu,
//               confirmed: 'false',
//               timeoutMinutes:downlink.downlinkController,
//               deviceId::downlink.downlinkController
//             };

//             // Call the postDownlinkDevice function directly with the data
//             await postDownlinkDevice(data);

//             // Mark as complete (processed)
//             await prisma.autoDownlinkWithDelay.update({
//               where: { id: downlink.id },
//               data: { isActive: false, isProcessing: false },
//             });
//           } catch (error) {
//             console.error(`Error processing Downlink ID ${id}:`, error);
//             // Even if there’s an error, reset `isProcessing` to false
//             await prisma.autoDownlinkWithDelay.update({
//               where: { id: downlink.id },
//               data: { isProcessing: false },
//             });
//           }
//         }, timeout);
//       } else {
//         console.log(`Downlink for device ${deviceId} has already passed the timeout.`);
//         // Optionally, mark the downlink as inactive if it has passed its timeout
//         await prisma.autoDownlinkWithDelay.update({
//           where: { id },
//           data: { isActive: false },
//         });
//       }
//     }
//   } catch (error) {
//     console.error('Error checking downlink statuses:', error);
//   }
// };

// module.exports = { checkDownlinkStatuses };

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // Function to check the AutoDownlinkWithDelay model and set timeouts for downlink API calls
// const checkDownlinkStatuses = async () => {
//   try {
//     // Fetch active downlinks that are not yet confirmed (i.e., isActive is true and not processing)
//     const downlinks = await prisma.autoDownlinkWithDelay.findMany({
//       where: { isActive: true, isProcessing: false },  // Only consider active and not being processed
//     });
//     console.log("Downlinks fetched", downlinks);

//     // Loop through each downlink entry
//     for (const downlink of downlinks) {
//       const { id, timeoutMinutes, deviceId, downlinkController, devEui, pdu, port, classType, createdAt } = downlink;

//       // Calculate the timeout based on the createdAt timestamp and timeoutMinutes
//       const elapsedMinutes = (new Date() - new Date(createdAt)) / 60000; // Time difference in minutes
//       const remainingMinutes = timeoutMinutes - elapsedMinutes;

//       if (remainingMinutes > 0) {
//         // Convert remainingMinutes to milliseconds for setTimeout
//         const timeout = remainingMinutes * 60 * 1000;

//         // Mark as processing before starting the downlink
//         const updatedIsProcessing = await prisma.autoDownlinkWithDelay.update({
//           where: { id: downlink.id },
//           data: { isProcessing: true },
//         });
//         console.log("isProcessing updated to true:", updatedIsProcessing);

//         setTimeout(async () => {
//           try {
//             // Toggle the pdu value: If it's 'on' change it to 'off', and if it's 'off' change it to 'on'
//             const updatedPdu = pdu === 'on' ? 'off' : 'on';

//             // Prepare the data to be passed to postDownlinkDevice
//             const data={
//                 downlinkController,
//                 classType,
//                 devEui,
//                 pdu:updatedPdu,
//                 confirmed:'false',
//                 timeoutMinutes,
//                 deviceId
//             }

//             // Log the updated data before sending
//             console.log("Sending updated downlink data:", data);

//             // Call the postDownlinkDevice function directly with the updated data
//             const response = await postDownlinkDeviceOFF(data);

//             console.log("response downlink wala",response);
//             if(response.status === 200){
//                 console.log("autodownlink is working bhai maje kar");
//             }
//             // Mark as complete (processed)
//             await prisma.autoDownlinkWithDelay.update({
//               where: { id: downlink.id },
//               data: { isActive: false, isProcessing: false },
//             });
//           } catch (error) {
//             console.error(`Error processing Downlink ID ${id}:`, error);
//             // Even if there’s an error, reset `isProcessing` to false
//             await prisma.autoDownlinkWithDelay.update({
//               where: { id: downlink.id },
//               data: { isProcessing: false },
//             });
//           }
//         }, timeout);
//       } else {
//         console.log(`Downlink for device ${deviceId} has already passed the timeout.`);
//         // Optionally, mark the downlink as inactive if it has passed its timeout
//         await prisma.autoDownlinkWithDelay.update({
//           where: { id },
//           data: { isActive: false },
//         });
//       }
//     }
//   } catch (error) {
//     console.error('Error checking downlink statuses:', error);
//   }
// };


// //post downlink wala function
// const postDownlinkDeviceOFF = async (req, res) => {
//     try {
//         const {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed = 'false',
//             timeoutMinutes,
//             deviceId
//         } = req.body;

//         console.log("Received request data:", {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed,
//             timeoutMinutes,
//             deviceId
//         });

//         let packet;
//         let relay1State = 'off';
//         let relay2State = 'off';

//         if (downlinkController === "relay 1") {
//             packet = generateRelay1Packet(pdu);
//             relay1State = pdu === 'on' ? 'on' : 'off';
//         } else if (downlinkController === "relay 2") {
//             packet = generateRelay2Packet(pdu);
//             relay2State = pdu === 'on' ? 'on' : 'off';
//         } else if (downlinkController === "relay 1+2") {
//             packet = generateBothRelayPacket(pdu);
//             relay1State = pdu === 'on' ? 'on' : 'off';
//             relay2State = pdu === 'on' ? 'on' : 'off';
//         } else {
//             console.log("Invalid downlinkController:", downlinkController);
//             return res.status(400).json({ message: "Invalid downlink controller" });
//         }

//         console.log("Generated packet:", packet);

//         const device = await prisma.device.findFirst({
//             where: { id: deviceId },
//         });

//         if (!device) {
//             console.log("Device not found with ID:", deviceId);
//             return res.status(404).json({ message: "Device not found" });
//         }

        

//         const data = {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed: confirmed === 'true',
//             timeoutMinutes: timeoutMinutes === 5,
//             port: packet["Port"],
//             payload: packet["Payload"],
//             deviceId: device.id
//         };

//         const params = new URLSearchParams();
//         params.append('class', classType);
//         params.append('confirmed', confirmed);
//         params.append('devEui', devEui);
//         params.append('pdu', packet["Payload"]);
//         params.append('port', packet["Port"]);
//         params.append('timeoutMinutes', timeoutMinutes);

//         const response = await axios.post(
//             `https://portal.senraco.io/rest/current/device/sendmsg?${params.toString()}`,
//             {},
//             {
//                 headers: {
//                     'authorization': 'AK3:UARIci2iL6EeCbhbupMqFaevRxt59CnqGqFFRRwCx'
//                 }
//             }
//         );

//         if (response.status === 200) {
//             const savedDownlink = await prisma.downlinkdevice.create({
//                 data: {
//                     downlinkController:data.downlinkController,
//                     classType:data.classType,
//                     devEui:data.devEui,
//                     pdu:data.pdu,
//                     port: packet["Port"],
//                     payload: packet["Payload"],
//                     deviceId: data.deviceId
//                 }
//             });
//             console.log("Saved Downlink Device:", savedDownlink);
//         }

//         res.status(response.status).json(response.data);

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(error.response?.status || 500).json({
//             message: 'Error sending data to SenRa',
//             details: error.response?.data || error.message
//         });
//     }
// };


// // Function to generate packet for Relay 1
// function generateRelay1Packet(value) {
//     const packet = {};
//     if (value.toLowerCase() === 'on') {
//         packet["Payload"] = "030111"; // Relay 1: On
//     } else if (value.toLowerCase() === 'off') {
//         packet["Payload"] = "030011"; // Relay 1: Off
//     } else {
//         packet["Payload"] = "031111"; // Relay 1: No change
//     }
//     packet["Port"] = "2";
//     return packet;
// }

// // Function to generate packet for Relay 2
// function generateRelay2Packet(value) {
//     const packet = {};
//     if (value.toLowerCase() === 'on') {
//         packet["Payload"] = "031101"; // Relay 2: On
//     } else if (value.toLowerCase() === 'off') {
//         packet["Payload"] = "031100"; // Relay 2: Off
//     } else {
//         packet["Payload"] = "031111"; // Relay 2: No change
//     }
//     packet["Port"] = "2";
//     return packet;
// }

// // Function to generate packet for Relay 1 and Relay 2
// function generateBothRelayPacket(value) {
//     const packet = {};
//     if (value.toLowerCase() === 'on') {
//         packet["Payload"] = "030101"; // Both Relays: On
//     } else if (value.toLowerCase() === 'off') {
//         packet["Payload"] = "030000"; // Both Relays: Off
//     } else {
//         packet["Payload"] = "031111"; // No change
//     }
//     packet["Port"] = "2";
//     return packet;
// }

// module.exports = { checkDownlinkStatuses };


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

// Function to check the AutoDownlinkWithDelay model and set timeouts for downlink API calls
const checkDownlinkStatuses = async () => {
  try {
    // Fetch active downlinks that are not yet confirmed (i.e., isActive is true and not processing)
    const downlinks = await prisma.autoDownlinkWithDelay.findMany({
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
        const updatedIsProcessing = await prisma.autoDownlinkWithDelay.update({
          where: { id: downlink.id },
          data: { isProcessing: true },
        });
        console.log("isProcessing updated to true:", updatedIsProcessing);

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
            const response = await postDownlinkDeviceOFF(data);

            console.log("Response from downlink:", response);
            if (response.status === 200) {
              console.log("AutoDownlink is successful.");
            }

            // Mark as complete (processed)
            await prisma.autoDownlinkWithDelay.update({
              where: { id: downlink.id },
              data: { isActive: false, isProcessing: false },
            });
          } catch (error) {
            console.error(`Error processing Downlink ID ${id}:`, error);
            // Even if there’s an error, reset `isProcessing` to false
            await prisma.autoDownlinkWithDelay.update({
              where: { id: downlink.id },
              data: { isProcessing: false },
            });
          }
        }, timeout);
      } else {
        console.log(`Downlink for device ${deviceId} has already passed the timeout.`);
        // Optionally, mark the downlink as inactive if it has passed its timeout
        await prisma.autoDownlinkWithDelay.update({
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
          deviceId: data.deviceId
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
