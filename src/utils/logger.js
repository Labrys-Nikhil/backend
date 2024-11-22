// src/utils/logger.js

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Logger configuration
const logger = createLogger({
  format: combine(
    colorize(), // Add color to log levels (info, warn, error)
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
    logFormat // Custom log format
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }) // Log errors to file
  ],
});

// Export the logger instance
module.exports = logger;
