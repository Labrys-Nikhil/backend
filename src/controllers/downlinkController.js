const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculatePagination, filterTransactionsByDate } = require('../helper/commonHelper')

// Main controller function for handling downlink device
// const postDownlinkDevice = async (req, res) => {
//     try {
//         // Extract data from the request body
//         const {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed = 'false',
//             timeoutMinutes = 5,
//             deviceId
//         } = req.body;

//         // Determine the packet based on relayNumber and relayStatus
//         let packet;
//         let relay1State = 'off'; // Default state
//         let relay2State = 'off'; // Default state

//         if (downlinkController === "relay 1") {
//             packet = generateRelay1Packet(pdu);
//             relay1State = pdu === 'on' ? 'on' : 'off';
//         } else if (downlinkController === "relay 2") {
//             packet = generateRelay2Packet(pdu);
//             relay2State = pdu === 'on' ? 'on' : 'off';
//         } else if (downlinkController === "relay 1+2") {
//             packet = generateBothRelayPacket(pdu);
//             relay1State = pdu === 'on' ? 'on' : 'off';
//             relay2State = pdu === 'on' ? 'on' : 'off';
//         } else {
//             return res.status(400).json({ message: "Invalid downlink controller" });
//         }

//         console.log("function uper wali id",deviceId)
//         const device = await prisma.device.findUnique({
//             where: {
//                 id:deviceId, // This is the correct way to query by 'id'
//             },
//         });

//         // Check if a RelayState already exists for this device
//         let savedRelayState;
//         const existingRelayState = await prisma.relaystate.findFirst({
//             where: {
//                 devEui,
//             }
//         });

//         // Prepare the new state to update
//         const relayStateUpdate = {
//             devEui,
//             deviceId: device?.id // Link to the device if found
//         };

//         if (existingRelayState) {
//             // Update the existing RelayState based on which relay is being controlled
//             relayStateUpdate.relay1 = downlinkController === "relay 1" || downlinkController === "relay 1+2" ? relay1State : existingRelayState.relay1;
//             relayStateUpdate.relay2 = downlinkController === "relay 2" || downlinkController === "relay 1+2" ? relay2State : existingRelayState.relay2;

//             savedRelayState = await prisma.relaystate.update({
//                 where: { id: existingRelayState.id },
//                 data: relayStateUpdate
//             });
//         } else {
//             // If there's no existing RelayState, create a new one
//             savedRelayState = await prisma.relaystate.create({
//                 data: {
//                     relay1: relay1State,
//                     relay2: relay2State,
//                     devEui,
//                     deviceId: device?.id // Link to the device if found
//                 }
//             });
//         }

//         // Prepare data for DownlinkDevice
//         const data = {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed: confirmed === 'true',
//             timeoutMinutes,
//             port: packet["Port"],
//             payload: packet["Payload"],
//             relayStateId: savedRelayState.id, // Link to the RelayState
//             deviceId: device?.id // Link to the device if found
//         };

//         const savedDownlink = await prisma.downlinkdevice.create({
//             data
//         });

//         // Set up the parameters for the API call
//         const params = new URLSearchParams();
//         params.append('class', classType);
//         params.append('confirmed', confirmed);
//         params.append('devEui', devEui);
//         params.append('pdu', packet["Payload"]); // Use the generated payload
//         params.append('port', packet["Port"]);
//         params.append('timeoutMinutes', timeoutMinutes);

//         // Send the POST request to the SenRa API
//         const response = await axios.post(
//             `https://portal.senraco.io/rest/current/device/sendmsg?${params.toString()}`,
//             {}, // Sending an empty body in this case
//             {
//                 headers: {
//                     'authorization': 'AK3:UARIci2iL6EeCbhbupMqFaevRxt59CnqGqFFRRwCx'
//                 }
//             }
//         );

//         // Respond back with the data received from SenRa
//         res.status(response.status).json(response.data);
//     } catch (error) {
//         // Handle errors, including those from the SenRa API
//         console.error("error", error);
//         res.status(error.response?.status || 500).json({
//             message: 'Error sending data to SenRa',
//             details: error.response?.data || error.message
//         });
//     }
// };

// const postDownlinkDevice = async (req, res) => {
//     try {
//         // Extract data from the request body
//         const {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed = 'false',
//             timeoutMinutes,
//             deviceId
//         } = req.body;
//         console.log("Received request data:", {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed,
//             timeoutMinutes,
//             deviceId
//         });

//         // Determine the packet based on relayNumber and relayStatus
//         let packet;
//         let relay1State = 'off'; // Default state
//         let relay2State = 'off'; // Default state

//         if (downlinkController === "relay 1") {
//             packet = generateRelay1Packet(pdu);
//             relay1State = pdu === 'on' ? 'on' : 'off';
//         } else if (downlinkController === "relay 2") {
//             packet = generateRelay2Packet(pdu);
//             relay2State = pdu === 'on' ? 'on' : 'off';
//         } else if (downlinkController === "relay 1+2") {
//             packet = generateBothRelayPacket(pdu);
//             relay1State = pdu === 'on' ? 'on' : 'off';
//             relay2State = pdu === 'on' ? 'on' : 'off';
//         } else {
//             console.log("Invalid downlinkController:", downlinkController);
//             return res.status(400).json({ message: "Invalid downlink controller" });
//         }

//         console.log("Generated packet:", packet);
//         console.log("Relay states:", { relay1State, relay2State });

//         console.log("Fetching device with deviceId:", devEui);

//         const device = await prisma.device.findFirst({
//             where: {
//                 id: deviceId, // This is the correct way to query by 'id'
//             },
//         });

//         if (!device) {
//             console.log("Device not found with ID:", device.id);
//             return res.status(404).json({ message: "Device not found" });
//         }

//         console.log("Device found:", device.id);


//         // Prepare data for DownlinkDevice
//         const payloadDataForAutoDownlink = {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             isActive:true,
//             timeoutMinutes,
//             port: packet["Port"],
//             deviceId: device.id
//         }
//         const data = {
//             downlinkController,
//             classType,
//             devEui,
//             pdu,
//             confirmed: confirmed === 'true',
//             timeoutMinutes:timeoutMinutes == 5,
//             port: packet["Port"],
//             payload: packet["Payload"],
//             deviceId: device.id // Link to the device if found
//         };

//         console.log("Downlink data:", data);

//         const savedDownlink = await prisma.downlinkdevice.create({
//             data
//         });

//         console.log("Saved Downlink Device:", savedDownlink);

//         // Set up the parameters for the API call
//         const params = new URLSearchParams();
//         params.append('class', classType);
//         params.append('confirmed', confirmed);
//         params.append('devEui', devEui);
//         params.append('pdu', packet["Payload"]); // Use the generated payload
//         params.append('port', packet["Port"]);
//         params.append('timeoutMinutes', timeoutMinutes);

//         console.log("SenRa API call parameters:", params.toString());

//         // Send the POST request to the SenRa API
//         const response = await axios.post(
//             `https://portal.senraco.io/rest/current/device/sendmsg?${params.toString()}`,
//             {}, // Sending an empty body in this case
//             {
                // headers: {
                //     'authorization': 'AK3:UARIci2iL6EeCbhbupMqFaevRxt59CnqGqFFRRwCx'
                // }
//             }
//         );

//         console.log("SenRa API response:", response);
//         console.log("status check",response.status)
//         // Respond back with the data received from SenRa
//         if(response.status === 200){
//             await prisma.autoDownlinkWithDelay.create({
//                 payloadDataForAutoDownlink
//               });
//         }
//         res.status(response.status).json(response.data);
//     } catch (error) {
//         // Handle errors, including those from the SenRa API
//         console.error("Error:", error);
//         // res.status(error.response?.status || 500).json({
//         //     message: 'Error sending data to SenRa',
//         //     details: error.response?.data || error.message
//         // });
//     }
// };
const postDownlinkDevice = async (req, res) => {
    try {
        const {
            downlinkController,
            classType,
            devEui,
            pdu,
            confirmed = 'false',
            timeoutMinutes,
            deviceId
        } = req.body;

        console.log("Received request data:", {
            downlinkController,
            classType,
            devEui,
            pdu,
            confirmed,
            timeoutMinutes,
            deviceId
        });

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

        console.log("Generated packet:", packet);

        const device = await prisma.device.findFirst({
            where: { id: deviceId },
        });

        if (!device) {
            console.log("Device not found with ID:", deviceId);
            return res.status(404).json({ message: "Device not found" });
        }

        const payloadDataForAutoDownlink = {
            downlinkController,
            classType,
            devEui,
            pdu,
            isActive: true,
            timeoutMinutes: Number(timeoutMinutes),
            port: Number(packet["Port"]),
            deviceId: device.id
        };

        const data = {
            downlinkController,
            classType,
            devEui,
            pdu,
            confirmed: confirmed === 'true',
            timeoutMinutes: timeoutMinutes === 5,
            port: packet["Port"],
            payload: packet["Payload"],
            deviceId: device.id
        };

        const params = new URLSearchParams();
        params.append('class', classType);
        params.append('confirmed', confirmed);
        params.append('devEui', devEui);
        params.append('pdu', packet["Payload"]);
        params.append('port', packet["Port"]);
        params.append('timeoutMinutes', timeoutMinutes);

        const response = await axios.post(
            `https://portal.senraco.io/rest/current/device/sendmsg?${params.toString()}`,
            {},
            {
                headers: {
                    'authorization': 'AK3:UARIci2iL6EeCbhbupMqFaevRxt59CnqGqFFRRwCx'
                }
            }
        );

        if (response.status === 200) {
            const savedDownlink = await prisma.downlinkdevice.create({
                data: {
                    downlinkController:data.downlinkController,
                    classType:data.classType,
                    devEui:data.devEui,
                    pdu:data.pdu,
                    port: packet["Port"],
                    payload: packet["Payload"],
                    deviceId: data.deviceId
                }
            });
            console.log("Saved Downlink Device:", savedDownlink);
            const autoDownlinkWithdelay = await prisma.autoDownlinkWithDelay.create({
                data: payloadDataForAutoDownlink
            });
            console.log("Saved autoDownlinkWithDelay:", autoDownlinkWithdelay);
        }

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error("Error:", error);
        res.status(error.response?.status || 500).json({
            message: 'Error sending data to SenRa',
            details: error.response?.data || error.message
        });
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

const getDownlinkDatabyDeviceId = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch the most recent downlink data, ordered by the timestamp field (e.g., createdAt)
        const getDownlink = await prisma.downlinkdevice.findMany({
            where: {
                devEui: id,
            },
            orderBy: {
                createdAt: 'desc', // or use the appropriate field that tracks the latest data
            },
        });

        // If no downlink data is found
        if (!getDownlink) {
            return res.status(404).json({ status: false, message: 'No downlink data found' });
        }

        // Return the most recent downlink data with a success status
        return res.status(200).json({ status: true, data: getDownlink });
    } catch (error) {
        // If there is an error, return a 500 Internal Server Error
        return res.status(500).json({ status: false, message: error.message });
    }
};


const getDownlinkData = async (req, res) => {
    try {
        const getDownlink = await prisma.downlinkDevice.findMany();
        if (!getDownlink) {
            return res.status(404).json({ status: false, message: 'No downlink data found' });
        }

        return res.status(200).json({ status: true, data: getDownlink });
    } catch (error) {
        return res.status(404).json({ status: false, message: error.message });
    }
}


// const getDownlinkByDeviceId = async (req, res) => {
//     try {
//         if (!req.params.id) {
//             return res.status(400).json({ status: false, message: 'Device EUI is required' });
//         }
//         const getDownlink = await prisma.downlinkDevice.findMany({
//             where: {
//                 devEui: req.params.id
//             },
//             include:{
//                 device:true
//             },
//             orderBy: {
//                 id: 'desc'
//             }
//         });
//         if (!getDownlink) {
//             return res.status(404).json({ status: false, message: 'No downlink data found' });
//         }

//         return res.status(200).json({ status: true, data: getDownlink });
//     } catch (error) {
//         return res.status(404).json({ status: false, message: error.message });
//     }
// }

const getDownlinkByDeviceId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: false, message: 'Device EUI is required' });
        }

        const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default pageSize to 10 if not provided
        const currentPage = parseInt(req.query.pageNo, 10) || 1;  // Default pageNo to 1 if not provided

        // Count the total number of downlinks for the provided device EUI
        const total = await prisma.downlinkDevice.count({
            where: {
                devEui: id
            }
        });

        // Calculate pagination details
        const totalPages = Math.ceil(total / pageSize);
        const skip = (currentPage - 1) * pageSize;
        const take = pageSize;

        // Fetch paginated downlink data
        const downlinkData = await prisma.downlinkDevice.findMany({
            where: {
                devEui: id,
            },
            include: { device: true },
            orderBy: { id: 'desc' },
            skip: skip,
            take: take,
        });

        if (!downlinkData.length) {
            return res.status(404).json({ status: false, message: 'No downlink data found' });
        }

        return res.status(200).json({
            status: true,
            data: downlinkData,
            pagination: {
                totalItems: total,
                currentPage: currentPage,
                totalPages: totalPages,
                pageSize: pageSize
            }
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};





module.exports = {
    postDownlinkDevice,
    getDownlinkData,
    getDownlinkByDeviceId,
    getDownlinkDatabyDeviceId,// all data.
}