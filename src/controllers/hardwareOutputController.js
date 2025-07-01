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

const getAllHardwareOutputsByCustomerId = async (req, res) => {
    const customerId  = req.user.id; // Get customerId from URL params
    try {
        const hardwareOutputs = await hardwareOutputService.getAllHardwareOutputsByCustomerId(parseInt(customerId));
        if (hardwareOutputs.length === 0) {
            return res.status(404).json({ message: "No hardware outputs found for the given customerId." });
        }
        res.json(hardwareOutputs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getHardwareOutputById = async (req, res) => {
    try {
        const { id } = req.params; // Assuming IDs are passed as a query parameter (e.g., ?ids=1,2,3)

        if (!id || typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid request format. IDs should be a comma-separated string.",
            });
        }

        // Convert "1,2,3" -> [1, 2, 3]
        const parsedIds = id.split(",").map(id => parseInt(id)).filter(id => !isNaN(id));

        if (parsedIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid ID values provided",
            });
        }

        const outputs = await hardwareOutputService.getHardwareOutputById(parsedIds);

        if (!outputs || outputs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No output found for the provided IDs",
            });
        }

        return res.status(200).json({
            success: true,
            data: outputs,
            message: "Outputs fetched successfully",
        });
    } catch (error) {
        console.error("Error in getHardwareOutputByIds Controller:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching outputs",
        });
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

const getHardwareOutputByhardwareId = async (req, res) => {
    try {
        const { hardwareId } = req.params; // Get hardwareId from URL params
        const hardwareOutputs = await hardwareOutputService.getHardwareOutputByhardwareId(parseInt(hardwareId));

        if (hardwareOutputs.length === 0) {
            return res.status(404).json({ message: "No hardware outputs found for the given hardwareId." });
        }

        res.json(hardwareOutputs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createHardwareOutput,
    getAllHardwareOutputs,
    getHardwareOutputById,
    updateHardwareOutput,
    deleteHardwareOutput,
    getHardwareOutputByhardwareId,
    getAllHardwareOutputsByCustomerId
};

