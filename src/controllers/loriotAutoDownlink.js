//const { PrismaClient } = require('@prisma/client');
//const prisma = new PrismaClient();
//const jwt = require('jsonwebtoken');
//const axios = require('axios');

//const downlinkLoriotForAuto = async (req, res) => {

    // user token is being send to get the customer and network info through the customer id 
//    const  deviceEui  = req.devEui
//    console.log("device EUI received", deviceEui);
    // //req.user we can use
    // console.log("req->>>>>", req.headers);
    // const { authorization } = req.headers; // JWT token in Authorization header
    // console.log("Authorization header:", authorization);

//    const { EUI, port, confirmed, priority, data, appid } = req.body;
//    console.log("Request body:", { EUI, port, confirmed, priority, data, appid });

    // if (!authorization) {
    //     console.error("Authorization header is missing");
    //     return res.status(401).json({ error: 'Authorization header is missing' });
    // }

//    try {
        // Decode and validate JWT token
        // const token = authorization.replace('Bearer ', '');
        // console.log("Decoded JWT token:", token);

        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("Decoded JWT payload:", decoded);

        //first find the customer id
//        const device = await prisma.device.findFirst({
//            where: {
//                deviceId: deviceEui, // Replace with actual deviceId
//            }
 //       });


 //       console.log("device found in loriot downlink:", device);

//        if (!device) {// customer id 
//            console.error("Invalid : device not found in loriot downlink");
            // return res.status(400).json({ error: 'Invalid : device not found in loriot downlink' });
//            return null;
//        }

        // Fetch networkmodel details based on customerId
//        const network = await prisma.networkdata.findFirst({
//            where: { networkId: device.networkId },
            // select: { name: true, token: true }, // Fetch servername (name) and Authorization token
//        });
 //       console.log("Fetched network details:", network);

 //       if (!network) {
 //           console.error("Network not found for this customerId:", customerId);
            // return res.status(404).json({ error: 'Network not found for this customer' });
 //           return null;
 //       }

 //       const servername = network.hostname;
 //       const serverToken = network.token;
 //       console.log("Server name:", servername);
   //     console.log("Server token:", serverToken);

 //       const fullServerName = servername + ".loriot.io";
 //       console.log("checking fullservername", fullServerName);

        // Construct base URL
//        const baseUrl = `https://${fullServerName}/1/rest`;
//        console.log("Constructed base URL:", baseUrl);

        // Prepare the downlink payload
//        const payload = {
//            cmd: 'tx',
//            EUI,
//            port,
//            confirmed,
//            priority,
//            data,
//            appid,
 //       };
 //       console.log("Downlink payload:", payload);

        // Make the POST request to the downlink API
//        const response = await axios.post(baseUrl, payload, {
//            headers: {
//                'Content-Type': 'application/json',
//                Authorization: `Bearer ${serverToken}`, // Use token from the networkmodel
//            },
//        });
//        console.log("Downlink API response:", response.data);

//        if (response.status === 200) {
//            const savedDownlink = await prisma.downlinkdevice.create({
//                data: {
//                    downlinkController: data.downlinkController,
//                    classType: data.classType,
//                    devEui: data.devEui,
//                    pdu: data.pdu,
//                    port: packet["Port"],
//                    payload: packet["Payload"],
//                    deviceId: data.deviceId,
//                    timeoutMinutes: data.timeoutMinutes
//                }
//            });
//            console.log("Saved Downlink Device:", savedDownlink);
//            const autoDownlinkWithdelay = await prisma.autodownlinkwithdelay.create({
//                data: payloadDataForAutoDownlink
//            });
//            console.log("Saved autoDownlinkWithDelay:", autoDownlinkWithdelay);
  //      }



        //store the response into the native paltfrom table
//        return response;
//    } catch (error) {
        // console.error("Error during processing:", error.message);
        // if (error.name === 'JsonWebTokenError') {
        //     return res.status(401).json({ error: 'Invalid JWT token' });
        // }
        // return res.status(500).json({ error: 'Failed to process request', details: error.message });
//        return null;
//    }
//};

//module.exports = {downlinkLoriotForAuto}
//
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const axios = require('axios');

const downlinkLoriotForAuto = async (req, res) => {

    // user token is being send to get the customer and network info through the customer id 
    const deviceEui = req.devEui
    console.log("device EUI received in downlinkLoriotForAuto", deviceEui);

    // //req.user we can use
    // console.log("req->>>>>", req.headers);
    // const { authorization } = req.headers; // JWT token in Authorization header
    // console.log("Authorization header:", authorization);


    const { downlinkController, classType, devEui, pdu, timeoutMinutes, port,deviceId } = req.body;
    console.log("Request body:", { downlinkController, classType, devEui, pdu, timeoutMinutes, port,deviceId  });

    const device = req.device;
    console.log("device fetched:", device);

    const networkAppid = await prisma.networkdata.findFirst({
        where: {
            networkId: device.networkId,
        },
        select: {
            appid: true,
        }
    });

    // Prepare data for downlink for loriot
    //EUI, port, confirmed, priority, data, appid
    let packet;
    let relay1State = 'off';
    let relay2State = 'off';

    if (downlinkController === "relay 1" || downlinkController === "Relay 1") {
        packet = generateRelay1Packet(pdu);
        relay1State = pdu.toLowerCase() === 'on' ? 'on' : 'off';
    } else if (downlinkController === "relay 2" || downlinkController === "Relay 2") {
        packet = generateRelay2Packet(pdu);
        relay2State = pdu.toLowerCase() === 'on' ? 'on' : 'off';
    } else if (downlinkController === "relay 1+2") {
        packet = generateBothRelayPacket(pdu);
        relay1State = pdu === 'on' ? 'on' : 'off';
        relay2State = pdu === 'on' ? 'on' : 'off';
    } else {
        console.log("Invalid downlinkController:", downlinkController);
        return res.status(400).json({ message: "Invalid downlink controller" });
    }

    console.log("Generated packet:", packet);


    // const loriotData = {
    //     EUI: devEui,
    //     port: Number(port) || 2,
    //     confirmed: true,
    //     priority: 1,
    //     data: packet["Payload"],
    //     appid: networkAppid.appid,
    // }
    console.log('autodownlink networkAppid ---->', networkAppid);
    console.log('autodownlink payload for loriot ---->', loriotData);
    // if (!authorization) {
    //     console.error("Authorization header is missing");
    //     return res.status(401).json({ error: 'Authorization header is missing' });
    // }

    try {
        // Decode and validate JWT token
        // const token = authorization.replace('Bearer ', '');
        // console.log("Decoded JWT token:", token);

        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("Decoded JWT payload:", decoded);

        //first find the customer id
        const device = await prisma.device.findFirst({
            where: {
                deviceId: deviceEui, // Replace with actual deviceId
            }
        });


        console.log("device found in loriot downlink:", device);

        if (!device) {// customer id 
            console.error("Invalid : device not found in loriot downlink");
            // return res.status(400).json({ error: 'Invalid : device not found in loriot downlink' });
            return null;
        }

        // Fetch networkmodel details based on customerId
        const network = await prisma.networkdata.findFirst({
            where: { networkId: device.networkId },
            // select: { name: true, token: true }, // Fetch servername (name) and Authorization token
        });
        console.log("Fetched network details:", network);

        if (!network) {
            console.error("Network not found for this customerId:", customerId);
            // return res.status(404).json({ error: 'Network not found for this customer' });
            return null;
        }

        const servername = network.hostname;
        const serverToken = network.token;
        console.log("Server name:", servername);
        console.log("Server token:", serverToken);

        const fullServerName = servername + ".loriot.io";
        console.log("checking fullservername", fullServerName);

        // Construct base URL
        const baseUrl = `https://${fullServerName}/1/rest`;
        console.log("Constructed base URL:", baseUrl);

        // Prepare the downlink payload
        const payload = {
            cmd: 'tx',
            EUI:devEui,
            port:Number(port) || 2,
            confirmed:true,
            priority:1,
            data:packet["Payload"],
            appid:networkAppid.appid,
        };
        console.log("Downlink payload:", payload);

        // Make the POST request to the downlink API
        const response = await axios.post(baseUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${serverToken}`, // Use token from the networkmodel
            },
        });
        console.log("Downlink API response:", response.data);

        if (response.status === 200) {
            const savedDownlink = await prisma.downlinkdevice.create({
                data: {
                    downlinkController: downlinkController,
                    classType: classType,
                    devEui: devEui,
                    pdu: pdu,
                    port: packet["Port"],
                    payload: packet["Payload"],
                    deviceId: deviceId,
                    timeoutMinutes: timeoutMinutes
                }
            });
            console.log("Saved Downlink Device:", savedDownlink);
            // const autoDownlinkWithdelay = await prisma.autodownlinkwithdelay.create({
            //     data: payloadDataForAutoDownlink
            // });
            // console.log("Saved autoDownlinkWithDelay:", autoDownlinkWithdelay);
        }
        //store the response into the native paltfrom table
        return response;
    } catch (error) {
        // console.error("Error during processing:", error.message);
        // if (error.name === 'JsonWebTokenError') {
        //     return res.status(401).json({ error: 'Invalid JWT token' });
        // }
        // return res.status(500).json({ error: 'Failed to process request', details: error.message });
        return null;
    }
};



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

module.exports = { downlinkLoriotForAuto }

