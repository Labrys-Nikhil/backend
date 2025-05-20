
function generateControllerPDULT2222(downlinkController,pdu){
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



module.exports={generateControllerPDULT2222};