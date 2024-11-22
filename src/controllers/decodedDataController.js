// const decodedDataService = require('../services/decodedDataService'); // Adjust the path as needed

// const getDecodedData = async (req, res) => {
//   try {
//     const devEui = req.params.devEui; // You can get the devEui from the request parameters
//     const decodedData = await decodedDataService.fetchDecodedData(devEui);

//     return res.status(200).json({
//       decodedData,
//     });
//   } catch (error) {
//     console.error('Error fetching decoded data:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   getDecodedData,
// };


const decodedDataService = require('../services/decodedDataService'); // Adjust the path as needed

const getDecodedData = async (req, res) => {
  try {
    const devEui = req.params.devEui; // You can get the devEui from the request parameters
    const decodedData = await decodedDataService.fetchDecodedData(devEui);

    return res.status(200).json({
      decodedData,
    });
  } catch (error) {
    console.error('Error fetching decoded data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getRecentDecodedData = async (req, res) => {
  try {
    const devEui = req.params.devEui; // You can get the devEui from the request parameters
    const decodedData = await decodedDataService.fetchRecentDecodedData(devEui);

    return res.status(200).json({
      decodedData,
    });
  } catch (error) {
    console.error('Error fetching decoded data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getDecodedData,
  getRecentDecodedData
};
