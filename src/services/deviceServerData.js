// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const logger = require('../utils/logger'); // Assuming you already have the logger set up
// const emailService = require('../services/emailService')

// const createDevice = async (data) => {
//   logger.info(`Creating a new device with data:`, data); // Log the data being used to create the device

//   try {
//     // Step 1: Get the euiId (devEui from request data)
//     const deviceEUI = data.devEui;
//     console.log("deviceEUI", deviceEUI);
//     // Step 2: Fetch Device S No from Device table using devEUI
//     const device = await prisma.device.findFirst({
//       where: {
//         deviceId: deviceEUI,
//       },
//     });

//     console.log("device found ", device)
//     // return 
//     if (!device) {
//       throw new Error('Device not found');
//     }


//     const customerDetails = await getCustomerEmail(device.projectId)

//     const decodedData = decodePDU(data.pdu);

//     // Step 3: Create a new entry in DeviceServerData
//     const newDevice = await prisma.deviceServerData.create({
//       data: {
//         ack: data.ack,
//         appEui: data.appEui,
//         channel: data.channel,
//         datarate: data.datarate,
//         devClass: data.devClass,
//         devEui: data.devEui,
//         devProfile: data.devProfile,
//         devType: data.devType,
//         dup: data.dup,
//         estLat: data.estLat,
//         estLng: data.estLng,
//         freq: data.freq,
//         gwEui: data.gwEui,
//         gwRxTime: data.gwRxTime,
//         ismBand: data.ismBand,
//         joinId: data.joinId,
//         maxPayload: data.maxPayload,
//         pdu: data.pdu,
//         port: data.port,
//         rssi: data.rssi,
//         seqno: data.seqno,
//         snr: data.snr,
//         txtime: data.txtime,
//         deviceId: device.id,
//         decodedData :decodedData
//       },
//     });

//     // Step 4: Fetch the exact timestamp from the database (directly from newDevice)
//     const timestamp = newDevice.createdAt || new Date(); // Fallback to current date if timestamp is not found

//     // Step 5: Decode the PDU (dummy function for now)
//     // const decodedData = decodePDU(data.pdu);
//     logger.info('Decoded Data:', decodedData);

//     // Initialize an array to hold the promises for decoded data insertion
//     const decodePromises = [];

//     // Save each decoded attribute in the DeviceDecodeData model
//     for (const [attributeName, attributeDetails] of Object.entries(decodedData)) {
//       const { value, unit } = attributeDetails; // Extract value and unit from decoded data
//       const newDecodeEntry = prisma.deviceDecodeData.create({
//         data: {
//           deviceId: device.id,
//           devEui: data.devEui,
//           attributesName: attributeName,  // e.g., 'temperature', 'humidity'
//           attributesValue: value.toString(),  // Store as string
//           attributesUnits: unit,  // Store the unit, e.g., '°C', '%'
//         },
//       });
//       decodePromises.push(newDecodeEntry); // Add each promise to the array
//     }

//     // Wait for all promises to resolve
//     const newDecodeEntries = await Promise.all(decodePromises);
//     console.log("newDecodeEntries", newDecodeEntries)
//     // Log success message with the new decode entries
//     logger.info('Decoded data saved successfully:', newDecodeEntries);

//     // Run the threshold check service asynchronously, now passing deviceId, timestamp, and decodedData
//     checkThresholdService(device.id, timestamp, decodedData, customerDetails, device.name, device.deviceId)
//       .then(() => logger.info(`Threshold check for device ${device.id} completed.`))
//       .catch((error) => logger.error('Error running threshold check:', error));



//     // Return the response before the threshold check finishes
//     return { device: newDevice, decodedData: newDecodeEntries };

//   } catch (error) {
//     logger.error('Error creating device and decoded data:', error);
//     throw error; // Rethrow the error for further handling
//   }
// };


// async function checkThresholdService(deviceId, timestamp, decodedData, customerDetails, deviceName, deviceEui) {
//   try {
//     console.log("helo 1 ", customerDetails, deviceName, deviceEui)
//     logger.info(`Checking thresholds for device: ${deviceId} at timestamp: ${timestamp}`);

//     // Fetch threshold values for this device
//     const thresholds = await fetchThresholds(deviceId);
//     // Check if any decoded attributes exceed the threshold limits
//     const exceedingAttributes = checkThreshold(decodedData, thresholds);
//     console.log("exceedingAttributes", exceedingAttributes)
//     let alertData = '';

//     // If there are exceeding attributes, send notifications
//     if (exceedingAttributes.length > 0) {
//       alertData = await sendNotifications(deviceId, exceedingAttributes);
//       logger.info(`Notifications sent for device ${deviceId} for exceeding attributes`);
//     }

//     console.log("alertData", alertData); // Log alertData for debugging

//     if (exceedingAttributes && exceedingAttributes.length > 0) {
//       const alertDetails = exceedingAttributes.map(attr => ({
//         attribute: attr.name, // Extracting the attribute name
//         value: attr.value,     // Extracting the attribute value
//       }));

//       console.log("alertDetails", alertDetails)
//       await emailService.sendAlertMail(customerDetails.firstName, customerDetails.email, alertDetails, deviceName, deviceEui);
//       logger.info(`Alert email sent to ${customerDetails.email}`);
//     } else {
//       logger.info(`No alerts to send for device ${deviceId}`);
//     }


//   } catch (error) {
//     logger.error(`Error in checkThresholdService for device ${deviceId}:`, error);
//     throw error;
//   }
// }


// function checkThreshold(decodedData, alerts) {
//   console.log("Decoded Data:", decodedData);
//   console.log("Alerts:", alerts);

//   const exceedingAttributes = [];

//   // Iterate through each alert to check the corresponding decoded data attribute
//   for (const alert of alerts) {
//     // Get the threshold value and operator from the alert
//     const thresholdValue = alert.value;
//     const operator = alert.operator;

//     // Identify the attribute name to check from the decoded data
//     const attributeName = "temperature"; // Example: you can change this to other attribute names based on your requirements.

//     // Get the current value of the attribute from decoded data
//     const attributeValue = parseFloat(decodedData[attributeName]?.value); // Convert the value to float

//     console.log(`Checking attribute: ${attributeName}, value: ${attributeValue}`);

//     // Check if the attribute exists in decoded data and is a valid number
//     if (!isNaN(attributeValue)) {
//       // Check if the attribute value exceeds the alert's threshold value
//       const conditionMet = checkAlertCondition(operator, attributeValue, thresholdValue);
//       console.log(`Condition Met for ${attributeName}:`, conditionMet);

//       if (conditionMet) {
//         exceedingAttributes.push({
//           name: attributeName,
//           value: attributeValue,
//           alertId: alert.id
//         });
//       }
//     } else {
//       console.warn(`Invalid attribute value for ${attributeName}: ${attributeValue}`);
//     }
//   }

//   return exceedingAttributes;
// }

// // Example of a checkAlertCondition function
// function checkAlertCondition(operator, attributeValue, thresholdValue) {
//   switch (operator) {
//     case '>=':
//       return attributeValue >= thresholdValue;
//     case '<=':
//       return attributeValue <= thresholdValue;
//     case '>':
//       return attributeValue > thresholdValue;
//     case '<':
//       return attributeValue < thresholdValue;
//     case '=':
//       return attributeValue === thresholdValue;
//     // Add additional cases for other operators as needed
//     default:
//       console.warn(`Unknown operator: ${operator}`);
//       return false; // Treat unknown operators as no condition met
//   }
// }



// async function sendNotifications(deviceId, exceedingAttributes) {
//   console.log(`Sending notifications for deviceId: ${deviceId} with exceeding attributes:`, exceedingAttributes);

//   const notifications = []; // Array to hold the notifications

//   for (const attribute of exceedingAttributes) {
//     // Create a notification in the database
//     const notification = await prisma.notification.create({
//       data: {
//         message: `Alert triggered: ${attribute.name} value (${attribute.value}) exceeded threshold.`,
//         deviceId: deviceId,
//       },
//     });
//     notifications.push(notification); // Store the created notification
//   }

//   return notifications; // Return the array of notifications
// }


// // Dummy function to simulate fetching thresholds from the alert table
// async function fetchThresholds(deviceId) {
//   // Simulated alert thresholds for temperature, humidity, and pressure
//   return await prisma.alerts.findMany({
//     where: {
//       deviceId: deviceId,
//     },
//   });
// }


// async function getCustomerEmail(projectId) {
//   try {
//     const getcustomerId = await prisma.projects.findFirst({
//       where: { id: projectId },
//       select: { customerId: true },
//     })

//     if (!getcustomerId) {
//       throw new Error("Project not found")
//     }

//     const customer = await prisma.customer.findFirst({
//       where: { id: getcustomerId.customerId },
//       select: { firstName: true, email: true },
//     })

//     return customer;


//   } catch (error) {
//     throw new Error(error.message)
//   }
// }

// function decodePDU(pdu) {
//   // Extract fields and convert from hexadecimal to decimal
//   const batteryHex = parseInt(pdu.substring(0, 4), 16);  // First 2 bytes (Battery in hex)
//   const temperature = parseInt(pdu.substring(4, 8), 16) / 100;  // Next 2 bytes (temperature in Celsius)
//   const humidity = parseInt(pdu.substring(8, 12), 16) / 10;  // Next 2 bytes (humidity as percentage)
//   const status = parseInt(pdu.substring(12, 14), 16);  // Next 1 byte (status)
//   const temperature_c_ds = parseInt(pdu.substring(14, 18), 16) / 100;  // Convert temperature to Celsius
//   const unix_timestamp = parseInt(pdu.substring(18, 22), 16);  // Next 2 bytes (Unix timestamp)

//   // Calculate battery voltage based on your provided formula:
//   const battery_status = (batteryHex >> 14) & 0xFF;  // (Battery >> 14) & 0xFF = battery status
//   const battery_voltage = batteryHex & 0x3FFF;  // Battery voltage = Battery & 0x3FFF

//   // Convert battery voltage to millivolts (as 2980 mV in example)
//   const battery_voltage_mV = battery_voltage;  // 2980 mV

//   // Return the decoded values along with their units
//   return {
//     battery_status: { value: battery_status, unit: "" },  // No unit for status
//     battery_voltage_mV: { value: battery_voltage_mV, unit: "mV" },  // Battery in millivolts
//     temperature: { value: temperature.toFixed(2), unit: "°C" },  // Temperature in Celsius
//     humidity: { value: humidity.toFixed(1), unit: "%" },  // Humidity in percentage
//     status: { value: status, unit: "" },  // No unit for status
//     temperature_c_ds: { value: temperature_c_ds.toFixed(2), unit: "°C" },  // Secondary temperature in Celsius
//     unix_timestamp: { value: unix_timestamp, unit: "" }  // No unit for timestamp
//   };
// }


// const getAllDevices = async () => {
//   logger.info('Fetching all devices...'); // Log before fetching
//   try {
//     const devices = await prisma.deviceServerData.findMany();
//     logger.info('Devices fetched successfully:', devices); // Log successful fetch
//     return devices;
//   } catch (error) {
//     logger.error('Error fetching devices:', error); // Log error
//     throw error;
//   }
// };


// const getRecentDevice = async () => {
//   logger.info('Fetching the most recent device...'); // Log before fetching
//   try {
//     const recentDevice = await prisma.deviceServerData.findMany({
//       orderBy: {
//         // Replace `updatedAt` with the actual field you want to order by
//         id: 'desc', // Order by descending to get the most recent
//       },
//       take: 1, // Limit the results to just 1
//     });

//     // If you want to return the first element of the array
//     return recentDevice[0] || null; // Return null if no device is found
//   } catch (error) {
//     logger.error('Error fetching the most recent device:', error); // Log error
//     throw error;
//   }
// };


// const getDeviceById = async (devEui) => {
//   logger.info(`Fetching devices with EUI: ${devEui}`); // Log the EUI being fetched
//   try {
//     const devices = await prisma.deviceServerData.findMany({
//       where: { devEui: devEui }, // Fetch all devices matching the devEui
//       orderBy: { id: 'desc' }   // Order by id in descending order

//     });

//     if (devices.length > 0) {
//       logger.info('Devices fetched successfully:', devices); // Log successful fetch
//     } else {
//       logger.warn('No devices found with the specified EUI'); // Log if no devices found
//     }

//     return devices; // Return all matching devices (or an empty array)
//   } catch (error) {
//     logger.error('Error fetching devices:', error); // Log error
//     throw error; // Rethrow the error for further handling
//   }
// };


// const updateDevice = async (id, data) => {
//   logger.info(`Updating device with ID: ${id} with data:`, data); // Log the ID and data being updated
//   try {
//     const updatedDevice = await prisma.deviceServerData.update({
//       where: { id: Number(id) },
//       data
//     });
//     logger.info('Device updated successfully:', updatedDevice); // Log successful update
//     return updatedDevice;
//   } catch (error) {
//     logger.error('Error updating device:', error); // Log error
//     throw error;
//   }
// };

// const deleteDevice = async (id) => {
//   logger.info(`Deleting device with ID: ${id}`); // Log the ID being deleted
//   try {
//     const deletedDevice = await prisma.deviceServerData.delete({
//       where: { id: Number(id) }
//     });
//     logger.info('Device deleted successfully:', deletedDevice); // Log successful deletion
//     return deletedDevice;
//   } catch (error) {
//     logger.error('Error deleting device:', error); // Log error
//     throw error;
//   }
// };

// module.exports = {
//   getAllDevices,
//   getDeviceById,
//   createDevice,
//   updateDevice,
//   deleteDevice,
//   getRecentDevice
// };


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger'); // Assuming you already have the logger set up
const emailService = require('../services/emailService')
const moment = require('moment-timezone');
const { device } = require('../config/database');
const { calculatePagination, filterTransactionsByDate } = require('../helper/commonHelper');
const { postDownlinkDevice } = require('../controllers/downlinkController');

const createDevice = async (data) => {
  logger.info(`Creating a new device with data:`, data); // Log the data being used to create the device

  console.log("create server data payload",data)
  try {
    // Step 1: Get the euiId (devEui from request data)
    const deviceEUI = data.devEui;
    console.log("deviceEUI", deviceEUI);
    // Step 2: Fetch Device S No from Device table using devEUI
    const device = await prisma.device.findFirst({
      where: {
        deviceId: deviceEUI,
      },
      include: {
        hardware: true, // This will fetch the related hardware data
      },
    });
    const modelNumber = device.hardware.modelNo;

    // return console.log("check device details here ", modelNumber)

    console.log("device found ", device)
    // return 
    if (!device) {
      throw new Error('Device not found');
    }

    const decodedData = decodePDUByModel(data.pdu, modelNumber);
    console.log("decodedData", decodedData);
    const customerDetails = await getCustomerEmail(device.projectId)

    // const decodedDat = decodePDUForTemperature(data.pdu);

    // Step 3: Create a new entry in DeviceServerData
    const newDevice = await prisma.deviceserverdata.create({
      data: {
        ack: data.ack,
        appEui: data.appEui,
        channel: data.channel,
        datarate: data.datarate,
        devClass: data.devClass,
        devEui: data.devEui,
        devProfile: data.devProfile,
        devType: data.devType,
        dup: data.dup,
        estLat: data.estLat,
        estLng: data.estLng,
        freq: data.freq,
        gwEui: data.gwEui,
        gwRxTime: data.gwRxTime,
        ismBand: data.ismBand,
        joinId: data.joinId,
        maxPayload: data.maxPayload,
        pdu: data.pdu,
        port: data.port,
        rssi: data.rssi,
        seqno: data.seqno,
        snr: data.snr,
        txtime: data.txtime,
        deviceId: device.id,
        decodedData: decodedData
      },
    });

    // Step 4: Fetch the exact timestamp from the database (directly from newDevice)
    const timestamp = newDevice.createdAt || new Date(); // Fallback to current date if timestamp is not found

    // Step 5: Decode the PDU (dummy function for now)
    // const decodedData = decodePDU(data.pdu);
    logger.info('Decoded Data:', decodedData);

    // Initialize an array to hold the promises for decoded data insertion
    const decodePromises = [];

    // Save each decoded attribute in the DeviceDecodeData model
    for (const [attributeName, attributeDetails] of Object.entries(decodedData)) {
      const { value, unit } = attributeDetails; // Extract value and unit from decoded data
      console.log("attributeDetails", attributeDetails)
      const newDecodeEntry = prisma.devicedecodedata.create({
        data: {
          deviceId: device.id,
          devEui: data.devEui,
          attributesName: attributeName,  // e.g., 'temperature', 'humidity'
          attributesValue: value.toString(),  // Store as string
          attributesUnits: unit,  // Store the unit, e.g., '°C', '%'
        },
      });
      decodePromises.push(newDecodeEntry); // Add each promise to the array
    }
    // Wait for all promises to resolve
    const newDecodeEntries = await Promise.all(decodePromises);
    console.log("newDecodeEntries", newDecodeEntries)
    // Log success message with the new decode entries
    logger.info('Decoded data saved successfully:', newDecodeEntries);

    // Run the threshold check service asynchronously, now passing deviceId, timestamp, and decodedData
    checkThresholdService(device.id, timestamp, decodedData, customerDetails, device.name, device.deviceId)
      .then(() => logger.info(`Threshold check for device ${device.id} completed.`))
      .catch((error) => logger.error('Error running threshold check:', error));



    // Return the response before the threshold check finishes
    return { device: newDevice, decodedData: newDecodeEntries };

  } catch (error) {
    console.error(error);
    logger.error('Error creating device and decoded data:', error);
    throw error; // Rethrow the error for further handling
  }
};

function decodePDUByModel(pdu, modelNumber) {
  switch (modelNumber) {
    case "LHT65":
      return decodePDUForTemperature(pdu); // Call specific decoding function for Model X
    case "LT-22222-L":
      return decodePDUForIOContoller(pdu); // Call specific decoding function for Model Y
    case "LA66M484862":
      return decodeUltraSonicSensor(pdu);
    default:
      throw new Error(`Unsupported model number: ${modelNumber}`);
  }
}

function decodePDUForIOContoller(pdu) {
  // Step 1: Extract the second-to-last byte (FC) from the PDU
  const secondLastByteHex = pdu.slice(-6, -4); // Extract "FC"
  console.log("Extracted Hex:", secondLastByteHex); // For debugging

  // Step 2: Convert the second-to-last byte to binary
  const secondLastByteBinary = parseInt(secondLastByteHex, 16).toString(2).padStart(8, '0'); // Convert to binary with 8-bit padding
  console.log("Binary Representation:", secondLastByteBinary); // For debugging

  // Step 3: Extract the 6th and 7th bits from the end
  const relay1 = secondLastByteBinary.slice(-8, -7); // 6th bit from the end
  const relay2 = secondLastByteBinary.slice(-7, -6); // 7th bit from the end

  // Step 4: Return the decoded values along with binary representation
  const response = {
    relay1: {
      value: relay1 === '1' ? 1 : 0, // Set value based on the bit
      unit: "" // Assuming no unit is required for relay1
    },
    light_bulb: {
      value: relay2 === '1' ? 1 : 0, // Set value based on the bit
      unit: "" // Assuming no unit is required for relay2
    }
  };

  // Step 4: Return the response object
  return response;
}


function decodeUltraSonicSensor(hexDuration) {
  // Convert hex duration to decimal
  const duration = parseInt(hexDuration, 16);

  // Calculate distance using the formula
  const distance = (duration * 0.034) / 2;

  // Return data in specified format
  return {
    distance: { value: distance, unit: 'cm' }
  };
}

async function checkThresholdService(deviceId, timestamp, decodedData, customerDetails, deviceName, deviceEui) {
  try {
    console.log("helo 1 ", customerDetails, deviceName, deviceEui)
    logger.info(`Checking thresholds for device: ${deviceId} at timestamp: ${timestamp}`);

    // Fetch threshold values for this device
    const thresholds = await fetchThresholds(deviceId);//fetching the alerts thresholds values
    console.log("threshold agya hai",thresholds);
    // Check if any decoded attributes exceed the threshold limits
    const exceedingAttributes = checkThreshold(decodedData, thresholds);
    console.log("exceedingAttributes", exceedingAttributes)

    
    let alertData = '';

    // If there are exceeding attributes, send notifications
    if (exceedingAttributes.length > 0) {
      alertData = await sendNotifications(deviceId, exceedingAttributes);
      logger.info(`Notifications sent for device ${deviceId} for exceeding attributes`);
    }

    console.log("alertData", alertData); // Log alertData for debugging

    if (exceedingAttributes && exceedingAttributes.length > 0) {
      const alertDetails = exceedingAttributes.map(attr => ({
        attribute: attr.name, // Extracting the attribute name
        value: attr.value,     // Extracting the attribute value
      }));

      console.log("alertDetails", alertDetails)
      await emailService.sendAlertMail(customerDetails.firstName, customerDetails.email, alertDetails, deviceName, deviceEui);
      logger.info(`Alert email sent to ${customerDetails.email}`);
    } else {
      logger.info(`No alerts to send for device ${deviceId}`);
    }


  } catch (error) {
    logger.error(`Error in checkThresholdService for device ${deviceId}:`, error);
    throw error;
  }
}


async function checkThreshold(decodedData, alerts) {
  console.log("Decoded Data:", decodedData);
  console.log("Alerts:", alerts);

  const exceedingAttributes = [];

  // Iterate through each alert to check the corresponding decoded data attribute
  for (const alert of alerts) {
    // Get the threshold value and operator from the alert
    console.log("ALERT FOR LOOP WALA",alert);
    const thresholdValue = alert.value;
    const operator = alert.operator;
  
    console.log("loop ke baad me data call kiya hai",decodedData);
    // Identify the attribute name to check from the decoded data
    let attributeName;
    if ('distance' in decodedData) {
      attributeName = 'distance';
    } else if ('temperature' in decodedData) {
      attributeName = 'temperature';
    } else if ('temperature_c_ds' in decodedData) {
      attributeName = 'temperature_c_ds';
    } else if ('humidity' in decodedData) {
      attributeName = 'humidity';
    } else if ('battery_status' in decodedData) {
      attributeName = 'battery_status';
    } else if ('battery_voltage_mV' in decodedData) {
      attributeName = 'battery_voltage_mV';
    } else if ('status' in decodedData) {
      attributeName = 'status';
    } else if ('unix_timestamp' in decodedData) {
      attributeName = 'unix_timestamp';
    } else {
      console.warn("No matching attribute found in decodedData.");
      continue;
    }// Example: you can change this to other attribute names based on your requirements.

    // Get the current value of the attribute from decoded data
    const attributeValue = parseFloat(decodedData[attributeName]?.value); // Convert the value to float

    console.log(`Checking attribute: ${attributeName}, value: ${attributeValue}`);

    // Check if the attribute exists in decoded data and is a valid number
    if (!isNaN(attributeValue)) {
      // Check if the attribute value exceeds the alert's threshold value
      const conditionMet = checkAlertCondition(operator, attributeValue, thresholdValue);
      console.log(`Condition Met for ${attributeName}:`, conditionMet);

      if (conditionMet) {
        exceedingAttributes.push({
          name: attributeName,
          value: attributeValue,
          alertId: alert.id
        });

        // if condito is met then send the downlink
        const sendDownlink =  await SendDownlink(alert);
      }
    } else {
      console.warn(`Invalid attribute value for ${attributeName}: ${attributeValue}`);
    }
  }

  return exceedingAttributes;
}

//sendin the downlink to the IO controller

async function SendDownlink(alert){
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
        deviceId: "A84041C1E1843250",
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
      deviceId:device.id
    };

    // Call function to send the downlink
    const response = postDownlinkDevice({ body: downlinkData });
    console.log('Downlink sent successfully', response);

  } catch (error) {
    console.error(`Error sending downlink for alert ID: ${alert.id}`, error);
  }
}

// Example of a checkAlertCondition function
function checkAlertCondition(operator, attributeValue, thresholdValue) {
  switch (operator) {
    case '>=':
      return attributeValue >= thresholdValue;
    case '<=':
      return attributeValue <= thresholdValue;
    case '>':
      return attributeValue > thresholdValue;
    case '<':
      return attributeValue < thresholdValue;
    case '=':
      return attributeValue === thresholdValue;
    // Add additional cases for other operators as needed
    default:
      console.warn(`Unknown operator: ${operator}`);
      return false; // Treat unknown operators as no condition met
  }
}



async function sendNotifications(deviceId, exceedingAttributes) {
  console.log(`Sending notifications for deviceId: ${deviceId} with exceeding attributes:`, exceedingAttributes);

  const notifications = []; // Array to hold the notifications

  for (const attribute of exceedingAttributes) {
    // Create a notification in the database
    const notification = await prisma.notification.create({
      data: {
        message: `Alert triggered: ${attribute.name} value (${attribute.value}) exceeded threshold.`,
        deviceId: deviceId,
      },
    });
    const object = {
      notificationId: notification.id,
      attribute: attribute.name,
      value: attribute.value,
      alertId: attribute.alertId,
    }
    console.log("object hai bhai notification wala",object);
    notifications.push(object); // Store the created notification
  }

  return notifications; // Return the array of notifications
}


async function fetchThresholds(deviceId) {
  // Simulated alert thresholds for temperature, humidity, and pressure
  console.log("threshold me pass ki hui DEviceId",deviceId)
  const fetchedAlerts = await prisma.alerts.findMany({
    where: {
      deviceId: deviceId,
    },
  });
  console.log("check fetched alerts ayae ki nhi",fetchedAlerts);
  return fetchedAlerts;
}


async function getCustomerEmail(projectId) {
  try {
    const getcustomerId = await prisma.projects.findFirst({
      where: { id: projectId },
      select: { customerId: true },
    })

    if (!getcustomerId) {
      throw new Error("Project not found")
    }

    const customer = await prisma.customer.findFirst({
      where: { id: getcustomerId.customerId },
      select: { firstName: true, email: true },
    })

    return customer;


  } catch (error) {
    throw new Error(error.message)
  }
}

function decodePDUForTemperature(pdu) {
  // Extract fields and convert from hexadecimal to decimal
  const batteryHex = parseInt(pdu.substring(0, 4), 16);  // First 2 bytes (Battery in hex)
  const temperature = parseInt(pdu.substring(4, 8), 16) / 100;  // Next 2 bytes (temperature in Celsius)
  const humidity = parseInt(pdu.substring(8, 12), 16) / 10;  // Next 2 bytes (humidity as percentage)
  const status = parseInt(pdu.substring(12, 14), 16);  // Next 1 byte (status)
  const temperature_c_ds = parseInt(pdu.substring(14, 18), 16) / 100;  // Convert temperature to Celsius
  const unix_timestamp = parseInt(pdu.substring(18, 22), 16);  // Next 2 bytes (Unix timestamp)

  // Calculate battery voltage based on your provided formula:
  const battery_status = (batteryHex >> 14) & 0xFF;  // (Battery >> 14) & 0xFF = battery status
  const battery_voltage = batteryHex & 0x3FFF;  // Battery voltage = Battery & 0x3FFF

  // Convert battery voltage to millivolts (as 2980 mV in example)
  const battery_voltage_mV = battery_voltage;  // 2980 mV

  // Return the decoded values along with their units
  return {
    battery_status: { value: battery_status, unit: "" },  // No unit for status
    battery_voltage_mV: { value: battery_voltage_mV, unit: "mV" },  // Battery in millivolts
    temperature: { value: temperature.toFixed(2), unit: "°C" },  // Temperature in Celsius
    humidity: { value: humidity.toFixed(1), unit: "%" },  // Humidity in percentage
    status: { value: status, unit: "" },  // No unit for status
    temperature_c_ds: { value: temperature_c_ds.toFixed(2), unit: "°C" },  // Secondary temperature in Celsius
    unix_timestamp: { value: unix_timestamp, unit: "" }  // No unit for timestamp
  };
}


const getAllDevices = async () => {
  logger.info('Fetching all devices...'); // Log before fetching
  try {
    const devices = await prisma.deviceserverdata.findMany();
    logger.info('Devices fetched successfully:', devices); // Log successful fetch
    return devices;
  } catch (error) {
    logger.error('Error fetching devices:', error); // Log error
    throw error;
  }
};


const getRecentDevice = async () => {
  logger.info('Fetching the most recent device...'); // Log before fetching
  try {
    const recentDevice = await prisma.deviceserverdata.findMany({
      orderBy: {
        // Replace `updatedAt` with the actual field you want to order by
        id: 'desc', // Order by descending to get the most recent
      },
      take: 1, // Limit the results to just 1
    });

    // If you want to return the first element of the array
    return recentDevice[0] || null; // Return null if no device is found
  } catch (error) {
    logger.error('Error fetching the most recent device:', error); // Log error
    throw error;
  }
};




// const getDeviceById = async (devEui) => {
//   logger.info(`Fetching devices with EUI: ${devEui}`); // Log the EUI being fetched
//   try {
//     const devices = await prisma.deviceServerData.findMany({
//       where: { devEui: devEui }, // Fetch all devices matching the devEui
//       orderBy: { id: 'desc' },
//     });



//     const deviceTime = await prisma.device.findFirst({
//       where: {
//         deviceId: devEui
//       }
//     });

//     // Convert txtime to Indian timezone (Asia/Kolkata)
//     const formattedDevices = devices.map(device => ({
//       ...device,
//       txtime: device.txtime ? moment(device.txtime).tz(`${deviceTime.timezoneName}`).format('YYYY-MM-DD HH:mm:ss') : null
//     }));


//     if (formattedDevices.length > 0) {
//       logger.info('Devices fetched successfully:', formattedDevices); // Log successful fetch
//     } else {
//       logger.warn('No devices found with the specified EUI'); // Log if no devices found
//     }

//     return formattedDevices; // Return all matching devices with formatted txtime (or an empty array)
//   } catch (error) {
//     logger.error('Error fetching devices:', error); // Log error
//     throw error; // Rethrow the error for further handling
//   }
// };



// const getDeviceById = async (devEui, page = 1, pageSize = 10) => {
//   logger.info(`Fetching devices with EUI: ${devEui}, Page: ${page}, Page Size: ${pageSize}`);
//   try {
//     const total = await prisma.deviceServerData.count({
//       where: { devEui: devEui }
//     });

//     const pagination = await calculatePagination(total, page, pageSize);

//     const devices = await prisma.deviceServerData.findMany({
//       where: { devEui: devEui },
//       orderBy: { id: 'desc' },
//       skip: (pagination.currentPage - 1) * pagination.pageSize,
//       take: pagination.pageSize,
//     });

//     const deviceTime = await prisma.device.findFirst({
//       where: {
//         deviceId: devEui
//       }
//     });

//     const formattedDevices = devices.map(device => ({
//       ...device,
//       txtime: device.txtime ? moment(device.txtime).tz(`${deviceTime.timezoneName}`).format('YYYY-MM-DD HH:mm:ss') : null
//     }));

//     const result = {
//       devices: formattedDevices,
//       pagination
//     };

//     if (formattedDevices.length > 0) {
//       logger.info('Devices fetched successfully:', formattedDevices);
//     } else {
//       logger.warn('No devices found with the specified EUI');
//     }

//     return result;
//   } catch (error) {
//     logger.error('Error fetching devices:', error);
//     throw error;
//   }
// };

const getDeviceById = async (devEui, page = 1, pageSize = 10, date = '7days') => {
  console.log("Service - devEui parameter:", devEui); // Log the devEui parameter at the start

  logger.info(`Fetching devices with EUI: ${devEui}, Page: ${page}, Page Size: ${pageSize}`);

  try {
    const { startDate, endDate } = await filterTransactionsByDate(date); // Use the helper to get the date range
    console.log("Service - Date Range Start:", startDate.toDate(), "End:", endDate.toDate()); // Log date range

    const total = await prisma.deviceserverdata.count({
      where: {
        devEui: devEui,
        txtime: {
          gte: startDate.toDate(),
          lte: endDate.toDate()
        }
      }
    });
    console.log("Service - Total records for devEui:", total); // Log total records for pagination

    const pagination = await calculatePagination(total, page, pageSize);
    console.log("Service - Pagination details:", pagination); // Log pagination details

    const devices = await prisma.deviceserverdata.findMany({
      where: {
        devEui: devEui,
        txtime: {
          gte: startDate.toDate(),
          lte: endDate.toDate()
        }
      },
      orderBy: { id: 'desc' },
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });
    console.log("Service - Devices fetched before formatting:", devices); // Log devices fetched before formatting

    const deviceTime = await prisma.device.findFirst({
      where: { deviceId: devEui }
    });
    console.log("Service - Device timezone for formatting:", deviceTime ? deviceTime.timezoneName : "No timezone found"); // Log timezone info

    const formattedDevices = devices.map(device => ({
      ...device,
      txtime: device.txtime
        ? moment(device.txtime).tz(`${deviceTime.timezoneName}`).format('YYYY-MM-DD HH:mm:ss')
        : null
    }));
    console.log("Service - Formatted Devices:", formattedDevices); // Log formatted devices

    const result = { devices: formattedDevices, pagination };
    console.log("Service - Final Result:", result); // Log final result

    if (formattedDevices.length > 0) {
      logger.info('Devices fetched successfully:', formattedDevices);
    } else {
      logger.warn('No devices found with the specified EUI');
    }

    return result;
  } catch (error) {
    logger.error('Error fetching devices:', error);
    console.error('Service - Error fetching devices:', error); // Log error in the service
    throw error;
  }
};
// const getDeviceById = async (devEui, page = 1, pageSize = 10, date = 'today') => {
//   logger.info(`Fetching devices with EUI: ${devEui}, Page: ${page}, Page Size: ${pageSize}`);

//   try {
//     const { startDate, endDate } = await filterTransactionsByDate(date); // Use the helper to get the date range
//     console.log(startDate, endDate);
//     const total = await prisma.deviceserverdata.count({
//       where: {
//         devEui: devEui,
//         txtime: {
//           gte: startDate.toDate(),
//           lte: endDate.toDate()
//         }
//       }
//     });

//     const pagination = await calculatePagination(total, page, pageSize);

//     const devices = await prisma.deviceserverdata.findMany({
//       where: {
//         devEui: devEui,
//         txtime: {
//           gte: startDate.toDate(),
//           lte: endDate.toDate()
//         }
//       },
//       orderBy: { id: 'desc' },
//       skip: (pagination.currentPage - 1) * pagination.pageSize,
//       take: pagination.pageSize,
//     });

//     const deviceTime = await prisma.device.findFirst({
//       where: { deviceId: devEui }
//     });
//     console.log("getdeviceId historical server data",devices);
//     const formattedDevices = devices.map(device => ({
//       ...device,
//       txtime: device.txtime
//         ? moment(device.txtime).tz(`${deviceTime.timezoneName}`).format('YYYY-MM-DD HH:mm:ss')
//         : null
//     }));

//     const result = { devices: formattedDevices, pagination };

//     if (formattedDevices.length > 0) {
//       logger.info('Devices fetched successfully:', formattedDevices);
//     } else {
//       logger.warn('No devices found with the specified EUI');
//     }
//     console.log("result: ", result);
//     return result;
//   } catch (error) {
//     logger.error('Error fetching devices:', error);
//     throw error;
//   }
// };


const updateDevice = async (id, data) => {
  logger.info(`Updating device with ID: ${id} with data:`, data); // Log the ID and data being updated
  try {
    const updatedDevice = await prisma.deviceserverdata.update({
      where: { id: Number(id) },
      data
    });
    logger.info('Device updated successfully:', updatedDevice); // Log successful update
    return updatedDevice;
  } catch (error) {
    logger.error('Error updating device:', error); // Log error
    throw error;
  }
};

const deleteDevice = async (id) => {
  logger.info(`Deleting device with ID: ${id}`); // Log the ID being deleted
  try {
    const deletedDevice = await prisma.deviceserverdata.delete({
      where: { id: Number(id) }
    });
    logger.info('Device deleted successfully:', deletedDevice); // Log successful deletion
    return deletedDevice;
  } catch (error) {
    logger.error('Error deleting device:', error); // Log error
    throw error;
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getRecentDevice
};