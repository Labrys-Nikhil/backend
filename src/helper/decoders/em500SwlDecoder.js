//  function decodeEM500SWL(payloadHex) {
//   console.log(`Raw Payload Hex: ${payloadHex}`);

//   let buffer = Buffer.from(payloadHex, "hex");
//   let decodedData = {};
//   let index = 0;

//   while (index < buffer.length) {
//     let channelId = buffer[index++];
//     let type = buffer[index++];

//     // console.log(`Processing Channel ID: 0x${channelId.toString(16)}, Type: 0x${type.toString(16)}`);

//     switch (channelId) {
//       case 0x01: // Battery Level
//         if (type === 0x75) {
//           decodedData.battery = `${buffer[index++]} %`; // Battery as percentage
//           // console.log(`Decoded Battery: ${decodedData.battery}`);
//         }
//         break;

//       case 0x03: // Water Level
//         if (type === 0x77) {
//           let waterLevel = (buffer[index] << 8) + buffer[index + 1]; // Combine 2 bytes for water level
//           decodedData.water_level = `${waterLevel} cm`; // Water level in cm
//           // console.log(`Decoded Water Level: ${decodedData.water_level}`);
//           index += 2; // Move index forward by 2 bytes
//         }
//         break;

//       case 0x20: // Historical Data
//         if (type === 0xce) {
//           let timestamp =
//             (buffer[index] << 24) |
//             (buffer[index + 1] << 16) |
//             (buffer[index + 2] << 8) |
//             buffer[index + 3];
//           let historicalWaterLevel =
//             (buffer[index + 4] << 8) | buffer[index + 5];

//           decodedData.timestamp = new Date(timestamp * 1000).toISOString(); // Convert Unix timestamp to readable format
//           decodedData.water_level = `${historicalWaterLevel} cm`; // Water level in cm

//           // console.log(`Decoded Historical Data: Timestamp=${decodedData.timestamp}, Water Level=${decodedData.water_level}`);
//           index += 6; // Move index forward by 6 bytes for historical data
//         }
//         break;

//       default:
//         // console.log(` Unknown Channel ID: 0x${channelId.toString(16)}`);
//         return null;
//     }
//   }

//   console.log(" Final Decoded Data:", decodedData);
//   return decodedData;
// }

// module.exports = { decodeEM500SWL };
const convertToBytes = (data) => {
  if (typeof data === "string") {
    return new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }
  if (Array.isArray(data)) {
    return new Uint8Array(data);
  }
  throw new Error("Invalid data format. Expected a hex string or byte array.");
};


function decodeEM500SWL(hexPdu) {
  const bytes = convertToBytes(hexPdu);
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery ={
              value:bytes[i],
              unit:"%",
            } 
            i += 1;
        }
        // WATER LEVEL
        else if (channel_id === 0x03 && channel_type === 0x77) {
            decoded.water_level ={
              value:  readUInt16LE(bytes.slice(i, i + 2)),
              unit:"cm"
            } 
            i += 2;
        }
        // HISTROY DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var point = {};
            point.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            point.water_level = readUInt16LE(bytes.slice(i + 4, i + 6));

            decoded.history = decoded.history || [];
            decoded.history.push(point);
            i += 6;
        } else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffffff;
}

module.exports = { decodeEM500SWL };