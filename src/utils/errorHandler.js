// src/middlewares/errorHandler.js

const logger = require('../utils/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error details
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const statusCode = err.statusCode || 500; // Default to 500 if no status code is set

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
