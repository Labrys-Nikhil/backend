const convertToBytes = (data) => {
    // Convert a hexadecimal string or an array to a Uint8Array.
	 console.log('data---->Convertbytes',data);
//    if (typeof data === "string") {
  //      return new Uint8Array(
    //        data.trim().split(" ").map((byte) => parseInt(byte, 16))
      //  );
    //}
if (typeof data === "string") {
    return new Uint8Array(
        data.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
}

    if (Array.isArray(data)) {
        return new Uint8Array(data);
    }

    throw new Error("Invalid data format. Expected a string or an array of numbers.");
};

const decodeLDDS75Payload = (data) => {
    const bytes = convertToBytes(data);
	console.log('data---->bytes',bytes,bytes.length);
    if (bytes.length < 8) {
        throw new Error("Invalid payload length. Expected at least 8 bytes.");
    }

    // Battery Info
    const batteryRaw = (bytes[0] << 8) | bytes[1];
    const batteryVoltage = batteryRaw / 1000; // Convert mV to volts

    // Distance Measurement
    const distanceRaw = (bytes[2] << 8) | bytes[3];
    let distanceValue = null;
    let distanceUnit = null;
    if (distanceRaw === 0x0000) {
        distanceValue = "Not detected";
    } else if (distanceRaw < 0x0118) {
        distanceValue = "less than 280mm";
    } else {
        distanceValue = distanceRaw / 10; // Convert mm to cm
        distanceUnit = "cm";
    }

    // Interrupt Pin
    const interruptStatus = bytes[4] === 0x01;

    // DS18B20 Temperature Sensor (Optional)
    let temperatureValue = null;
    let temperatureUnit = null;
    if (bytes.length >= 7) {
        const tempRaw = (bytes[5] << 8) | bytes[6];
        if ((tempRaw & 0x8000) === 0) {
            temperatureValue = tempRaw / 10; // Positive temperature
        } else {
            temperatureValue = (tempRaw - 65536) / 10; // Negative temperature
        }
        temperatureUnit = "°C";
    }

    // Sensor Flag
    const ultrasonicSensorDetected = bytes[7] === 0x01;

    // Construct result object
    return {
        distance: {
            value: distanceValue,
            unit: distanceUnit,
        },
        battery: {
            value: batteryVoltage,
            unit: "V",
        },
        temperature: {
            value: temperatureValue,
            unit: temperatureUnit,
        },
        ultrasonicSensor: {
            value: ultrasonicSensorDetected,
            unit: "",
        },
        interrupt: {
            value: interruptStatus,
            unit: "",
        },
    };
};

module.exports = { decodeLDDS75Payload };

