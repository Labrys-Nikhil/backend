const outputService = require('../services/outputService')

const createOutput = async (req, res) => {
    try {
        const outputData = req.body;
        const newOutput = await outputService.createOutput(outputData)

        res.status(201).json({ success: true, data: newOutput })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get all Outputs
const getAllOutputs = async (req, res) => {
    try {
        const outputs = await outputService.getAllOutputs();
        res.status(200).json({ success: true, data: outputs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving outputs', error });
    }
};

// Get an Output by ID
const getOutputById = async (req, res) => {
    try {
        const { id } = req.params;
        const output = await outputService.getOutputById(id);
        if (output) {
            res.status(200).json({ success: true, data: output });
        } else {
            res.status(404).json({ success: false, message: 'Output not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving output', error });
    }
};

// Update an Output by ID
const updateOutput = async (req, res) => {
    try {
        const { id } = req.params;
        const outputData = req.body;
        
        const updatedOutput = await outputService.updateOutput(id, outputData);
        res.status(200).json({ success: true, data: updatedOutput });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating output', error });
    }
};

// Delete an Output by ID
const deleteOutput = async (req, res) => {
    try {
        const { id } = req.params;
        await outputService.deleteOutput(id);
        res.status(200).json({ success: true, message: 'Output deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting output', error });
    }
};

module.exports = {
    createOutput,
    getAllOutputs,
    getOutputById,
    updateOutput,
    deleteOutput,
};
