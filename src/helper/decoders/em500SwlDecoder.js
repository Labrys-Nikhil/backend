 function decodeEM500SWL(payloadHex) {
  console.log(`Raw Payload Hex: ${payloadHex}`);

  let buffer = Buffer.from(payloadHex, "hex");
  let decodedData = {};
  let index = 0;

  while (index < buffer.length) {
    let channelId = buffer[index++];
    let type = buffer[index++];

    // console.log(`Processing Channel ID: 0x${channelId.toString(16)}, Type: 0x${type.toString(16)}`);

    switch (channelId) {
      case 0x01: // Battery Level
        if (type === 0x75) {
          decodedData.battery =  {
            value: `${buffer[index++]}`,
            unit: "%"
        }; ; // Battery as percentage
          // console.log(`Decoded Battery: ${decodedData.battery}`);
        }
        break;

      case 0x03: // Water Level
        if (type === 0x77) {
          let waterLevel = (buffer[index] << 8) + buffer[index + 1]; // Combine 2 bytes for water level
          decodedData.water_level = {
            value: `${waterLevel} `,
            unit: "cm"
        };  // Water level in cm
          // console.log(`Decoded Water Level: ${decodedData.water_level}`);
          index += 2; // Move index forward by 2 bytes
        }
        break;

      case 0x20: // Historical Data
        if (type === 0xce) {
          let timestamp =
            (buffer[index] << 24) |
            (buffer[index + 1] << 16) |
            (buffer[index + 2] << 8) |
            buffer[index + 3];
          let historicalWaterLevel =
            (buffer[index + 4] << 8) | buffer[index + 5];

          decodedData.timestamp = new Date(timestamp * 1000).toISOString(); // Convert Unix timestamp to readable format
          decodedData.water_level = {
            value: `${historicalWaterLevel}`,
            unit: "cm"
        };  // Water level in cm

          // console.log(`Decoded Historical Data: Timestamp=${decodedData.timestamp}, Water Level=${decodedData.water_level}`);
          index += 6; // Move index forward by 6 bytes for historical data
        }
        break;

      default:
        // console.log(` Unknown Channel ID: 0x${channelId.toString(16)}`);
        return null;
    }
  }

  console.log(" Final Decoded Data:", decodedData);
  return decodedData;
}

module.exports = { decodeEM500SWL };

