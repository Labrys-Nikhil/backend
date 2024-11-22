// server.js
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const customerRoutes = require('./routes/customerRoutes');
const errorHandler = require('./utils/errorHandler');
const path = require('path');
const prisma = require('./config/database');
require('dotenv').config();

// Import the checkDownlinkStatuses function from downlinkJob.js
const { checkDownlinkStatuses } = require('./controllers/downlinkJob'); // Correctly import the module

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Allows any origin
app.use(express.static(path.join(__dirname, 'public')));

// Mount the customer routes
app.use('/api', customerRoutes);

app.use(errorHandler);

// Check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
}

// Schedule a cron job to check downlink statuses every minute
cron.schedule('* * * * *', () => {
  console.log('Running cron job to check downlink statuses...');
  checkDownlinkStatuses(); // Call the function to check downlink statuses
});

// Start the server and check the database connection
app.listen(process.env.PORT, async () => {
  await checkDatabaseConnection();
  console.log(`Server is running on port ${process.env.PORT}`);
});
