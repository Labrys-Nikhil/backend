
const locationService = require('../services/locationService'); // Adjust the path as needed
const getDecodedDataByDateTime = async (req, res) => {
  try {
    const devEui = req.params.devEui; // Get devEui from the request parameters
    const { startDate, endDate, startTime, endTime } = req.query; // Get date and time range from query parameters

    // Validate that at least one valid combination of parameters is provided
    if (!startDate && !endDate && !startTime && !endTime) {
      return res.status(400).json({ message: 'At least one valid combination of parameters is required' });
    }

    console.log('Request Parameters:', { devEui, startDate, endDate, startTime, endTime });

    // Call the service to fetch the data
    const decodedData = await locationService.fetchDecodedDataByDateTime(devEui, startDate, endDate, startTime, endTime);

    // Respond with the fetched data
    return res.status(200).json({
      decodedData,
    });
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports = {
  getDecodedDataByDateTime,
};
