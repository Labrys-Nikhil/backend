// // This happens in your SmartLynk backend when uplink is received

// const axios = require('axios');

// // async function emitToMeteringIfApplicable(uplinkData) {
// //   const { meter_serial_number } = uplinkData;

// //   // 1. Find the device
// //   const device = await getDeviceBySerial(meter_serial_number);
// //   if (!device || device.deviceType !== 'metering') return;

// //   // 2. Get webhook token for the org

// //   if (!token) {
// //     return;
// //   } else {
// //     // 3. Emit to metering
// //     try {
// //       console.log(process.env.METERING_WEBHOOK_URL);
// //       await axios.post(process.env.METERING_WEBHOOK_URL, uplinkData, {
// //         headers: {
// //           Authorization: `Bearer ${webhookToken}`
// //         }
// //       });
// //       // 4. Log success

// //       console.log('Data sent to Metering');
// //       return {
// //         status: 'success',
// //         message: 'Data sent to Metering successfully'
// //       }
// //     } catch (err) {
// //       console.error('Failed to send to Metering:', err.message);
// //     }
// //   }

// // }

// async function emitToMeteringIfApplicable(data) {
//   const webhookUrl = process.env.METERING_WEBHOOK_URL;
//   if (!webhookUrl) {
//     console.error('METERING_WEBHOOK_URL is not set in environment variables');
//     return { status: 'error', message: 'Webhook URL not configured' };
//   }

//   try {
//     const response = await axios.post(webhookUrl, data);
//     console.log('Data sent to Metering successfully:', response.data);
//     return { status: 'success', message: 'Data sent to Metering successfully' };
//   } catch (error) {
//     console.error('Failed to send data to Metering:', error.message);
//     return { status: 'error', message: error.message };
//   }
// }

// module.exports = { emitToMeteringIfApplicable };
// src/helpers/emitToMetering.js (or wherever this code resides)

const axios = require('axios');
const logger = require('../utils/logger'); 

async function emitToMeteringIfApplicable(data) {
  const webhookUrl = process.env.METERING_WEBHOOK_URL;

  if (!webhookUrl) {
    logger.error('❌ METERING_WEBHOOK_URL is not set in environment variables');
    return { status: 'error', message: 'Webhook URL not configured' };
  }

  logger.info(`🚀 Sending data to Metering webhook at: ${webhookUrl}`);
  logger.info(`📦 Payload: ${JSON.stringify(data)}`);

  try {
    const response = await axios.post(webhookUrl, data, {
      headers: {
        'Content-Type': 'application/json'
        // Authorization: `Bearer ${webhookToken}` // if needed
      }
    });

    logger.info(`✅ Successfully sent data to Metering: ${JSON.stringify(response.data)}`);
    return {
      status: 'success',
      message: 'Data sent to Metering successfully'
    };
  } catch (error) {
    logger.error(`❌ Failed to send data to Metering: ${error.message}`);
    return {
      status: 'error',
      message: error.message
    };
  }
}

module.exports = { emitToMeteringIfApplicable };

