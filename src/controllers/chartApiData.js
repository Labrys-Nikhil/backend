// const moment = require("moment");
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function fetchAndSortData(output, devices,projectId) {
//     try {
//         // Find devEui
//         const fetchdevEui = await prisma.device.findFirst({
//             where: {
//                 id: parseInt(devices[0]), // Ensure it's a valid number
//                 projectId:parseInt(projectId)
//             },
//         });

//         if (!fetchdevEui) {
//             throw new Error(`No device found with ID: ${devices[0]}`);
//         }

//         const devEui = fetchdevEui.devEui;

//         // Query device decoded data
//         const externalResponse = await prisma.devicedecodedata.findMany({
//             where: {
//                 attributesName: String(output),
//                 devEui: devEui, // Use the fetched devEui
//             },
//             orderBy: {
//                 timestamp: "desc", // Sort by descending timestamp
//             },
//         });

//         // Validate the response
//         if (!externalResponse || externalResponse.length === 0) {
//             throw new Error("No data found for the given devEui and output.");
//         }

//         // Use moment to format timestamps
//         const formattedResponse = externalResponse.map((item) => ({
//             ...item,
//             formattedTimestamp: moment(item.timestamp).format("YYYY-MM-DD HH:mm"), // Shorter format
//         }));

//         // Structure the response
//         return {
//             label: formattedResponse.map((item) => item.formattedTimestamp), // Use formatted timestamps for labels
//             data: formattedResponse.map((item) => parseFloat(item.attributesValue)),
//             // message: "Data fetched and sorted successfully.",
//         };
//     } catch (error) {
//         console.error("Error in fetchAndSortData:", error);
//         throw new Error("Failed to fetch and sort data.");
//     }
// }

// async function fetchTheRecentData(output, devices,projectId) {
//     try {
//         // Store results for all devices
//         const recentData = [];
//         console.log("Starting data fetch for devices:", devices);

//         // Use a for...of loop for proper async handling
//         for (const deviceId of devices) {
//             try {
//                 console.log(`Fetching devEui for device ID: ${deviceId}`);

//                 // Fetch devEui for the current device
//                 const fetchdevEui = await prisma.device.findUnique({
//                     where: {
//                         id: parseInt(deviceId), // Ensure it's a valid number
//                         projectId:parseInt(projectId)
//                     }
//                 });

//                 if (!fetchdevEui) {
//                     console.warn(`No device found with ID: ${deviceId}`);
//                     // Add an empty response for this device
//                     recentData.push({
//                         deviceId,
//                         name: "",
//                         attributesValue:"",
//                     });
//                     continue; // Skip this device and move to the next
//                 }

//                 console.log(`Found devEui for device ID ${deviceId}: ${fetchdevEui.deviceId}`);
//                 console.log(`Found devEui for device ID ${deviceId}: ${fetchdevEui.name}`);
//                 // Fetch the most recent decoded data for the current device
//                 console.log(`Fetching decoded data for device with devEui: ${fetchdevEui.deviceId} and output: ${output}`);
//                 const externalResponse = await prisma.devicedecodedata.findFirst({
//                     where: {
//                         attributesName: String(output),
//                         devEui: fetchdevEui.deviceId, // Use the value directly here
//                     },
//                     orderBy: {
//                         timestamp: "desc", // Sort by descending timestamp
//                     },
//                 });
//                 console.log("externalResponse",externalResponse);

//                 if (!externalResponse) {
//                     console.warn(`No data found for device with devEui: ${fetchdevEui.deviceId}`);
//                     // Add an empty response for this device
//                     recentData.push({
//                         deviceId,
//                         name: fetchdevEui.name,
//                         attributesValue: "0",
//                     });
//                     continue;
//                 }

//                 console.log(`Data found for device ID ${deviceId}:`, externalResponse);

//                 // Add formatted data to the results
//                 recentData.push({
//                     deviceId,
//                     name:fetchdevEui.name,
//                     attributesValue: externalResponse.attributesValue,
//                 });
//                 console.log(`Added data for device ID ${deviceId} to results`);
//             } catch (error) {
//                 console.error(`Error fetching data for device ID: ${deviceId}`, error);
//             }
//         }

//         // Structure the final response
//         console.log("Data fetching complete. Structuring response...");
//         return {
//             label: recentData.map((item) => item.name),
//             data: recentData.map((item)=> parseInt(item.attributesValue)),
//             message: `Data fetched for ${recentData.length} devices.`,
//         };
//     } catch (error) {
//         console.error("Error in fetchTheRecentData:", error);
//         throw new Error("Failed to fetch data for multiple devices from external API.");
//     }
// }

// const chartApiData = async (req, res) => {
//     const { output, devices } = req.query;
//     const {projectId} = req.params;

//     console.log("projectId url wali",projectId);

//     // Validate the request
//     if (!output || !devices || !projectId) {
//         return res.status(400).json({ error: "Invalid request. Please provide 'output' and 'devices' as query parameters." });
//     }

//     try {
//         // Split the comma-separated device string into an array of device IDs
//         const devicesArray = devices.split(',').map(id => parseInt(id, 10));

//         let result;

//         // Call the appropriate function based on the number of devices
//         if (devicesArray.length < 2) {
//             result = await fetchAndSortData(output, devicesArray,projectId);
//         } else {
//             result = await fetchTheRecentData(output, devicesArray,projectId);
//         }

//         // Return the structured response
//         res.json(result);
//     } catch (error) {
//         console.error("Error in /api/custom route:", error);
//         res.status(500).json({ error: "Internal server error." });
//     }
// };
// module.exports = { chartApiData }
const moment = require("moment");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {subDays} = require('date-fns');

async function fetchAndSortData(output, devices, projectId, duration) {
    try {
        console.log("Fetching devEui for device ID:", devices[0]);

        // Find devEui
        const fetchdevEui = await prisma.device.findFirst({
            where: {
                id: parseInt(devices[0]), // Ensure it's a valid number
                projectId: parseInt(projectId),
            },
        });

        if (!fetchdevEui) {
            console.error(`Device not found for ID: ${devices[0]}`);
            throw new Error(`No device found with ID: ${devices[0]}`);
        }

        const devEui = fetchdevEui.deviceId;
        console.log("devEui fetched:", devEui);

        // Query device decoded data
        const externalResponse = await prisma.devicedecodedata.findMany({
            where: {
                attributesName: String(output),
                devEui: devEui, // Use the fetched devEui
                timestamp: {
                    gte: subDays(new Date(), Number.parseInt(duration))
                }
            },

            orderBy: {
                timestamp: "desc", // Sort by descending timestamp
            },
        });

        console.log("Decoded data fetched:", externalResponse.length, "records found.");

        // Validate the response
        if (!externalResponse || externalResponse.length === 0) {
            console.error("No data found for the given devEui and output.");
            throw new Error("No data found for the given devEui and output.");
        }

        // Use moment to format timestamps
        const formattedResponse = externalResponse.map((item) => ({
            ...item,
            formattedTimestamp: moment(item.timestamp).format("YYYY-MM-DD HH:mm"), // Shorter format
        }));

        console.log("Data formatted successfully.");

        // Structure the response
        return {
            label: formattedResponse.map((item) => item.formattedTimestamp),
            data: formattedResponse.map((item) => parseFloat(item.attributesValue)),
        };
    } catch (error) {
        console.error("Error in fetchAndSortData:", error.message);
        throw new Error("Failed to fetch and sort data.");
    }
}

async function fetchTheRecentData(output, devices, projectId) {
    try {
        console.log("Fetching data for devices:", devices);

        // Store results for all devices
        const recentData = [];

        for (const deviceId of devices) {
            try {
                console.log(`Fetching devEui for device ID: ${deviceId}`);

                // Fetch devEui for the current device
                const fetchdevEui = await prisma.device.findUnique({
                    where: {
                        id: parseInt(deviceId), // Ensure it's a valid number
                        projectId: parseInt(projectId),
                    },
                });

                if (!fetchdevEui) {
                    console.warn(`No device found for ID: ${deviceId}`);
                    recentData.push({ deviceId, name: "", attributesValue: "0" });
                    continue;
                }

                console.log(`devEui fetched for device ID ${deviceId}:`, fetchdevEui.deviceId);

                // Fetch the most recent decoded data for the current device
                const externalResponse = await prisma.devicedecodedata.findFirst({
                    where: {
                        attributesName: String(output),
                        devEui: fetchdevEui.deviceId,
                    },
                    orderBy: {
                        timestamp: "desc",
                    },
                });

                if (!externalResponse) {
                    console.warn(`No decoded data found for devEui: ${fetchdevEui.deviceId}`);
                    recentData.push({ deviceId, name: fetchdevEui.name, attributesValue: "0" });
                    continue;
                }

                console.log(`Decoded data found for device ID ${deviceId}:`, externalResponse);

                recentData.push({
                    deviceId,
                    name: fetchdevEui.name,
                    attributesValue: externalResponse.attributesValue,
                });
            } catch (error) {
                console.error(`Error fetching data for device ID: ${deviceId}`, error.message);
            }
        }

        console.log("Data fetching for all devices complete.");

        // Structure the final response
        return {
            label: recentData.map((item) => item.name),
            data: recentData.map((item) => parseInt(item.attributesValue)),
            message: `Data fetched for ${recentData.length} devices.`,
        };
    } catch (error) {
        console.error("Error in fetchTheRecentData:", error.message);
        throw new Error("Failed to fetch data for multiple devices from external API.");
    }
}

const chartApiData = async (req, res) => {
    const { output, devices, duration } = req.query;
    const { projectId } = req.params;

    console.log("API called with output:", output, "devices:", devices, "projectId:", projectId, "duration:", duration);

    if (!output || !devices || !projectId ) {
        console.error("Invalid request parameters:", { output, devices, projectId, duration });
        return res.status(400).json({ error: "Invalid request. Please provide 'output', 'devices', 'projectId'and 'duration'" });
    }

    try {
        const devicesArray = devices.split(',').map(id => parseInt(id, 10));
        console.log("Parsed devices:", devicesArray);

        let result;

        if (devicesArray.length < 2) {
            console.log("Single device detected. Fetching and sorting data.");
            result = await fetchAndSortData(output, devicesArray, projectId, duration);
        } else {
            console.log("Multiple devices detected. Fetching the most recent data.");
            result = await fetchTheRecentData(output, devicesArray, projectId);
        }

        console.log("Response prepared. Sending data back.");
        res.json(result);
    } catch (error) {
        console.error("Error in chartApiData handler:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { chartApiData };

