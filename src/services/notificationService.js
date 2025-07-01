const { prisma } = require('../lib/prisma.js');
const logger = require('../utils/logger');

// Fetch all notifications from the database, ordered by createdAt in descending order
const getAllNotifications = async () => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                device: {  
                    select: {
                        name: true,
                        deviceId: true,
                        projectId:true // Fetching only the device name
                    }
                }
            }
        });
        logger.info('Fetched notifications successfully');
        return notifications;
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications');
    }
};
const getAllNotificationsByProjectId = async ({ projectId }) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                device: {
                    
                    projectId: Number(projectId) // Nested condition to match projectId in device
                    
                }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                device: {
                    select: {
                        name: true,
                        deviceId: true, // Fetching only the device name and ID
                        projectId:true
                    },
                }
            }
        });
        logger.info('Fetched notifications successfully');
        return notifications;
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications');
    }
};


  const getNotificationsByDeviceId = async (deviceId) => {
    try {
      // Fetch notifications from the database based on deviceId
      const notifications = await prisma.notification.findMany({
        where: {
          deviceId: deviceId,
        },
        include: {
          device: true, // Optionally include device details
          alerts: true, // Optionally include alert details
        },
      });

      return notifications;
    } catch (error) {
      throw new Error("Failed to fetch notifications: " + error.message);
    }
  };

module.exports = { getAllNotifications,getAllNotificationsByProjectId, getNotificationsByDeviceId };

