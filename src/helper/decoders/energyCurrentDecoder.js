
function hexToBytes(hexString) {
    // Ensure the string is uppercase (optional) and loop through the string
    let bytes = [];

    // Loop through the string, extracting two characters at a time
    for (let i = 0; i < hexString.length; i += 2) {
        // Convert each pair of hex digits to a byte and push it to the array
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }

    return bytes;
}
//function smartCurrentTansformer(data) {
//    const bytes = hexToBytes(data);
//  console.log("data",bytes);

  //  var decoded = {};
 //   for (var i = 0; i < bytes.length;) {
//        var channel_id = bytes[i++];     
//        var channel_type = bytes[i++];         
//
        // POWER STATE
//        if (channel_id === 0xff && channel_type === 0x0b) {
 //           decoded.power = "on";
//            console.log("power:",decoded.power);
//            i += 1;
//        }
        // IPSO VERSION
//        else if (channel_id === 0xff && channel_type === 0x01) {
  //          decoded.ipso_version = readProtocolVersion(bytes[i]);
    //        console.log("ipso_version:",decoded.ipso_version);
      //      i += 1;
//        }
        // PRODUCT SERIAL NUMBER
//        else if (channel_id === 0xff && channel_type === 0x16) {
  //          decoded.sn = readSerialNumber(bytes.slice(i, i + 8));
 //           console.log("sn:",decoded.sn);
 //           i += 8;
 //       }
        // HARDWARE VERSION
 //       else if (channel_id === 0xff && channel_type === 0x09) {
   //         decoded.hardware_version = readHardwareVersion(bytes.slice(i, i + 2));
 //           console.log("hardware_version:",decoded.hardware_version);
 //           i += 2;
 //       }
        // FIRMWARE VERSION
 //       else if (channel_id === 0xff && channel_type === 0x0a) {
 //           decoded.firmware_version = readFirmwareVersion(bytes.slice(i, i + 2));
  //          console.log("firmware_version:",decoded.firmware_version);
  //          i += 2;
  //      }
        // TOTAL CURRENT
 //       else if (channel_id === 0x03 && channel_type === 0x97) {
 //           decoded.total_current = readUInt32LE(bytes.slice(i, i + 4)) / 100;
 //           console.log("total_current:",decoded.total_current);
 //           i += 4;
 //       }
        // CURRENT
 //       else if (channel_id === 0x04 && channel_type === 0x98) {
 //           var value = readUInt16LE(bytes.slice(i, i + 2));
 //           if (value === 0xffff) {
 //               decoded.alarm = "read failed";
 //               console.log("alarm:",decoded.alarm);
 //           } else {
 //               decoded.current = value / 100;
 //               console.log("current:",decoded.current);
 //           }
 //           i += 2;
 //       }
        // TEMPERATURE
 //       else if (channel_id === 0x09 && channel_type === 0x67) {
   //         var temperature_value = readUInt16LE(bytes.slice(i, i + 2));
   //         if (temperature_value === 0xfffd) {
   //             decoded.temperature_exception = "over range alarm";
   //             console.log("temperature_exception:",decoded.temperature_exception);
   //         } else if (temperature_value === 0xffff) {
  //              decoded.temperature_exception = "read failed";
    //            console.log("temperature_exception:",decoded.temperature_exception);
   //         } else {
     //           decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
    //            console.log("temperature:",decoded.temperature);
      //      }
    //        i += 2;
    //    }
        // CURRENT ALARM
    //    else if (channel_id === 0x84 && channel_type === 0x98) {
     //       decoded.current_max = readUInt16LE(bytes.slice(i, i + 2)) / 100;
      //      decoded.current_min = readUInt16LE(bytes.slice(i + 2, i + 4)) / 100;
      //      decoded.current = readUInt16LE(bytes.slice(i + 4, i + 6)) / 100;
      //      decoded.alarm = readCurrentAlarm(bytes[i + 6]);
      //      console.log("current_max:",decoded.current_max); 
      //      console.log("current_min:",decoded.current_min); 
       //     console.log("current:",decoded.current); 
      //      console.log("alarm:",decoded.alarm);
       //     i += 7;
       // }
        // TEMPERATURE ALARM
    //    else if (channel_id === 0x89 && channel_type === 0x67) {
    //        decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
    //        console.log("temperature:",decoded.temperature);
    //        decoded.temperature_alarm = readTemperatureAlarm(bytes[i + 2]);
    //        console.log("temperature_alarm:",decoded.temperature_alarm);
    //        i += 3;
    //    } else {
    //        break;
    //    }
   // }

   // return decoded;
//}

function smartCurrentTansformer(data) {
    
    if(data === '0967ffff') return  false;
    const bytes = hexToBytes(data);
    console.log("data", bytes);

    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // POWER STATE
        if (channel_id === 0xff && channel_type === 0x0b) {
            decoded.power = {
                value: "on", 
                unit: "" // No unit needed
            };
            console.log("power:", decoded.power);
            i += 1;
        }
        // IPSO VERSION
        else if (channel_id === 0xff && channel_type === 0x01) {
            decoded.ipso_version = {
                value: readProtocolVersion(bytes[i]), 
                unit: ""
            };
            console.log("ipso_version:", decoded.ipso_version);
            i += 1;
        }
        // PRODUCT SERIAL NUMBER
        else if (channel_id === 0xff && channel_type === 0x16) {
            decoded.sn = {
                value: readSerialNumber(bytes.slice(i, i + 8)),
                unit: ""
            };
            console.log("sn:", decoded.sn);
            i += 8;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x09) {
            decoded.hardware_version = {
                value: readHardwareVersion(bytes.slice(i, i + 2)),
                unit: ""
            };
            console.log("hardware_version:", decoded.hardware_version);
            i += 2;
        }
        // FIRMWARE VERSION
        else if (channel_id === 0xff && channel_type === 0x0a) {
            decoded.firmware_version = {
                value: readFirmwareVersion(bytes.slice(i, i + 2)),
                unit: ""
            };
            console.log("firmware_version:", decoded.firmware_version);
            i += 2;
        }
        // TOTAL CURRENT
        else if (channel_id === 0x03 && channel_type === 0x97) {
            decoded.total_current = {
                value: readUInt32LE(bytes.slice(i, i + 4)) / 100,
                unit: "A" // Current in Amperes
            };
            console.log("total_current:", decoded.total_current);
            i += 4;
        }
        // CURRENT
        else if (channel_id === 0x04 && channel_type === 0x98) {
            var value = readUInt16LE(bytes.slice(i, i + 2));
            if (value === 0xffff) {
                decoded.alarm = {
                    value: "read failed",
                    unit: ""
                };
                console.log("alarm:", decoded.alarm);
            } else {
                decoded.current = {
                    value: value / 100,
                    unit: "A" // Current in Amperes
                };
                console.log("current:", decoded.current);
            }
            i += 2;
        }
        // TEMPERATURE
        else if (channel_id === 0x09 && channel_type === 0x67) {
            var temperature_value = readUInt16LE(bytes.slice(i, i + 2));
            if (temperature_value === 0xfffd) {
                decoded.temperature_exception = {
                    value: "over range alarm",
                    unit: ""
                };
                console.log("temperature_exception:", decoded.temperature_exception);
            } else if (temperature_value === 0xffff) {
                decoded.temperature_exception = {
                    value: "read failed",
                    unit: ""
                };
                console.log("temperature_exception:", decoded.temperature_exception);
            } else {
                decoded.temperature = {
                    value: readInt16LE(bytes.slice(i, i + 2)) / 10,
                    unit: "°C" // Temperature in Celsius
                };
                console.log("temperature:", decoded.temperature);
            }
            i += 2;
        }
        // CURRENT ALARM
        else if (channel_id === 0x84 && channel_type === 0x98) {
            decoded.current_max = {
                value: readUInt16LE(bytes.slice(i, i + 2)) / 100,
                unit: "A" // Maximum current in Amperes
            };
            decoded.current_min = {
                value: readUInt16LE(bytes.slice(i + 2, i + 4)) / 100,
                unit: "A" // Minimum current in Amperes
            };
            decoded.current = {
                value: readUInt16LE(bytes.slice(i + 4, i + 6)) / 100,
                unit: "A" // Current in Amperes
            };
            decoded.alarm = {
                value: readCurrentAlarm(bytes[i + 6]),
                unit: ""
            };
            console.log("current_max:", decoded.current_max);
            console.log("current_min:", decoded.current_min);
            console.log("current:", decoded.current);
            console.log("alarm:", decoded.alarm);
            i += 7;
        }
        // TEMPERATURE ALARM
        else if (channel_id === 0x89 && channel_type === 0x67) {
            decoded.temperature = {
                value: readInt16LE(bytes.slice(i, i + 2)) / 10,
                unit: "°C" // Temperature in Celsius
            };
            console.log("temperature:", decoded.temperature);
            decoded.temperature_alarm = {
                value: readTemperatureAlarm(bytes[i + 2]),
                unit: ""
            };
            console.log("temperature_alarm:", decoded.temperature_alarm);
            i += 3;
        } else {
            break;
        }
    }

    return decoded;
}


/* ******************************************
 * bytes to number
 ********************************************/
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
    return f;
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

function readSerialNumber(bytes) {
    var temp = [];
    for (var idx = 0; idx < bytes.length; idx++) {
        temp.push(("0" + (bytes[idx] & 0xff).toString(16)).slice(-2));
    }
    return temp.join("");
}

function readCurrentAlarm(type) {
    var alarm = [];
    if ((type >> 0) & 0x01) {
        alarm.push("threshold alarm");
    }
    if ((type >> 1) & 0x01) {
        alarm.push("threshold alarm release");
    }
    if ((type >> 2) & 0x01) {
        alarm.push("over range alarm");
    }
    if ((type >> 3) & 0x01) {
        alarm.push("over range alarm release");
    }
    return alarm;
}

module.exports = { smartCurrentTansformer };

