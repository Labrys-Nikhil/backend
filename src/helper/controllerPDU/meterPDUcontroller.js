function getPDUCommand(commandName, numericValue = null, slaveId = "03") {
    const commandCodes = {
        "FORCED EB": "10",
        "FORCED DG": "11",
        "FORCED EB_DG RST": "12",
        "BALANCE DEDUCT RANDOM": "13",
        "RUN EB ONLY": "14",
        "RUN DG ONLY": "15",
        "RUN EB/DG ONLY RESET": "16",
        "SET HAPPY DAY": "17",
        "SET HAPPY HOUR": "18",
        "EMERGENCY BUTTON RESET": "19",
        "SET MONTHLY DEDUCT TARIFF": "1A",
        "SET METER ID": "1B",
        "CLEAR OVERLOAD FAULT": "1C",
        "UPDATE OVERLOAD DG": "21",
        "UPDATE OVERLOAD EB": "22",
        "UPDATE TARIFF DG": "23",
        "UPDATE TARIFF EB": "24",
        "RECHARGE BALANCE": "25",
        "SET DAILY DEDUCT TARIFF": "26",
        "SET OVERLOAD MAX ATTEMPT": "27",
        "SET OVERLOAD ATTEMPT WAIT TIME": "28",
        "FORCED RELAY ON": "29",
        "FORCED RELAY OFF": "2A",
        "FORCED RELAY CLEAR": "2B",
        "FORCED INDIVIDUAL RELAY DG": "31",
        "FORCED INDIVIDUAL RELAY EB": "32",
        "CLEAR BALANCE": "3F"
    };

    if (!commandCodes[commandName]) return null;

    const prefix = "A80106"; // Fixed prefix (3 bytes)
    const functionCode = "06"; // Write command
    const separator = "00"; // Fixed
    const commandCode = commandCodes[commandName];
    const suffixByte = "00"; // Fixed suffix

    // Zero-value commands
    const zeroValCommands = ["CLEAR BALANCE", "CLEAR OVERLOAD FAULT"];
    if (zeroValCommands.includes(commandName)) {
        return prefix + slaveId + functionCode + separator + commandCode + "000000";
    }
    const updateTarrif = ['UPDATE TARIFF DG', 'UPDATE TARIFF EB'];
    if (updateTarrif.includes(commandName)) {
        let data = "0000"; 
        if (numericValue !== null) {
            const num = Math.min(Math.max(Number(numericValue*100), 0), 65535);
            let hex = num.toString(16).padStart(4, '0');
            data = hex.slice(2) + hex.slice(0, 2); // Swap bytes
        }
        return prefix + slaveId + functionCode + separator + commandCode + data + suffixByte;
    }

    let data = "0001"; // default 2-byte value if none provided
    if (numericValue !== null) {
        const num = Math.min(Math.max(Number(numericValue), 0), 65535);
        let hex = num.toString(16).padStart(4, '0');
        data = hex.slice(2) + hex.slice(0, 2); // Swap bytes
    }
    console.log(
        {
            prefix, slaveId, functionCode, separator, commandCode, data, suffixByte
        })
    return prefix + slaveId + functionCode + separator + commandCode + data + suffixByte;
}

module.exports = { getPDUCommand };