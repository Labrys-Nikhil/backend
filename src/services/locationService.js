
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fetchDecodedDataByDateTime = async (devEui, startDate, endDate, startTime, endTime) => {
  console.log('Fetching data for devEui:', devEui);
  console.log('Start Date:', startDate, 'End Date:', endDate);
  console.log('Start Time:', startTime, 'End Time:', endTime);

  try {
    let whereCondition = { devEui }; // Initialize where condition with devEui

    // Handle combinations of startDate, endDate, startTime, and endTime
    if (startDate && endDate) {
      // If only dates are provided
      whereCondition.timestamp = {
        gte: new Date(`${startDate}T00:00:00Z`), // Start of the startDate
        lte: new Date(`${endDate}T23:59:59Z`),  // End of the endDate
      };
    } else if (startTime && endTime) {
      // If only times are provided
      const today = new Date().toISOString().split('T')[0]; // Use today's date for time filtering
      whereCondition.timestamp = {
        gte: new Date(`${today}T${startTime}Z`),
        lte: new Date(`${today}T${endTime}Z`),
      };
    } else if (startDate && startTime && endDate && endTime) {
      // If both dates and times are provided
      whereCondition.timestamp = {
        gte: new Date(`${startDate}T${startTime}Z`),
        lte: new Date(`${endDate}T${endTime}Z`),
      };
    } else {
      // If none or partial combinations of inputs are provided
      throw new Error('Invalid combination of startDate, endDate, startTime, and endTime');
    }

    console.log('Prisma where condition:', whereCondition);

    // Query the database
    const decodedData = await prisma.devicedecodedata.findMany({
      where: whereCondition,
      orderBy: { timestamp: 'desc' }, // Order by timestamp (latest first)
    });

    console.log('Fetched decoded data:', decodedData);

    // Group data by timestamp
    const groupedData = decodedData.reduce((acc, item) => {
      const timestampKey = item.timestamp.toISOString(); // Use ISO string of timestamp as the key
      if (!acc[timestampKey]) {
        acc[timestampKey] = {
          timestamp: timestampKey,
          attributes: [], // Array to hold attributes for this timestamp
        };
      }
      // Push the current item's attributes into the corresponding timestamp entry
      acc[timestampKey].attributes.push({
        attributesName: item.attributesName,
        attributesValue: item.attributesValue,
        attributesUnits: item.attributesUnits,
      });
      return acc;
    }, {});

    // Convert the grouped object to an array
    const result = Object.values(groupedData);
    console.log('Grouped Result:', result);

    return result;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    throw error; // Propagate the error
  }
};


module.exports = {
  fetchDecodedDataByDateTime,
};
