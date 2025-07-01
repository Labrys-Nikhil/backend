// const pduToByteArrayToWaterQuality = (pdu) => {
//     // Initialize an empty array to hold the byte values
//     let byteArray = [];


//     if (typeof pdu === 'string') {

//         byteArray = pdu.split(' ').map(hex => parseInt(hex, 16));
//     } else if (Array.isArray(pdu)) {

//         byteArray = pdu;
//     } else {
//         throw new Error("Unsupported PDU format");
//     }
//     const data = DecoderWaterQuality(byteArray,0x02);

//     return data;
// }
// const DecoderWaterQuality = (bytes, port) => {
//     var data = {};
//     var decode = {};

//     if (port === 0x02) {
//         // Decode Battery Voltage
//         decode.BatV = ((bytes[0] << 8 | bytes[1]) & 0x3fff) / 1000; // Battery in Volts

//         var value = bytes[2] << 8 | bytes[3];
//         if (bytes[2] & 0x80) {
//             value |= 0xffff0000;
//         }
//         decode.temp_DS18B20 = (value / 10).toFixed(2); // Temperature in Celsius
//         decode.i_flag = (bytes[4] >> 7) & 0x01;

//         var sensor_type = (bytes[4]) & 0x3f; // Extract sensor type from bytes[4]
//         var j = 5;

//         // Check and decode Turbidity
//         if (((sensor_type >> 5) & 0x01) === 1) {
//             decode.turbidity = (bytes[j] << 8 | bytes[j + 1]) / 10;
//             j += 2;
//         } else {
//             decode.turbidity = null;  // Pass null if not available
//         }

//         // Check and decode Dissolved Oxygen
//         if (((sensor_type >> 4) & 0x01) === 1) {
//             decode.dissolved_oxygen = (bytes[j] << 8 | bytes[j + 1]) / 100;
//             j += 2;
//         } else {
//             decode.dissolved_oxygen = null;  // Pass null if not available
//         }

//         // Check and decode ORP
//         if (((sensor_type >> 3) & 0x01) === 1) {
//             decode.ORP = (bytes[j] << 24 >> 16 | bytes[j + 1]);
//             j += 2;
//         } else {
//             decode.ORP = null;  // Pass null if not available
//         }

//         // Check and decode EC_K10
//         if (((sensor_type >> 2) & 0x01) === 1) {
//             decode.EC_K10 = (bytes[j] << 8 | bytes[j + 1]) * 10;
//             j += 2;
//         } else {
//             decode.EC_K10 = null;  // Pass null if not available
//         }

//         // Check and decode EC_K1
//         if (((sensor_type >> 1) & 0x01) === 1) {
//             decode.EC_K1 = bytes[j] << 8 | bytes[j + 1];
//             j += 2;
//         } else {
//             decode.EC_K1 = null;  // Pass null if not available
//         }

//         // Check and decode pH
//         if ((sensor_type & 0x01) === 1) {
//             decode.PH = (bytes[j] << 8 | bytes[j + 1]) / 100;
//             j += 2;
//         } else {
//             decode.PH = null;  // Pass null if not available
//         }

//         return decode;
//     } else if (port === 3) {
//         var pnack = ((bytes[6] >> 7) & 0x01) ? "True" : "False";
//         var data_sum = '';

//         for (var i = 0; i < bytes.length; i += 11) {
//             var data = datalog(i, bytes);
//             if (i === 0) {
//                 data_sum = data;
//             } else {
//                 data_sum += data;
//             }
//         }

//         return {
//             DATALOG: data_sum,
//             PNACKMD: pnack,
//         };
//     } else if (port === 0x05) {
//         var sub_band;
//         var freq_band;
//         var sensor;

//         if (bytes[0] === 0x3c) sensor = "WQS01-LB";
//         if (bytes[4] === 0xff) sub_band = "NULL";
//         else sub_band = bytes[4];

//         var freq_map = {
//             0x01: "EU868",
//             0x02: "US915",
//             0x03: "IN865",
//             0x04: "AU915",
//             0x05: "KZ865",
//             0x06: "RU864",
//             0x07: "AS923",
//             0x08: "AS923_1",
//             0x09: "AS923_2",
//             0x0a: "AS923_3",
//             0x0b: "CN470",
//             0x0c: "EU433",
//             0x0d: "KR920",
//             0x0e: "MA869",
//         };

//         freq_band = freq_map[bytes[3]] || "Unknown";

//         var firm_ver = (bytes[1] & 0x0f) + "." + ((bytes[2] >> 4) & 0x0f) + "." + (bytes[2] & 0x0f);
//         var bat = (bytes[5] << 8 | bytes[6]) / 1000;

//         return {
//             SENSOR_MODEL: sensor,
//             FIRMWARE_VERSION: firm_ver,
//             FREQUENCY_BAND: freq_band,
//             SUB_BAND: sub_band,
//             BAT: bat,
//         };
//     }
// }

// module.exports = { pduToByteArrayToWaterQuality }




//  function pduToBytes(pduString) {
//   if (!/^[0-9a-fA-F]+$/.test(pduString)) {
//     throw new Error("Invalid PDU string. Must be hexadecimal only.");
//   }

//   if (pduString.length % 2 !== 0) {
//     throw new Error("Invalid PDU string. Length must be even.");
//   }

//   const bytes = [];
//   for (let i = 0; i < pduString.length; i += 2) {
//     bytes.push(parseInt(pduString.substr(i, 2), 16));
//   }
//   return bytes;
// }


// const pduToByteArrayToWaterQuality = (pdu) => {
//     // Initialize an empty array to hold the byte values
//     let byteArray = [];


//     if (typeof pdu === 'string') {

//         byteArray = pdu.split(' ').map(hex => parseInt(hex, 16));
//     } else if (Array.isArray(pdu)) {

//         byteArray = pdu;
//     } else {
//         throw new Error("Unsupported PDU format");
//     }
//     const data = DecoderWaterQuality(byteArray,0x02);

//     return data;
// }

function pduToBytes(pduString) {
  if (!/^[0-9a-fA-F]+$/.test(pduString)) {
    throw new Error("Invalid PDU string. Must be hexadecimal only.");
  }

  if (pduString.length % 2 !== 0) {
    throw new Error("Invalid PDU string. Length must be even.");
  }

  const bytes = [];
  for (let i = 0; i < pduString.length; i += 2) {
    bytes.push(parseInt(pduString.substr(i, 2), 16));
  }
  return bytes;
}

const pduToByteArrayToWaterQuality = (pdu) => {
  let byteArray = [];

  if (typeof pdu === 'string') {
    // Handle both space-separated and compact hex strings
    if (pdu.includes(' ')) {
      byteArray = pdu.trim().split(' ').map(hex => parseInt(hex, 16));
    } else {
      byteArray = pduToBytes(pdu);
    }
  } else if (Array.isArray(pdu)) {
    byteArray = pdu;
  } else {
    throw new Error("Unsupported PDU format");
  }

  return DecoderWaterQuality(byteArray, 0x02);
}

const DecoderWaterQuality = (bytes, port) => {
    var data = {};
    var decode = {};

    if (port === 0x02) {
        // Decode Battery Voltage
        decode.Battery = {value:((bytes[0] << 8 | bytes[1]) & 0x3fff) / 1000, unit:"%"}; // Battery in Volts

        var value = bytes[2] << 8 | bytes[3];
        if (bytes[2] & 0x80) {
            value |= 0xffff0000;
        }

        // Decode Temperature Data
        decode.temperature = {value:(value / 10).toFixed(2), unit:"°C"}; // Temperature in Celsius
        decode.i_flag = {value:(bytes[4] >> 7) & 0x01, unit:""};

        var sensor_type = (bytes[4]) & 0x3f; // Extract sensor type from bytes[4]
        var j = 5;

        // Check and decode Turbidity
        if (((sensor_type >> 5) & 0x01) === 1) {
            decode.turbidity = {value:(bytes[j] << 8 | bytes[j + 1]) / 10, unit:"ntu"};
            j += 2;
        } 
        else {
            decode.turbidity = null;  // Pass null if not available
        }

        // Check and decode Dissolved Oxygen
        if (((sensor_type >> 4) & 0x01) === 1) {
            decode.dissolved_oxygen = {value:(bytes[j] << 8 | bytes[j + 1]) / 100, unit:"mg/L"};
            j += 2;
        } else {
            decode.dissolved_oxygen = null;  // Pass null if not available
        }

        // Check and decode ORP
        if (((sensor_type >> 3) & 0x01) === 1) {
            decode.ORP = {value:(bytes[j] << 24 >> 16 | bytes[j + 1]), unit:""};
            j += 2;
        } else {
            decode.ORP = null;  // Pass null if not available
        }

        // Check and decode EC_K10
        if (((sensor_type >> 2) & 0x01) === 1) {
            decode.EC_K10 = {value:(bytes[j] << 8 | bytes[j + 1]) * 10, unit:""};
            j += 2;
        } else {
            decode.EC_K10 = null;  // Pass null if not available
        }

        // Check and decode EC_K1
        if (((sensor_type >> 1) & 0x01) === 1) {
            decode.EC_K1 = {value:bytes[j] << 8 | bytes[j + 1], unit:""};
            j += 2;
        } else {
            decode.EC_K1 = null;  // Pass null if not available
        }

        // Check and decode pH
        if ((sensor_type & 0x01) === 1) {
            decode.PH = {value:(bytes[j] << 8 | bytes[j + 1]) / 100,unit:""};
            j += 2;
        } else {
            decode.PH = null;  // Pass null if not available
        }

        return decode;
    } else if (port === 3) {
        var pnack = ((bytes[6] >> 7) & 0x01) ? "True" : "False";
        var data_sum = '';

        for (var i = 0; i < bytes.length; i += 11) {
            var data = datalog(i, bytes);
            if (i === 0) {
                data_sum = data;
            } else {
                data_sum += data;
            }
        }

        return {
            DATALOG: data_sum,
            PNACKMD: pnack,
        };
    } else if (port === 0x05) {
        var sub_band;
        var freq_band;
        var sensor;

        if (bytes[0] === 0x3c) sensor = "WQS01-LB";
        if (bytes[4] === 0xff) sub_band = "NULL";
        else sub_band = bytes[4];

        var freq_map = {
            0x01: "EU868",
            0x02: "US915",
            0x03: "IN865",
            0x04: "AU915",
            0x05: "KZ865",
            0x06: "RU864",
            0x07: "AS923",
            0x08: "AS923_1",
            0x09: "AS923_2",
            0x0a: "AS923_3",
            0x0b: "CN470",
            0x0c: "EU433",
            0x0d: "KR920",
            0x0e: "MA869",
        };

        freq_band = freq_map[bytes[3]] || "Unknown";

        var firm_ver = (bytes[1] & 0x0f) + "." + ((bytes[2] >> 4) & 0x0f) + "." + (bytes[2] & 0x0f);
        var bat = (bytes[5] << 8 | bytes[6]) / 1000;

        return {
            SENSOR_MODEL: sensor,
            FIRMWARE_VERSION: firm_ver,
            FREQUENCY_BAND: freq_band,
            SUB_BAND: sub_band,
            BAT: bat, 
        };
    }
}

// // const p1 = "3C010001000DC80d8c0ccc2827100015";
// const p1 = "0dec0ccc08000b"


// // const p1 = "03010004c80000000005010006c800000000070100080100"
// console.log(pduToByteArrayToWaterQuality(p1));


module.exports = { pduToByteArrayToWaterQuality }

