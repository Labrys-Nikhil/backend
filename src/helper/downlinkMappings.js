const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { postDownlinkDevice } = require('../controllers/downlinkController');
const { downlinkLoriot } = require("../controllers/loriotcontroller");


const mapTheDownlinkAndRoutetoSpecificServer = async (req, res) => {
    const {
        classType,
        confirmed,
        devEui,
        downlinkController,
        pdu,
        port,
        timeoutMinutes,
        isActive
    } = req.body;

    const data = {
        classType: classType,
        confirmed: confirmed,
        devEui: devEui,
        downlinkController: downlinkController,
        pdu: pdu,
        port: port,
        timeoutMinutes: timeoutMinutes
    }

    const device = await prisma.device.findFirst({
        where: { deviceId: devEui },
        select: {
            networkId: true,
        }
    });

    if (!device) {
        console.log("Device not found with ID:", devEui);
        return res.status(404).json({ message: "Device not found" });
    }
    const network = await prisma.networkdata.findFirst({
        where: {
            networkId: device.networkId,
        }
    })
    if (!network) {
        return res.status(500).json({ message: "network not found" });
    }
    
    if (network.networkId === 1) {
        //senra
        const response = await postDownlinkDevice(data);
        return res.status(response.status).json(response.data);

    } else if (network.networkId === 2) {
        //TTn

    } else if (network.networkId === 3) {
        //Loriot
        // create the mapping for the latest data 

        //step 2   :---- second data for the paload from the deviceLevel like appid
        const deviceAppid = network.appid;

        //step 3:---- decode the data into the relevant payloadf format
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

        const payloadForLoriot = {
            port: data.port,
            confirmed: data.confirmed || true, 
            data: packet["Payload"],
            EUI: data.devEui,
            appid: deviceAppid,
            priority: 2
        }
       
        if (isActive === true) {

       	const Device = await prisma.device.findFirst({
                where: { deviceId: devEui }
        });
            const response = await downlinkLoriot({ body: payloadForLoriot });
            if (response.status === 200) {
                const savedDownlink = await prisma.downlinkdevice.create({
                    data: {
                        downlinkController: downlinkController,
                        classType: classType,
                        devEui: devEui,
                        pdu: pdu,
                        port: packet["Port"],
                        payload: packet["Payload"],
                        deviceId: device.id,
                        timeoutMinutes: data.timeoutMinutes
                    }
                });
                console.log("Saved Downlink Device:", savedDownlink);
                const autoDownlinkWithdelay = await prisma.autodownlinkwithdelay.create({
                    data: {
                        downlinkController,
                        classType,
                        devEui,
                        pdu,
                        isActive: true,
                        timeoutMinutes: Number(timeoutMinutes),
                        port: Number(packet["Port"]),
                        deviceId: Number(Device.id)
                    }
                });
                console.log("Saved autoDownlinkWithDelay:", autoDownlinkWithdelay);
            }
            return res.status(response.status).json(response.data);
        } else {
            const response = await downlinkLoriot({ body: payloadForLoriot });
            if (response.status === 200) {
                const savedDownlink = await prisma.downlinkdevice.create({
                    data: {
                        downlinkController: downlinkController,
                        classType: classType,
                        devEui: devEui,
                        pdu: pdu,
                        port: packet["Port"],
                        payload: packet["Payload"],
                        deviceId: device.id,
                        timeoutMinutes: data.timeoutMinutes
                    }
                });
            }

            return res.status(response.status).json(response.data);
        }

    } else {
        return res.status(500).json({ message: "Invalid network ID" });
    }
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

module.exports = { mapTheDownlinkAndRoutetoSpecificServer };
