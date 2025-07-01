function generateControllerPDUUC300(controllerName, value) {
    const packet = {};
    const commands = {
        relay_out_1: {
            on: "070100ff",
            off: "070000ff"
        },
        relay_out_2: {
            on: "080100ff",
            off: "080000ff"
        }
    };

    const normalizedValue = value.toLowerCase();
    const controller = commands[controllerName.toLowerCase()];

    if (controller && (normalizedValue === "on" || normalizedValue === "off")) {
        packet["Payload"] = controller[normalizedValue];
    } else {
        packet["Payload"] = "00000000"; // Default or invalid fallback payload
    }

    packet["Port"] = "85"; // Port as a string, consistent with your example
    return packet;
}


module.exports = {generateControllerPDUUC300}