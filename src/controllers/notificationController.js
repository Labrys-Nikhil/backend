const notificationService = require('../services/notificationService');
const moment = require("moment");
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

// Controller function to get notifications by deviceId
const getNotificationsByDeviceId = async (req, res) => {
    const { deviceId } = req.params; // Extracting deviceId from the request params
    // Convert deviceId to an integer
const deviceIdInt = parseInt(deviceId, 10);
    try {
        const notifications = await notificationService.getNotificationsByDeviceId(deviceIdInt);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error in getNotificationsByDeviceId controller:', error);
        res.status(500).json({ error: 'Failed to fetch notifications by deviceId. Please try again later.' });
    }
};


const getPaginatedNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, dateFilter, deviceId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};

    // Filter by deviceId
    if (deviceId) {
      where.deviceId = parseInt(deviceId);
    }

    // Date filter logic (if any)
    const moment = require("moment");
    const today = moment().startOf("day");
    const tomorrow = moment().add(1, "day").startOf("day");

    if (dateFilter === "today") {
      where.createdAt = {
        gte: today.toDate(),
        lt: moment(today).add(1, "day").toDate(),
      };
    } else if (dateFilter === "tomorrow") {
      where.createdAt = {
        gte: tomorrow.toDate(),
        lt: moment(tomorrow).add(1, "day").toDate(),
      };
    } else if (dateFilter === "last7days") {
      where.createdAt = {
        gte: moment().subtract(7, "days").startOf("day").toDate(),
      };
    } else if (dateFilter === "lastMonth") {
      where.createdAt = {
        gte: moment().subtract(1, "months").startOf("month").toDate(),
      };
    } else if (dateFilter === "last3Months") {
      where.createdAt = {
        gte: moment().subtract(3, "months").startOf("month").toDate(),
      };
    } else if (dateFilter === "last6Months") {
      where.createdAt = {
        gte: moment().subtract(6, "months").startOf("month").toDate(),
      };
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        where,
        orderBy: { createdAt: "desc" },
        include: { device: true },
      }),
      prisma.notification.count({ where }),
    ]);

    return res.json({
      data: notifications,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};



module.exports = { getNotifications,getNotificationsByProjectId, getNotificationsByDeviceId, getPaginatedNotifications};

