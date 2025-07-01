function milesightDeviceDecodeEM300_DI(pdu) {
    const decoded = {};
    const bytes = hexStringToBytes(pdu);
    
    for (let i = 0; i < bytes.length;) {
        const channel_id = bytes[i++];
        const channel_type = bytes[i++];

        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = { value: bytes[i], unit: '%' };
            i += 1;
        } else if (channel_id === 0x03 && channel_type === 0x67) {
            const temp = readInt16LE(bytes.slice(i, i + 2)) / 10;
            decoded.temperature = { value: temp, unit: '°C' };
            i += 2;
        } else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = { value: bytes[i] / 2, unit: '%' };
            i += 1;
        } else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.gpio = { value: readGPIOStatus(bytes[i]), unit: '' };
            i += 1;
        } else if (channel_id === 0x05 && channel_type === 0xc8) {
            decoded.pulse = { value: readUInt32LE(bytes.slice(i, i + 4)), unit: '' };
            i += 4;
        } else if (channel_id === 0x05 && channel_type === 0xe1) {
            decoded.water_conv = { value: readUInt16LE(bytes.slice(i, i + 2)) / 10, unit: '' };
            decoded.pulse_conv = { value: readUInt16LE(bytes.slice(i + 2, i + 4)) / 10, unit: '' };
            decoded.water = { value: readFloatLE(bytes.slice(i + 4, i + 8)), unit: 'L' };
            i += 8;
        } else if (channel_id === 0x85 && channel_type === 0x00) {
            decoded.gpio = { value: readGPIOStatus(bytes[i]), unit: '' };
            decoded.gpio_alarm = { value: readGPIOAlarm(bytes[i + 1]), unit: '' };
            i += 2;
        } else if (channel_id === 0x85 && channel_type === 0xe1) {
            decoded.water_conv = { value: readUInt16LE(bytes.slice(i, i + 2)) / 10, unit: '' };
            decoded.pulse_conv = { value: readUInt16LE(bytes.slice(i + 2, i + 4)) / 10, unit: '' };
            decoded.water = { value: readFloatLE(bytes.slice(i + 4, i + 8)), unit: 'L' };
            decoded.water_alarm = { value: readWaterAlarm(bytes[i + 8]), unit: '' };
            i += 9;
        } else if (channel_id === 0x20 && channel_type === 0xce) {
            if (bytes.slice(i).length < 12) break;
            const point = {};
            point.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            point.temperature = { value: readInt16LE(bytes.slice(i + 4, i + 6)) / 10, unit: '°C' };
            point.humidity = { value: bytes[i + 6] / 2, unit: '%' };
            const mode = bytes[i + 7];
            if (mode === 1) {
                point.gpio_type = 'gpio';
                point.gpio = { value: bytes[i + 8], unit: '' };
            } else if (mode === 2) {
                point.gpio_type = 'pulse';
                point.pulse = { value: readUInt32LE(bytes.slice(i + 9, i + 13)), unit: '' };
            }
            decoded.history = decoded.history || [];
            decoded.history.push(point);
            i += 13;
        } else if (channel_id === 0x21 && channel_type === 0xce) {
            const point = {};
            point.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            point.temperature = { value: readInt16LE(bytes.slice(i + 4, i + 6)) / 10, unit: '°C' };
            point.humidity = { value: bytes[i + 6] / 2, unit: '%' };
            point.alarm = { value: readAlarm(bytes[i + 7]), unit: '' };
            const mode = bytes[i + 8];
            if (mode === 1) {
                point.gpio_type = 'gpio';
                point.gpio = { value: readGPIOStatus(bytes[i + 9]), unit: '' };
            } else if (mode === 2) {
                point.gpio_type = 'pulse';
                point.water_conv = { value: readUInt16LE(bytes.slice(i + 10, i + 12)) / 10, unit: '' };
                point.pulse_conv = { value: readUInt16LE(bytes.slice(i + 12, i + 14)) / 10, unit: '' };
                point.water = { value: readFloatLE(bytes.slice(i + 14, i + 18)), unit: 'L' };
            }
            decoded.history = decoded.history || [];
            decoded.history.push(point);
            i += 18;
        } else {
            break;
        }
    }
    console.log(decoded);
    return decoded;
}

// Util functions
function readUInt16LE(bytes) {
    return (bytes[1] << 8) + bytes[0];
}

function readInt16LE(bytes) {
    const val = readUInt16LE(bytes);
    return val > 0x7FFF ? val - 0x10000 : val;
}

function readUInt32LE(bytes) {
    return ((bytes[3] << 24) >>> 0) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
}

function readFloatLE(bytes) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    bytes.forEach((b, i) => view.setUint8(i, b));
    return view.getFloat32(0, true);
}

function readGPIOStatus(byte) {
    return byte; // Update with real logic if needed
}

function readGPIOAlarm(byte) {
    return byte; // Update with real logic if needed
}

function readWaterAlarm(byte) {
    return byte; // Update with real logic if needed
}

function readAlarm(byte) {
    return byte; // Update with real logic if needed
}

//convert hex string to the bytes array
function hexStringToBytes(hex) {
    if (!hex || typeof hex !== 'string') return [];
    hex = hex.replace(/\s+/g, '').replace(/^0x/, '');
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    console.log("bytes",bytes);
    return bytes;
}


module.exports = {milesightDeviceDecodeEM300_DI}
