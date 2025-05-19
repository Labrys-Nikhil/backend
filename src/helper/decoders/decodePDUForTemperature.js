function decodePDUForTemperature(pdu) {
    // Extract fields and convert from hexadecimal to decimal
    const batteryHex = parseInt(pdu.substring(0, 4), 16);  // First 2 bytes (Battery in hex)
    const temperature = parseInt(pdu.substring(4, 8), 16) / 100;  // Next 2 bytes (temperature in Celsius)
    const humidity = parseInt(pdu.substring(8, 12), 16) / 10;  // Next 2 bytes (humidity as percentage)
    const status = parseInt(pdu.substring(12, 14), 16);  // Next 1 byte (status)
    const temperature_c_ds = parseInt(pdu.substring(14, 18), 16) / 100;  // Convert temperature to Celsius
    const unix_timestamp = parseInt(pdu.substring(18, 22), 16);  // Next 2 bytes (Unix timestamp)

    // Calculate battery voltage based on your provided formula:
    const battery_status = (batteryHex >> 14) & 0xFF;  // (Battery >> 14) & 0xFF = battery status
    const battery_voltage = batteryHex & 0x3FFF;  // Battery voltage = Battery & 0x3FFF

    // Convert battery voltage to millivolts (as 2980 mV in example)
    const battery_voltage_mV = battery_voltage;  // 2980 mV

    // Return the decoded values along with their units
    return {
        battery_status: { value: battery_status, unit: "" },  // No unit for status
        battery_voltage_mV: { value: battery_voltage_mV, unit: "mV" },  // Battery in millivolts
        temperature: { value: temperature.toFixed(2), unit: "°C" },  // Temperature in Celsius
        humidity: { value: humidity.toFixed(1), unit: "%" },  // Humidity in percentage
        status: { value: status, unit: "" },  // No unit for status
        temperature_c_ds: { value: temperature_c_ds.toFixed(2), unit: "°C" },  // Secondary temperature in Celsius
        unix_timestamp: { value: unix_timestamp, unit: "" }  // No unit for timestamp
    };
}

module.exports = { decodePDUForTemperature };
