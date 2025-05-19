function readSignedInt32(bytes, index) {
  return (
    (bytes[index] << 24) |
    (bytes[index + 1] << 16) |
    (bytes[index + 2] << 8) |
    bytes[index + 3]
  ) << 0; // Convert to signed 32-bit
}


const convertToBytes = (data) => {
  if (typeof data === "string") {
    return new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }
  if (Array.isArray(data)) {
    return new Uint8Array(data);
  }
  throw new Error("Invalid data format. Expected a hex string or byte array.");
};

const decodeEM400TLD = (data) => {
  const bytes = convertToBytes(data);
  const decoded = {};
  let index = 0;

  while (index < bytes.length) {
    const channelId = bytes[index++];
    const type = bytes[index++];

    switch (channelId) {
      case 0x01: // Battery
        if (type === 0x75) {
          decoded.battery = {
            value: bytes[index],
            unit: '%',
          };
          index += 1;
        }
        break;

      case 0x03: // Temperature
        if (type === 0x67) {
          const rawTemp = (bytes[index + 1] << 8) | bytes[index];
          const signedTemp = rawTemp > 0x7FFF ? rawTemp - 0x10000 : rawTemp;
          decoded.temperature = {
            value: signedTemp / 10,
            unit: '°C',
          };
          index += 2;
        }
        break;

      case 0x04: // Distance (mm)
        if (type === 0x82) {
          const rawDistance = (bytes[index + 1] << 8) | bytes[index];
          decoded.distance = {
            value: rawDistance,
            unit: 'mm',
          };
          index += 2;
        }
        break;

      case 0x05: // Position
        if (type === 0x00) {
          decoded.position = {
            value: bytes[index++] === 0 ? "normal" : "tilt",
            unit: 'state',
          };
        }
        break;

        case 0x06: // Location
  if (type === 0x88) {
    const latRaw = readSignedInt32(bytes, index);
    const lonRaw = readSignedInt32(bytes, index + 4);

    const motionBits = (bytes[index + 8] >> 4) & 0x0F;
    const geofenceBits = bytes[index + 8] & 0x0F;

    const motionStates = [ "start moving", "moving", "stop moving"];
    const geofenceStates = ["inside", "outside", "unset"];

    decoded.latitude = parseFloat((latRaw / 1000000).toFixed(6));
    decoded.longitude = parseFloat((lonRaw / 1000000).toFixed(6));
    decoded.motion_status = motionStates[motionBits];
    decoded.geofence_status = geofenceStates[geofenceBits];

    index += 9;
  }
  break;

      case 0x83: // Temperature Abnormal
        if (type === 0x67) {
          const rawTemp = (bytes[index + 1] << 8) | bytes[index];
          const signedTemp = rawTemp > 0x7FFF ? rawTemp - 0x10000 : rawTemp;
          decoded.temperature = {
            value: signedTemp / 10,
            unit: '°C',
          };
          decoded.temperature_abnormal = bytes[index + 2] === 1;
          index += 3;
        }
        break;
//em400TldDecoder.js ->
case 0x84: // Distance Alarm
        if (type === 0x82) {
          const rawDistance = (bytes[index + 1] << 8) | bytes[index];
          decoded.distance = {
            value: rawDistance,
            unit: 'mm',
          };
          decoded.distance_alarming = bytes[index + 2] === 1;
          index += 3;
        }
        break;

      default: 
        // Unknown channel, skip
        console.warn(`Unknown channelId 0x${channelId.toString(16)} at index ${index - 2}`);
        return null;
    }
  }
console.log("decoded data of the given pdu in decoder",decoded)
  return decoded;
};

module.exports = { decodeEM400TLD };

