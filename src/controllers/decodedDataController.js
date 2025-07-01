const decodedDataService = require('../services/decodedDataService'); // Adjust the path as needed
const {subDays} = require('date-fns');



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
const getTiemStampBydevEUI = async (req, res) => {
  try {
    const {devEui}  = req.params;
    console.log("devEui inside the controller", devEui);
    const getTimestamp = await decodedDataService.fetchTimeStampByDevEUI(devEui);

    return res.status(200).json({
      getTimestamp,
    });
  } catch (error) {
    console.error('Error fetching decoded data:', error);
    return res.status(500).json({
      message: "phat gaya code"
    })
  }
}

// here we need to get the data based on the id and attribute name
const getRecentDecodedDataByDeviceIdAndOutputName = async (req, res) => {
  try {
    // console.log("====req.body====",req.body)
    // const rawId = req.params.deviceIds; // from /recent-decoded-devices-data/:deviceIds
    // const deviceId = Number(rawId);

    // if (!deviceId || isNaN(deviceId)) {
    //   return res.status(400).json({ message: "Invalid deviceId" });
    // }

    // const decodedData = await decodedDataService.getRecentDecodedDataByDeviceId(deviceId);

    // return res.status(200).json({ decodedData });

    // console.log("====req.body====", req.body);
    
    const { id, outputName } = req.body;

    if (!id || isNaN(Number(id)) || !outputName) {
      return res.status(400).json({ message: "Invalid deviceId or outputName" });
    }

    const deviceId = Number(id);

    const decodedData = await decodedDataService.getRecentDecodedDataByDeviceIdAndOutput(deviceId, outputName);

    if (!decodedData) {
      return res.status(404).json({ message: "No decoded data found" });
    }

    return res.status(200).json({decodedData});
  } catch (error) {
    console.error("Error fetching decoded data:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getDecodedData,
  getRecentDecodedData,
  getDecodedDataByDeviceIdsAndDuration,
  getRecentDecodedDataByDevEUIS,
  getTiemStampBydevEUI,
  getRecentDecodedDataByDeviceIdAndOutputName
};
