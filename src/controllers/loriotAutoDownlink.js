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
const { controllerPDUByModel } = require('../helper/controllerPDUbyModel');

const downlinkLoriotForAuto = async (req, res) => {

    // user token is being send to get the customer and network info through the customer id 
    const deviceEui = req.devEui
    console.log("device EUI received in downlinkLoriotForAuto", deviceEui);

    // //req.user we can use
    // console.log("req->>>>>", req.headers);
    // const { authorization } = req.headers; // JWT token in Authorization header
    // console.log("Authorization header:", authorization);


    const { downlinkController, classType, devEui, pdu, timeoutMinutes, port, deviceId } = req.body;
    console.log("Request body:", { downlinkController, classType, devEui, pdu, timeoutMinutes, port, deviceId });

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

    const deviceData = await prisma.device.findFirst({
        where: {
            deviceId: devEui
        },
        select: {
            hardwareId: true
        }
    })

    const hardwareData = await prisma.hardware.findFirst({
        where: {
            id: deviceData.hardwareId,
        },
        select: {
            id: true,
            //decoderPDU:true,
            modelNo: true
        }
    });
    console.log("device and hardware data", deviceData, hardwareData);

    //then call the decodePDU for that hardware
    const modelNumber = hardwareData.modelNo;

    //last step to call the mapping;
    const controllerPDUData = {
        downlinkController: downlinkController,
        pdu: pdu
    }
    console.log(controllerPDUData);
    const responseOfControllerPDU = await controllerPDUByModel(controllerPDUData, modelNumber);

    console.log("data after the controllerPDU", responseOfControllerPDU);

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
            where: { deviceId: devEui },
        });
        console.log("device acording to the devEUI in the autodownlink Settimeout", device);

        if (!device) {
            console.log("Device not found with ID:", devEui);
            return res.status(404).json({ message: "Device not found" });
        }
        const organization = await prisma.organization.findFirst({
            where:{
                id:device.organizationId,
            },
            select:{
                id:true,
                customerId:true
            }
        })
        const network = await prisma.networkdata.findFirst({
            where: {
                organizationId: device.organizationId,
                networkId: device.networkId,
                customerId: organization.customerId,
            }
        })

        console.log("device acording to the network in the maptheDownlinkTospecificServer", network);

        if (!network) {
            return res.status(500).json({ message: "network not found" });
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
            EUI: devEui,
            port: Number(responseOfControllerPDU?.Port) || 2,
            confirmed: true,
            priority: 1,
            data: responseOfControllerPDU?.Payload,
            appid: networkAppid.appid,
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
                    port: responseOfControllerPDU?.Port,
                    payload: responseOfControllerPDU?.Payload,
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

module.exports = { downlinkLoriotForAuto }

