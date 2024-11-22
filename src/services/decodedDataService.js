

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fetchDecodedData = async (devEui) => {
  const decodedData = await prisma.devicedecodedata.findMany({
    where: { devEui: devEui }, // Filter by devEui
    orderBy: { timestamp: 'desc' }, // Optional: order by timestamp
  });

  // Group data by timestamp
  const groupedData = decodedData.reduce((acc, item) => {
    const timestampKey = item.timestamp; // Use timestamp as the key
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

  // Convert the grouped object to an array if needed
  const result = Object.values(groupedData);

  return result;
};



const fetchRecentDecodedData = async (devEui) => {
  console.log("fetchrecent function ",devEui);
  const decodedData = await prisma.devicedecodedata.findMany({
    where: { devEui: devEui }, // Filter by devEui
    orderBy: { timestamp: 'desc' }, // Optional: order by timestamp
  });

  // Group data by timestamp
  const groupedData = decodedData.reduce((acc, item) => {
    const timestampKey = item.timestamp; // Use timestamp as the key
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

  // Convert the grouped object to an array and get the first timestamp entry
  const resultArray = Object.values(groupedData);
  const singleTimestampData = resultArray.length > 0 ? resultArray[0] : null; // Get the first entry or null if no data

  return singleTimestampData; // Return the single object with the most recent timestamp and its attributes
};


module.exports = {
  fetchDecodedData,
  fetchRecentDecodedData
};
