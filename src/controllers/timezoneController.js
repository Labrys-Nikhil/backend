// controllers/timezoneController.js

const timezoneService = require('../services/timezoneService');

// Create a new timezone
const createTimezone = async (req, res) => {
    try {
        const { name, offset } = req.body;
        const timezone = await timezoneService.createTimezone(name, offset);
        res.status(201).json(timezone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating timezone" });
    }
};

// Get all timezones
const getAllTimezones = async (req, res) => {
    try {
        const timezones = await timezoneService.getAllTimezones();
        res.status(200).json(timezones);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving timezones" });
    }
};

// Get a timezone by ID
const getTimezoneById = async (req, res) => {
    try {
        const { id } = req.params;
        const timezone = await timezoneService.getTimezoneById(parseInt(id));
        if (timezone) {
            res.status(200).json(timezone);
        } else {
            res.status(404).json({ error: "Timezone not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error retrieving timezone" });
    }
};

// Update a timezone
const updateTimezone = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, offset } = req.body;
        const timezone = await timezoneService.updateTimezone(parseInt(id), name, offset);
        res.status(200).json(timezone);
    } catch (error) {
        res.status(500).json({ error: "Error updating timezone" });
    }
};

// Delete a timezone
const deleteTimezone = async (req, res) => {
    try {
        const { id } = req.params;
        await timezoneService.deleteTimezone(parseInt(id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error deleting timezone" });
    }
};



module.exports = {
    createTimezone,
    getAllTimezones,
    getTimezoneById,
    updateTimezone,
    deleteTimezone,
}