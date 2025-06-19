
function generateControllerPDULT2222(downlinkController,pdu){
    console.log("data inde the pdu controller",downlinkController,pdu);
    let packet;
    let relay1State = 'off';
    let relay2State = 'off';

    if (downlinkController === "relay 1") {
        packet = generateRelay1Packet(pdu);
        relay1State = pdu === 'on' ? 'on' : 'off';
    } else if (downlinkController === "relay 2") {
        packet = generateRelay2Packet(pdu);
        relay2State = pdu === 'on' ? 'on' : 'off';
    } else if (downlinkController === "relay 1+2") {
        packet = generateBothRelayPacket(pdu);
        relay1State = pdu === 'on' ? 'on' : 'off';
        relay2State = pdu === 'on' ? 'on' : 'off';
    } else {
        console.log("Invalid downlinkController:", downlinkController);
        return res.status(400).json({ message: "Invalid downlink controller" });
    }

    return packet;
}


// Function to generate packet for Relay 1
function generateRelay1Packet(value) {
  const packet = {};
  if (value.toLowerCase() === 'on') {
    packet["Payload"] = "030111"; // Relay 1: On
  } else if (value.toLowerCase() === 'off') {
    packet["Payload"] = "030011"; // Relay 1: Off
  } else {
    packet["Payload"] = "031111"; // Relay 1: No change
  }
  packet["Port"] = "2";
  return packet;
}

// Function to generate packet for Relay 2
function generateRelay2Packet(value) {
  const packet = {};
  if (value.toLowerCase() === 'on') {
    packet["Payload"] = "031101"; // Relay 2: On
  } else if (value.toLowerCase() === 'off') {
    packet["Payload"] = "031100"; // Relay 2: Off
  } else {
    packet["Payload"] = "031111"; // Relay 2: No change
  }
  packet["Port"] = "2";
  return packet;
}

// Function to generate packet for Relay 1 and Relay 2
function generateBothRelayPacket(value) {
  const packet = {};
  if (value.toLowerCase() === 'on') {
    packet["Payload"] = "030101"; // Both Relays: On
  } else if (value.toLowerCase() === 'off') {
    packet["Payload"] = "030000"; // Both Relays: Off
  } else {
    packet["Payload"] = "031111"; // No change
  }
  packet["Port"] = "2";
  return packet;
}

module.exports={generateControllerPDULT2222};