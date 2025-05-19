// src/services/alertsService.js
const { PrismaClient } = require('@prisma/client');
const { autodownlink } = require('../config/database');
const prisma = new PrismaClient();

const getAllAlerts = async () => {
    try {
        const alerts = await prisma.alerts.findMany({
            include: {
                device: true, // Include device data if needed
            },
        });
        return alerts; 
    } catch (error) {
        throw new Error('Failed to retrieve alerts: ' + error.message);
    }
}

// const getAllAlertsByProjectId = async ({ projectId }) => {
//     try {
//         const alerts = await prisma.alerts.findMany({
//             where: {
//                 device: {
//                     projectId: Number(projectId) // Make sure to cast to Number if projectId is an integer
//                 }
//             },
//             include: {
//                 device: true, // Include device data
//                 autodownlink: true
//             },
//         });

//         // Map alerts to return only necessary fields
//         const filteredAlerts = alerts.map(alert => ({
//             id: alert.id,
//             name:alert.name,
//             deviceId: alert.deviceId,
//             operator: alert.operator,
//             value: alert.value,
//             bitwiseOperator: alert.bitwiseOperator,
//             readingBeforeAlerts: alert.readingBeforeAlerts,
//             device: alert.device ? {
//                 id: alert.device.id,
//                 name: alert.device.name,
//                 manufacture: alert.device.manufacture,
//                 deviceLocation: alert.device.deviceLocation,
//                 currentLocation: alert.device.currentLocation,
//                 hardwareId: alert.device.hardwareId,
//                 networkId: alert.device.networkId,
//                 organizationId: alert.device.organizationId,
//                 projectId: alert.device.projectId,
//                 hardwareOutputId: alert.device.hardwareOutputId,
//                 deviceId: alert.device.deviceId,
//                 location: alert.device.location,
//                 hardwareType: alert.device.hardwareType,
//                 network: alert.device.network
//             } : null,
//             autodownlink:alert.autodownlink ?{

//             }
//         }));

//         return filteredAlerts; // Return the formatted alerts
//     } catch (error) {
//         throw new Error('Failed to retrieve alerts: ' + error.message);
//     }
// }
const getAllAlertsByProjectId = async ({ projectId }) => {
    try {
        const alerts = await prisma.alerts.findMany({
            where: {
                device: {
                    projectId: Number(projectId), // Ensure projectId is an integer
                },
            },
            include: {
                device: true, // Include device data
                autodownlink: true, // Include autodownlink data
            },
        });

        // Map alerts to return only necessary fields
        const filteredAlerts = alerts.map(alert => ({
            id: alert.id,
            name: alert.name,
            deviceId: alert.deviceId,
            operator: alert.operator,
            value: alert.value,
            bitwiseOperator: alert.bitwiseOperator,
            readingBeforeAlerts: alert.readingBeforeAlerts,
            device: alert.device ? {
                id: alert.device.id,
                name: alert.device.name,
                manufacture: alert.device.manufacture,
                deviceLocation: alert.device.deviceLocation,
                currentLocation: alert.device.currentLocation,
                hardwareId: alert.device.hardwareId,
                networkId: alert.device.networkId,
                organizationId: alert.device.organizationId,
                projectId: alert.device.projectId,
                hardwareOutputId: alert.device.hardwareOutputId,
                deviceId: alert.device.deviceId,
                location: alert.device.location,
                hardwareType: alert.device.hardwareType,
                network: alert.device.network,
            } : null,
            autodownlink: alert.autodownlink ? {
                id: alert.autodownlink.id,
                timeout: alert.autodownlink.timeout,
                schedule: alert.autodownlink.schedule,
                port: alert.autodownlink.port,
                downlinkController: alert.autodownlink.downlinkController,
                classType: alert.autodownlink.classType,
                devEui: alert.autodownlink.devEui,
                pdu: alert.autodownlink.pdu,
                createdAt: alert.autodownlink.createdAt,
            } : null,
        }));

        return filteredAlerts; // Return the formatted alerts
    } catch (error) {
        throw new Error('Failed to retrieve alerts: ' + error.message);
    }
};



// Function to create a new alert
const createAlert = async (alertData) => {
    try {
        let alertName = alertData.name;
        console.log("alertName agaya hai bhai",alertName);

        // If the user does not provide a name (check if alertName is not undefined or empty)
        if (!alertName || alertName.trim().length === 0) {
            const lastAlert = await prisma.alerts.findFirst({
                orderBy: { id: 'desc' },
            });
            const nextAlertNumber = lastAlert ? lastAlert.id + 1 : 1;
            alertName = `Alert ${nextAlertNumber}`;
        }

        const newAlert = await prisma.alerts.create({
            data: {
                name: alertName,
                deviceId: alertData.deviceId,
                operator: alertData.operator,
                value: alertData.value,
                bitwiseOperator: alertData.bitwiseOperator,
                readingBeforeAlerts: alertData.readingBeforeAlerts,
            },
            include: {
                device: true,
            },
        });
        return newAlert;
    } catch (error) {
        throw new Error('Failed to create alert: ' + error.message);
    }
};

const updateAlert = async({data,alertId})=>{

    try {
        const alertUpdate = await prisma.alerts.update({
            where: {
                id: Number(alertId)
            },
            data:{
                name: data.alertName,
                deviceId: data.deviceId,
                operator: data.operator,
                value: Number(data.value),
                bitwiseOperator: data.bitwiseOperator,
                readingBeforeAlerts: Number(data.readingBeforeAlerts),
            }
        });

        return alertUpdate;
    } catch (error) {
        throw new Error('Failed to update alert: ' + error.message);
    }
}


module.exports = { getAllAlerts, getAllAlertsByProjectId, createAlert,updateAlert};


