
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { mapLoriotPayloadToNativeModel } = require('../helper/deviceSeverDataMapping');

const deviceService = require("../services/deviceServerData")

;
const fetchAndStoreUplinkMessages = async (req, res) => {
    console.log("Received uplink request.");
    try {
        const uplinkData = req.body;
        console.log("Request body received:", { uplinkData });

        // Call mapping function
        const data = mapLoriotPayloadToNativeModel(uplinkData);
        console.log("Mapped uplink data:", { data });

        const newDevice = await deviceService.createDevice(data);
        console.log("Device created successfully:", { newDevice });

        res.status(201).json(newDevice);
        console.log("Uplink messages processed and stored successfully.");
    } catch (error) {
        console.log("Error processing uplink message:", { error: error.message });
        return res.status(500).json({ error: 'Failed to process uplink message' });
    }
};

const downlinkLoriot = async (req, res) => {

    console.log("Received downlink request.");
    const { EUI, port, confirmed, priority, data, appid } = req.body;
    console.log("Request body received:", { EUI, port, confirmed, priority, data, appid });

    try {

        const device = await prisma.device.findFirst({
            where: { deviceId: EUI },
        });

        if (!device) {
            console.log("Device not found in loriot downlink.");
            return res.status(400).json({ error: 'Invalid: device not found in loriot downlink' });
        }

        console.log("Device found:", { device });
        console.log(device.networkId);
        // Fetch network details
        const network = await prisma.networkdata.findFirst({
            where: {
                networkId: device.networkId, // Use networkId from selected fields
            },
        });

        if (!network) {
            console.log("Network not found for the given device.");
            return res.status(400).json({ error: 'Invalid: network not found' });
        }

        console.log("Network found:", { network });


        const servername = network.hostname;
        const serverToken = network.token;
        console.log("Fetched network details:", { servername });

        const fullServerName = `${servername}.loriot.io`;
        const baseUrl = `https://${fullServerName}/1/rest`;
        console.log("Constructed base URL:", { baseUrl });

        // Prepare downlink payload
        const payload = { cmd: 'tx', EUI, port, confirmed, priority, data, appid };
        console.log("Downlink payload:", { payload });

        // Send downlink request
        const response = await axios.post(baseUrl, payload, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${serverToken}` },
        });

        console.log("Downlink API response:", { response: response });

        // return res.status(200).json({ message: 'Downlink sent successfully', data: response.data });

        return response;
    } catch (error) {
        console.log("Error processing downlink:", { error: error.message });
	return error;
	    //    return res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
};

module.exports = { fetchAndStoreUplinkMessages, downlinkLoriot };
