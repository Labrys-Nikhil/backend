var RAW_VALUE = 0x00;

var relay_in_chns = [0x03, 0x04, 0x05, 0x06];
var relay_out_chns = [0x07, 0x08];
var pt100_chns = [0x09, 0x0a];
var ai_chns = [0x0b, 0x0c];
var av_chns = [0x0d, 0x0e];


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
function milesightDeviceDecodeUC300(pdu) {
    const bytes = pduToBytes(pdu);
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // IPSO VERSION
        if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version ={
                value: readProtocolVersion(bytes[i]),
                unit: "",
            } 
            i += 1;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x09) {
            decoded.hardware_version ={
                value: readHardwareVersion(bytes.slice(i, i + 2)),
                unit: "",
            }  
            i += 2;
        }
        // FIRMWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x0a) {
            decoded.firmware_version = {
                value: readFirmwareVersion(bytes.slice(i, i + 2)),
                unit: "",
            } 
            i += 2;
        }
        // TSL VERSION
        else if (channel_id === 0xff && channel_type === 0xff) {
            decoded.tsl_version = {
                value: readTslVersion(bytes.slice(i, i + 2)),
                unit: "",
            } 
            i += 2;
        }
        // SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn ={
                value: readSerialNumber(bytes.slice(i, i + 8)),
                unit: "",
            }  
            i += 8;
        }
        // LORAWAN CLASS TYPE
        else if (channel_id === 0xff && channel_type === 0x0f) {
            decoded.lorawan_class ={
                value:  readLoRaWANClass(bytes[i]),
                unit: "",
            } 
            i += 1;
        }
        // RESET EVENT
        else if (channel_id === 0xff && channel_type === 0xfe) {
            decoded.reset_event ={
                value: readResetEvent(1),
                unit: "",
            }  
            i += 1;
        }
        // DEVICE STATUS
        else if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.device_status ={
                value:  readOnOffStatus(1),
                unit: "",
            } 
            i += 1;
        }
        // relay INPUT
        else if (includes(relay_in_chns, channel_id) && channel_type === 0x00) {
            var id = channel_id - relay_in_chns[0] + 1;
            var relay_in_name = "Digital_in_" + id;
            decoded[relay_in_name] ={
                value:  readOnOffStatus(bytes[i]),
                unit: "",
            } 
            i += 1;
        }
        // relay OUTPUT
        else if (includes(relay_out_chns, channel_id) && channel_type === 0x01) {
            var id = channel_id - relay_out_chns[0] + 1;
            var relay_out_name = "relay_out_" + id;
            
            var status = readOnOffStatus(bytes[i]);
	    decoded[relay_out_name] ={
                value:  status === 'off' ? 0 : 1 ,
                unit: "",
            }  
            i += 1;
        }
        // relay AS COUNTER
        else if (includes(relay_in_chns, channel_id) && channel_type === 0xc8) {
            var id = channel_id - relay_in_chns[0] + 1;
            var counter_name = "counter_" + id;
            decoded[counter_name] ={
                value: readUInt32LE(bytes.slice(i, i + 4)),
                unit: "",
            }  
            i += 4;
        }
        // PT100
        else if (includes(pt100_chns, channel_id) && channel_type === 0x67) {
            var id = channel_id - pt100_chns[0] + 1;
            var pt100_name = "pt100_" + id;
            decoded[pt100_name] ={
                value: readInt16LE(bytes.slice(i, i + 2)) / 10,
                unit: "",
            }  
            i += 2;
        }
        // ADC CHANNEL
        else if (includes(ai_chns, channel_id) && channel_type === 0x02) {
            var id = channel_id - ai_chns[0] + 1;
            var adc_name = "adc_" + id;
            decoded[adc_name] = {
                value: readUInt32LE(bytes.slice(i, i + 4)) / 100,
                unit: "",
            } 
            i += 4;
            continue;
        }
        // ADC CHANNEL FOR VOLTAGE
        else if (includes(av_chns, channel_id) && channel_type === 0x02) {
            var id = channel_id - av_chns[0] + 1;
            var adv_name = "adv_" + id;
            decoded[adv_name] ={
                value: readUInt32LE(bytes.slice(i, i + 4)) / 100,
                unit: "",
            }  
            i += 4;
            continue;
        }
        // MODBUS
        else if (channel_id === 0xff && channel_type === 0x19) {
            var modbus_chn_id = bytes[i++] + 1;
            var data_length = bytes[i++];
            var data_type = bytes[i++];
            var sign = (data_type >>> 7) & 0x01;
            var type = data_type & 0x7f; // 0b01111111
            var chn = "modbus_chn_" + modbus_chn_id;
            switch (type) {
                case 0:
                    decoded[chn] ={
                        value: readOnOffStatus(bytes[i]),
                        unit: "",
                    }  
                    i += 1;
                    break;
                case 1:
                    decoded[chn] = {
                        value: sign ? readInt8(bytes.slice(i, i + 1)) : readUInt8(bytes.slice(i, i + 1)),
                        unit: "",
                    } 
                    i += 1;
                    break;
                case 2:
                case 3:
                    decoded[chn] = {
                        value: sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2)),
                        unit: "",
                    } 
                    i += 2;
                    break;
                case 4:
                case 6:
                    decoded[chn] = {
                        value: sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4)),
                        unit: "",
                    } 
                    i += 4;
                    break;
                case 8:
                case 10:
                    decoded[chn] = {
                        value: sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2)),
                        unit: "",
                    } 
                    i += 4;
                    break;
                case 9:
                case 11:
                    decoded[chn] ={
                        value: sign ? readInt16LE(bytes.slice(i + 2, i + 4)) : readUInt16LE(bytes.slice(i + 2, i + 4)),
                        unit: "",
                    }  
                    i += 4;
                    break;
                case 5:
                case 7:
                    decoded[chn] ={
                        value: readFloatLE(bytes.slice(i, i + 4)),
                        unit: "",
                    }  
                    i += 4;
                    break;
            }
        }
        // MODBUS READ ERROR
        else if (channel_id === 0xff && channel_type === 0x15) {
            var modbus_chn_id = bytes[i] + 1;
            var channel_name = "modbus_chn_" + modbus_chn_id + "_alarm";
            decoded[channel_name] ={
                value:  "read error",
                unit: "",
            } 
            i += 1;
        }
        // ANALOG INPUT STATISTICS
        else if (includes(ai_chns, channel_id) && channel_type === 0xe2) {
            var id = channel_id - ai_chns[0] + 1;
            var adc_name = "adc_" + id;
            decoded[adc_name] ={
                value: readFloat16LE(bytes.slice(i, i + 2)),
                unit: "",
            }  
            decoded[adc_name + "_max"] ={
                value: readFloat16LE(bytes.slice(i + 2, i + 4)),
                unit: "",
            }  
            decoded[adc_name + "_min"] ={
                value: readFloat16LE(bytes.slice(i + 4, i + 6)),
                unit: "",
            }  
            decoded[adc_name + "_avg"] ={
                value: readFloat16LE(bytes.slice(i + 6, i + 8)),
                unit: "",
            }  
            i += 8;
        }
        // ANALOG VOLTAGE STATISTICS
        else if (includes(av_chns, channel_id) && channel_type === 0xe2) {
            var id = channel_id - av_chns[0] + 1;
            var adc_name = "adv_" + id;
            decoded[adc_name] ={
                value: readFloat16LE(bytes.slice(i, i + 2)),
                unit: "",
            }  
            decoded[adc_name + "_max"] ={
                value:  readFloat16LE(bytes.slice(i + 2, i + 4)),
                unit: "",
            } 
            decoded[adc_name + "_min"] ={
                value: readFloat16LE(bytes.slice(i + 4, i + 6)),
                unit: "",
            }  
            decoded[adc_name + "_avg"] ={
                value:  readFloat16LE(bytes.slice(i + 6, i + 8)),
                unit: "",
            } 
            i += 8;
        }
        // PT100 ARGS
        else if (includes(pt100_chns, channel_id) && channel_type === 0xe2) {
            var id = channel_id - pt100_chns[0] + 1;
            var pt100_name = "pt100_" + id;
            decoded[pt100_name] ={
                value: readFloat16LE(bytes.slice(i, i + 2)),
                unit: "",
            }  
            decoded[pt100_name + "_max"] ={
                value: readFloat16LE(bytes.slice(i + 2, i + 4)),
                unit: "",
            }  
            decoded[pt100_name + "_min"] = {
                value: readFloat16LE(bytes.slice(i + 4, i + 6)),
                unit: "",
            } 
            decoded[pt100_name + "_avg"] ={
                value: readFloat16LE(bytes.slice(i + 6, i + 8)),
                unit: "",
            }  
            i += 8;
        }
        // CHANNEL HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xdc) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var channel_mask = numToBits(readUInt16LE(bytes.slice(i + 4, i + 6)), 16);
            i += 6;

            var data = { timestamp: timestamp };
            for (var j = 0; j < channel_mask.length; j++) {
                // SKIP UNUSED CHANNELS
                if (channel_mask[j] !== 1) continue;

                // relay INPUT
                if (j < 4) {
                    var type = bytes[i++];
                    // AS relay INPUT
                    if (type === 0) {
                        var name = "relay_in_" + (j + 1);
                        data[name] ={
                            value: readOnOffStatus(readUInt32LE(bytes.slice(i, i + 4))),
                            unit: "",
                        }  
                        i += 4;
                    }
                    // AS COUNTER
                    else {
                        var name = "counter_" + (j + 1);
                        data[name] ={
                            value: readUInt32LE(bytes.slice(i, i + 4)),
                            unit: "",
                        }  
                        i += 4;
                    }
                }
                // relay OUTPUT
                else if (j < 6) {
                    var name = "relay_out_" + (j - 4 + 1);
                    data[name] = {
                        value: readOnOffStatus(bytes[i]),
                        unit: "",
                    } 
                    i += 1;
                }
                // PT100
                else if (j < 8) {
                    var name = "pt100_" + (j - 6 + 1);
                    data[name] ={
                        value: readFloat16LE(bytes.slice(i, i + 2)),
                        unit: "",
                    }  
                    i += 2;
                }
                // ADC
                else if (j < 10) {
                    var name = "adc_" + (j - 8 + 1);
                    data[name] ={
                        value: readFloat16LE(bytes.slice(i, i + 2)),
                        unit: "",
                    }  
                    data[name + "_max"] ={
                        value: readFloat16LE(bytes.slice(i + 2, i + 4)),
                        unit: "",
                    }  
                    data[name + "_min"] ={
                        value: readFloat16LE(bytes.slice(i + 4, i + 6)),
                        unit: "",
                    }  
                    data[name + "_avg"] ={
                        value: readFloat16LE(bytes.slice(i + 6, i + 8)),
                        unit: "",
                    }  
                    i += 8;
                }
                // ADV
                else if (j < 12) {
                    var name = "adv_" + (j - 10 + 1);
                    data[name] = {
                        value: readFloat16LE(bytes.slice(i, i + 2)),
                        unit: "",
                    } 
                    data[name + "_max"] = {
                        value: readFloat16LE(bytes.slice(i + 2, i + 4)),
                        unit: "",
                    } 
                    data[name + "_min"] ={
                        value: readFloat16LE(bytes.slice(i + 4, i + 6)),
                        unit: "",
                    }  
                    data[name + "_avg"] ={
                        value: readFloat16LE(bytes.slice(i + 6, i + 8)),
                        unit: "",
                    }  
                    i += 8;
                }
                // CUSTOM MESSAGE
                else if (j < 13) {
                    data.text ={
                        value: readAscii(bytes.slice(i, 48)),
                        unit: "",
                    }  
                    i += 48;
                }
            }

            decoded.channel_history = decoded.channel_history || [];
            decoded.channel_history.push(data);
        }
        // MODBUS HISTORICAL DATA
        else if (channel_id === 0x20 && channel_type === 0xdd) {
            var timestamp = readUInt32LE(bytes.slice(i, i + 4));
            var modbus_chn_mask = numToBits(readUInt32LE(bytes.slice(i + 4, i + 8)), 32);
            i += 8;

            var data = { timestamp: timestamp };
            for (var j = 0; j < modbus_chn_mask.length; j++) {
                if (modbus_chn_mask[j] !== 1) continue;

                var chn = "modbus_chn_" + (j + 1);
                var data_type = bytes[i++];
                var sign = (data_type >>> 7) & 0x01;
                var type = data_type & 0x7f; // 0b01111111
                switch (type) {
                    case 0: // MB_COIL
                        decoded[chn] ={
                            value: readOnOffStatus(bytes[i]),
                            unit: "",
                        }  
                        break;
                    case 1: // MB_DISCRETE
                        data[chn] = {
                            value: sign ? readInt8(bytes.slice(i, i + 1)) : readUInt8(bytes.slice(i, i + 1)),
                            unit: "",
                        } 
                        break;
                    case 2: // MB_INPUT_INT16
                    case 3: // MB_HOLDING_INT16
                        data[chn] ={
                            value: sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2)),
                            unit: "",
                        }  
                        break;
                    case 4: // MB_HOLDING_INT32
                    case 6: // MB_INPUT_INT32
                        data[chn] = {
                            value: sign ? readInt32LE(bytes.slice(i, i + 4)) : readUInt32LE(bytes.slice(i, i + 4)),
                            unit: "",
                        } 
                        break;
                    case 8: // MB_INPUT_INT32_AB
                    case 10: // MB_HOLDING_INT32_AB
                        data[chn] ={
                            value: sign ? readInt16LE(bytes.slice(i, i + 2)) : readUInt16LE(bytes.slice(i, i + 2)),
                            unit: "",
                        }  
                        break;
                    case 9: // MB_INPUT_INT32_CD
                    case 11: // MB_HOLDING_INT32_CD
                        data[chn] = {
                            value: sign ? readInt16LE(bytes.slice(i + 2, i + 4)) : readUInt16LE(bytes.slice(i + 2, i + 4)),
                            unit: "",
                        } 
                        break;
                    case 5: // MB_HOLDING_FLOAT
                    case 7: // MB_INPUT_FLOAT
                        data[chn] = {
                            value: readFloatLE(bytes.slice(i, i + 4)),
                            unit: "",
                        } 
                        break;
                }
                i += 4;
            }

            decoded.modbus_history = decoded.modbus_history || [];
            decoded.modbus_history.push(data);
        }
        // DOWNLINK RESPONSE
        else if (channel_id === 0xfe || channel_id === 0xff) {
            var result = handle_downlink_response(channel_type, bytes, i);
            decoded = Object.assign(decoded, result.data);
            i = result.offset;
        }
        // TEXT
        else {
            decoded.text = {
                value: readAscii(bytes.slice(i - 2, bytes.length)),
                unit: "",
            } 
            i = bytes.length;
        }
    }

    return decoded;
}

function handle_downlink_response(channel_type, bytes, offset) {
    var decoded = {};

    switch (channel_type) {
        case 0x02:
            decoded.collection_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x03:
            decoded.report_interval = readUInt16LE(bytes.slice(offset, offset + 2));
            offset += 2;
            break;
        case 0x11:
            decoded.timestamp = readUInt32LE(bytes.slice(offset, offset + 4));
            offset += 4;
            break;
        case 0x17:
            decoded.timezone = readInt16LE(bytes.slice(offset, offset + 2)) / 10;
            offset += 2;
            break;
        case 0x91:
            decoded.jitter_config = decoded.jitter_config || {};
            var channel_map = { all: 0, relay_in_1: 1, relay_in_2: 2, relay_in_3: 3, relay_in_4: 4, relay_out_1: 5, relay_out_2: 6 };
            var channel_id = readUInt8(bytes[offset]);
            decoded.jitter_config[channel_map[channel_id]] = readUInt32LE(bytes.slice(offset + 1, offset + 5));
            offset += 5;
            break;
        case 0x92:
            var relay_index = readUInt8(bytes[offset]);
            var relay_out_chn_name = "relay_out_" + relay_index + "_control";
            decoded[relay_out_chn_name] = {
                status: readOnOffStatus(bytes[offset + 1]),
                duration: readUInt32LE(bytes.slice(offset + 2, offset + 6)),
            };
            offset += 6;
            break;
        default:
            throw new Error("unknown downlink response");
    }

    return { data: decoded, offset: offset };
}

function readProtocolVersion(bytes) {
    var major = (bytes & 0xf0) >> 4;
    var minor = bytes & 0x0f;
    return "v" + major + "." + minor;
}

function readHardwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = (bytes[1] & 0xff) >> 4;
    return "v" + major + "." + minor;
}

function readFirmwareVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readTslVersion(bytes) {
    var major = bytes[0] & 0xff;
    var minor = bytes[1] & 0xff;
    return "v" + major + "." + minor;
}

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readLoRaWANClass(type) {
    var class_map = {
        0: "Class A",
        1: "Class B",
        2: "Class C",
        3: "Class CtoB",
    };
    return getValue(class_map, type);
}

function readResetEvent(status) {
    var status_map = { 0: "normal", 1: "reset" };
    return getValue(status_map, status);
}

function readOnOffStatus(status) {
    var status_map = { 0: "off", 1: "on" };
    return getValue(status_map, status);
}

function numToBits(num, bit_count) {
    var bits = [];
    for (var i = 0; i < bit_count; i++) {
        bits.push((num >> i) & 1);
    }
    return bits;
}

function readUInt8(bytes) {
    return bytes & 0xff;
}

function readInt8(bytes) {
    var ref = readUInt8(bytes);
    return ref > 0x7f ? ref - 0x100 : ref;
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

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}

function readFloatLE(bytes) {
    // JavaScript bitwise operators yield a 32 bits integer, not a float.
    // Assume LSB (least significant byte first).
    var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 31 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    var m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);

    var n = Number(f.toFixed(2));
    return n;
}

function readFloat16LE(bytes) {
    var bits = (bytes[1] << 8) | bytes[0];
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    var m = e === 0 ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    var f = sign * m * Math.pow(2, e - 25);

    var n = Number(f.toFixed(2));
    return n;
}

function readAscii(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}

function includes(data, value) {
    var size = data.length;
    for (var i = 0; i < size; i++) {
        if (data[i] == value) {
            return true;
        }
    }
    return false;
}

function getValue(map, key) {
    if (RAW_VALUE) return key;

    var value = map[key];
    if (!value) value = "unknown";
    return value;
}

if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            "use strict";
            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError("Cannot convert first argument to object");
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource == null) {
                    // Skip over if undefined or null
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        },
    });
}


module.exports = { milesightDeviceDecodeUC300 };
