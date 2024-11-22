const notificationService = require('../services/notificationService');

// Controller function to get all notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getAllNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error in getNotifications controller:', error);
        res.status(500).json({ error: 'Failed to fetch notifications. Please try again later.' });
    }
};

const getNotificationsByProjectId = async (req, res) => {
    const { projectId } = req.params; // Extracting projectId correctly
    try {
        const notifications = await notificationService.getAllNotificationsByProjectId({ projectId });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error in getNotifications controller:', error);
        res.status(500).json({ error: 'Failed to fetch notifications. Please try again later.' });
    }
};


module.exports = { getNotifications,getNotificationsByProjectId};
