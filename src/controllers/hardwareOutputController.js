const hardwareOutputService = require('../services/hardwareOutputService');

const createHardwareOutput = async (req, res) => {
    const hardwareData = req.body;
    try {
        const newHardwareOutputs = await hardwareOutputService.createHardwareOutputs(hardwareData);
        res.status(201).json({ success: true, data: newHardwareOutputs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating HardwareOutputs', error: error.message });
    }
};

const getAllHardwareOutputs = async (req, res) => {
    try {
        const hardwareOutputs = await hardwareOutputService.getAllHardwareOutputs();
        res.status(200).json({ success: true, data: hardwareOutputs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving HardwareOutputs', error: error.message });
    }
};

const getHardwareOutputById = async (req, res) => {
    const { id } = req.params;
    try {
        const hardwareOutput = await hardwareOutputService.getHardwareOutputById(parseInt(id));
        if (!hardwareOutput) {
            return res.status(404).json({ success: false, message: 'HardwareOutput not found' });
        }
        res.status(200).json({ success: true, data: hardwareOutput });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving HardwareOutput', error: error.message });
    }
};

const updateHardwareOutput = async (req, res) => {
    const { id } = req.params;
    const hardwareOutputData = req.body;
    try {
        const updatedHardwareOutput = await hardwareOutputService.updateHardwareOutput(parseInt(id), hardwareOutputData);
        if (!updatedHardwareOutput) {
            return res.status(404).json({ success: false, message: 'HardwareOutput not found' });
        }
        res.status(200).json({ success: true, data: updatedHardwareOutput });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating HardwareOutput', error: error.message });
    }
};

const deleteHardwareOutput = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedHardwareOutput = await hardwareOutputService.deleteHardwareOutput(parseInt(id));
        if (!deletedHardwareOutput) {
            return res.status(404).json({ success: false, message: 'HardwareOutput not found' });
        }
        res.status(200).json({ success: true, message: 'HardwareOutput deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting HardwareOutput', error: error.message });
    }
};

module.exports = {
    createHardwareOutput,
    getAllHardwareOutputs,
    getHardwareOutputById,
    updateHardwareOutput,
    deleteHardwareOutput,
};
