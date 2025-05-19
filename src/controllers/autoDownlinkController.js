const autoDownlinkService = require('../services/autoDownlinkService');
// Create a new AutoDownlink
const createAutoDownlink =  async (req, res) => {
    const { alertId, timeout, schedule, port, controllerList, classType, device, controllerValue } = req.body;
    console.log("------------------->",req.body);

    try {
        const autoDownlink = await autoDownlinkService.createAutoDownlink(
            alertId, timeout, schedule, port, controllerList, classType, device, controllerValue
        );
        res.status(201).json(autoDownlink);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get AutoDownlink by alertId
const getAutoDownlinkByAlertId =  async (req, res) => {
    const { alertId } = req.params;

    try {
        const autoDownlink = await autoDownlinkService.getAutoDownlinkByAlertId(alertId);
        res.status(200).json(autoDownlink);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error.message });
    }
};

// Update AutoDownlink by alertId
const updateAutoDownlink = async (req, res) => {
    const { alertId } = req.params;
    const updateData = req.body;

    try {
        const updatedAutoDownlink = await autoDownlinkService.updateAutoDownlink(alertId, updateData);
        res.status(200).json(updatedAutoDownlink);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete AutoDownlink by alertId
const deleteAutoDownlink =  async (req, res) => {
    const { alertId } = req.params;

    try {
        const deletedAutoDownlink = await autoDownlinkService.deleteAutoDownlink(alertId);
        res.status(200).json({ message: 'AutoDownlink deleted successfully', data: deletedAutoDownlink });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {deleteAutoDownlink,updateAutoDownlink,getAutoDownlinkByAlertId,createAutoDownlink};

