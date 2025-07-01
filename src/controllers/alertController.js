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
        const { deviceId, operator, value, bitwiseOperator, readingBeforeAlerts,alertName } = req.body;

        // Create the alert with the provided data
        const alertData = {
            name:alertName,
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

const updateAlertById = async (req,res)=>{
    try {
        const {  operator, value, bitwiseOperator, readingBeforeAlerts, alertName } = req.body;
        const{alertId} = req.params;
        
        const alerts = await alertsService.updateAlert({ data:req.body, alertId:alertId });
        return res.status(200).json({ data: alerts }); // Wrap in a data object
    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteAlert = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedAlert = await alertsService.deleteAlert(id);
      return res.status(200).json({
        data: deletedAlert,
        message: 'Alert and Notification deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error deleting alert',
      });
    }
};
module.exports = { getAllAlerts, getAllAlertsByProjectId,createAlert,updateAlertById,deleteAlert };

