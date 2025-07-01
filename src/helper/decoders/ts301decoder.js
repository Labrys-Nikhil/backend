
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

// function Decoder(bytes, port) {
//     return milesight(bytes);
// }

function ts301Milesight(pdu) {
    const bytes = pduToBytes(pdu)
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = {value:bytes[i], unit:"%"};
            i += 1;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x67) {
            decoded.temperature_chn1 = {value:readInt16LE(bytes.slice(i, i + 2)) / 10, unit:"°C"};
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 1 SENSOR)
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.magnet_chn1 = {value:bytes[i] === 0 ? "closed" : "opened", unit:""};
            i += 1;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x67) {
            decoded.temperature_chn2 = {value:readInt16LE(bytes.slice(i, i + 2)) / 10, unit:"°C"};
            i += 2;
        }
        // MAGNET STATUS(CHANNEL 2 SENSOR)
        else if (channel_id === 0x04 && channel_type === 0x00) {
            decoded.magnet_chn2 = {value:bytes[i] === 0 ? "closed" : "opened", unit:""};
            i += 1;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x83 && channel_type === 0x67) {
            decoded.temperature_chn1 = {value:readInt16LE(bytes.slice(i, i + 2)) / 10, unit:"°C"};
            decoded.temperature_chn1_alarm = {value:readAlarmType(bytes[i + 2]), unit:"°C"};
            i += 3;
        }
        // TEMPERATURE(CHANNEL 1 SENSOR) ALARM
        else if (channel_id === 0x93 && channel_type === 0xd7) {
            decoded.temperature_chn1 = {value:readInt16LE(bytes.slice(i, i + 2)) / 10, unit:"°C"};
            decoded.temperature_chn1_change = {value:readInt16LE(bytes.slice(i + 2, i + 4)) / 100, unit:"°C"};
            decoded.temperature_chn1_alarm = {value:readAlarmType(bytes[i + 4]), unit:"°C"};
            i += 5;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x84 && channel_type === 0x67) {
            decoded.temperature_chn2 = {value:readInt16LE(bytes.slice(i, i + 2)) / 10, unit:"°C"};
            decoded.temperature_chn2_alarm = {value:readAlarmType(bytes[i + 2]), unit:"°C"};
            i += 3;
        }
        // TEMPERATURE(CHANNEL 2 SENSOR) ALARM
        else if (channel_id === 0x94 && channel_type === 0xd7) {
            decoded.temperature_chn2 = {value:readInt16LE(bytes.slice(i, i + 2)) / 10, unit:"°C"};
            decoded.temperature_chn2_change = {value:readInt16LE(bytes.slice(i + 2, i + 4)) / 100, unit:"°C"};
            decoded.temperature_chn2_alarm = {value:readAlarmType(bytes[i + 4]), unit:"°C"};
            i += 5;
        }
        // HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var mask = bytes[i + 4];
            i += 5;

            var data = {};
            data.timestamp = timestamp;
            var chn1_mask = mask >>> 4;
            var chn2_mask = mask & 0x0f;
            switch (chn1_mask) {
                case 0x01:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = "threshold";
                    break;
                case 0x02:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = "threshold release";
                    break;
                case 0x03:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn1_alarm = "mutation";
                    break;
                case 0x04:
                    data.temperature_chn1 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    break;
                case 0x05:
                    data.magnet_chn1 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    data.magnet_chn1_alarm = "threshold";
                    break;
                case 0x06:
                    data.magnet_chn1 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    break;
                default:
                    break;
            }
            i += 2;

            switch (chn2_mask) {
                case 0x01:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = "threshold";
                    break;
                case 0x02:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = "threshold release";
                    break;
                case 0x03:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    data.temperature_chn2_alarm = "mutation";
                    break;
                case 0x04:
                    data.temperature_chn2 = readInt16LE(bytes.slice(i, i + 2)) / 10;
                    break;
                case 0x05:
                    data.magnet_chn2 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    data.magnet_chn2_alarm = "threshold";
                    break;
                case 0x06:
                    data.magnet_chn2 = readInt16LE(bytes.slice(i, i + 2)) === 0 ? "closed" : "opened";
                    break;
                default:
                    break;
            }
            i += 2;

            decoded.history = decoded.history || [];
            decoded.history.push(data);
        } else {
            break;
        }
    }
    // Test for LoRa properties in normalizedPayload
//   try {
//     decoded.lora_rssi =
//       (!!normalizedPayload.gateways &&
//         Array.isArray(normalizedPayload.gateways) &&
//         normalizedPayload.gateways[0].rssi) ||
//       0;
//     decoded.lora_snr =
//       (!!normalizedPayload.gateways &&
//         Array.isArray(normalizedPayload.gateways) &&
//         normalizedPayload.gateways[0].snr) ||
//       0;
//     decoded.lora_datarate = normalizedPayload.data_rate || 'not retrievable';
//   } catch (error) {
//     console.log('Error occurred while decoding LoRa properties: ' + error);
//   }

    return decoded;
}

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
    return (value & 0xffffffff) >>> 0;
}

function readAlarmType(type) {
    switch (type) {
        case 0:
            return "threshold release";
        case 1:
            return "threshold";
        case 2:
            return "mutation";
        default:
            return "unkown";
    }
}

const p1 = "017564030001"
console.log(ts301Milesight(p1))

module.exports={ts301Milesight} 