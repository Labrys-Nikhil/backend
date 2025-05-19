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
const {subDays} = require('date-fns');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

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


//duration
const getDecodedDataByDeviceIdsAndDuration = async (req, res) => {
  try {
    const { devEuis, duration } = req.params; // Access deviceIds from request params correctly

    // Check if deviceIds were provided, if not, return an error
    if (!devEuis || !duration) {
      return res.status(400).json({ message: 'Device IDs are required' });
    }


    const decodedData = await prisma.devicedecodedata.findMany({
      where: {
        devEui: {
          in: devEuis.split(','), // Assuming deviceIds are passed as a comma-separated string
        },
        timestamp:{
          gte: subDays(new Date(), Number.parseInt(duration))
        }
      },
      orderBy:{
        timestamp: 'desc'
      }
    });

    return res.status(200).json({
      decodedData,
    });
  } catch (error) {
    console.error('Error fetching all decoded data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

}
const getRecentDecodedDataByDevEUIS = async (req, res) => {
  try {
    const devEui = req.params.devEui; // You can get the devEui from the request parameters
    const decodedData = await decodedDataService.fetchRecentDecodedDataByDEVEUI(devEui);

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
  getRecentDecodedData,
  getDecodedDataByDeviceIdsAndDuration,
  getRecentDecodedDataByDevEUIS
};

