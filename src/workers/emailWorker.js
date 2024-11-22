// File: workers/emailWorker.js
const Queue = require('bull');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

const emailQueue = new Queue('emailQueue');

emailQueue.process(async (job) => {
  const { name, email, userId } = job.data;
  try {
    await emailService.sendVerificationMail(name, email, userId);
    logger.info(`Email sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
  }
});

module.exports = emailQueue;
