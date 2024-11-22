// src/controllers/alertController.js
const alertsService = require('../services/alertService');

const getAllAlerts = async (req, res) => {
    try {
        const alerts = await alertsService.getAllAlerts();
        return res.status(200).json(alerts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createAlert = async (req, res) => {
    try {
        const { deviceId, operator, value, bitwiseOperator, readingBeforeAlerts,name } = req.body;

        // Create the alert with the provided data
        const alertData = {
            name,
            deviceId,
            operator,
            value,
            bitwiseOperator,
            readingBeforeAlerts,
        };

        const newAlert = await alertsService.createAlert(alertData);
        return res.status(201).json(newAlert);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllAlertsByProjectId = async (req, res) => {
    const { projectId } = req.params; 
    console.log(projectId); // Ensure projectId is logged correctly
    try {
        // Pass projectId wrapped in an object
        const alerts = await alertsService.getAllAlertsByProjectId({ projectId });
        return res.status(200).json({ data: alerts }); // Wrap in a data object
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllAlerts, getAllAlertsByProjectId,createAlert };
