const { prisma } = require('../lib/prisma.js');

const fetchTimeStampByDevEUI = async(devEui)=>{
  console.log("devEui inside the service",devEui);
  try {
    const data = await prisma.devicedecodedata.findFirst({
      where:{
        devEui:devEui
      },
      orderBy:{timestamp:'desc'},
      
    })
    console.log(data);
    return data;
  } catch (error) {
    
  }
}
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



// const fetchRecentDecodedData = async (devEui) => {
//   console.log("fetchrecent function ",devEui);
//   const decodedData = await prisma.devicedecodedata.findMany({
//     where: { devEui: devEui }, // Filter by devEui
//     orderBy: { timestamp: 'desc' }, // Optional: order by timestamp
//   });

//   const data = await prisma.deviec.findFirst({
//     where:{
//       devEui:devEui
//     },
//     include:{
//       output:true,
//     },
//     select:{
//       output:true
//     }
//   })
//   console.log(data);

//   // Group data by timestamp
//   const groupedData = decodedData.reduce((acc, item) => {
//     const timestampKey = item.timestamp; // Use timestamp as the key
//     if (!acc[timestampKey]) {
//       acc[timestampKey] = {
//         timestamp: timestampKey,
//         attributes: [],
//         devEui:devEui, 
//         // Array to hold attributes for this timestamp
//       };
//     }
//     // Push the current item's attributes into the corresponding timestamp entry
//     acc[timestampKey].attributes.push({
//       attributesName: item.attributesName,
//       attributesValue: item.attributesValue,
//       attributesUnits: item.attributesUnits,
//       type:
//     });
//     return acc;
//   }, {});

//   // Convert the grouped object to an array and get the first timestamp entry
//   const resultArray = Object.values(groupedData);
//   const singleTimestampData = resultArray.length > 0 ? resultArray[0] : null; // Get the first entry or null if no data

//   return singleTimestampData; // Return the single object with the most recent timestamp and its attributes
// };
// const fetchRecentDecodedData = async (devEui) => {
//   console.log("fetchrecent function ", devEui);
  
//   const decodedData = await prisma.devicedecodedata.findMany({
//     where: { devEui: devEui },
//     orderBy: { timestamp: 'desc' },
//   });

//   const data = await prisma.device.findFirst({
//     where: {
//       deviceId: devEui
//     },
//     include: {
//       output: true,
//     }
//   });
  
//   console.log("------>",data);

//   // Create a mapping of output names to their types
//   const outputTypeMap = {};
//   if (data && data.output) {
//     data.output.forEach(output => {
//       outputTypeMap[output.name] = output.type;
//     });
//   }
//   console.log("map",outputTypeMap);
//   // Group data by timestamp
//   const groupedData = decodedData.reduce((acc, item) => {
//     const timestampKey = item.timestamp;
//     if (!acc[timestampKey]) {
//       acc[timestampKey] = {
//         timestamp: timestampKey,
//         attributes: [],
//         devEui: devEui,
//       };
//     }
    
//     // Push the current item's attributes into the corresponding timestamp entry
//     acc[timestampKey].attributes.push({
//       attributesName: item.attributesName,
//       attributesValue: item.attributesValue,
//       attributesUnits: item.attributesUnits,
//     });
    
//     return acc;
//   }, {});

//   // Convert the grouped object to an array and get the first timestamp entry
//   const resultArray = Object.values(groupedData);
//   const singleTimestampData = resultArray.length > 0 ? resultArray[0] : null;

//   singleTimestampData?.attributes.map((item)=>{

//   })
//   console.log("single time stamp data",singleTimestampData);
//   return singleTimestampData;
// };

const fetchRecentDecodedData = async (devEui) => {   
  console.log("fetchrecent function ", devEui);      
  
  const decodedData = await prisma.devicedecodedata.findMany({     
    where: { devEui: devEui },     
    orderBy: { timestamp: 'desc' },   
  });    

  const data = await prisma.device.findFirst({     
    where: {       
      deviceId: devEui     
    },     
    include: {       
      output: true,     
    }   
  });      
  
  console.log("------>", data);    

  // Create a mapping of output names to their types   
  const outputTypeMap = {};   
  if (data && data.output) {     
    data.output.forEach(output => {       
      outputTypeMap[output?.name.toLowerCase()] = output.type;     
    });   
  }   
  console.log("map", outputTypeMap);   

  // Group data by timestamp   
  const groupedData = decodedData.reduce((acc, item) => {     
    const timestampKey = item.timestamp;     
    if (!acc[timestampKey]) {       
      acc[timestampKey] = {         
        timestamp: timestampKey,         
        attributes: [],         
        devEui: devEui,       
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
  const singleTimestampData = resultArray.length > 0 ? resultArray[0] : null;    

  // Add type to each attribute based on the outputTypeMap
  if (singleTimestampData && singleTimestampData.attributes) {
    singleTimestampData.attributes = singleTimestampData.attributes.map((item) => ({
      ...item,
      type: outputTypeMap[item?.attributesName]// Add type from map, or null if not found
    }));
  }

  console.log("single time stamp data", singleTimestampData);   
  return singleTimestampData; 
};
const fetchRecentDecodedDataByDEVEUI = async (devEuiList) => {

  const devEuis = devEuiList.split(',').map(eui => eui.trim());

  // Step 1: Get most recent timestamp (rounded to seconds) per devEui
  const recentTimestamps = await prisma.$queryRawUnsafe(`
    SELECT devEui,
           DATE_FORMAT(MAX(timestamp), '%Y-%m-%d %H:%i:%s') AS maxTimestamp
    FROM devicedecodedata
    WHERE devEui IN (${devEuis.map(eui => `'${eui}'`).join(',')})
    GROUP BY devEui;
  `);

  const decodedData = [];

  // Step 2: For each devEui, get all records with the max timestamp (rounded to seconds)
  for (const group of recentTimestamps) {
    const records = await prisma.$queryRawUnsafe(`
      SELECT * FROM devicedecodedata
      WHERE devEui = '${group.devEui}'
        AND DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') = '${group.maxTimestamp}'
    `);

    const hardware = await prisma.device.findFirst({
      where: {
        deviceId: group.devEui,
      },
      select: {
        hardwareId: true
      }
    })

    decodedData.push({
      devEui: group.devEui,
      hardwareId: hardware.hardwareId,
      timestamp: records,
    });
  }

  return decodedData;
};

const getRecentDecodedDataByDeviceIdAndOutput = async (deviceId, outputName) => {
  // console.log("Fetching most recent decoded data for device:", deviceId, "and outputName:", outputName);

  // Validate input
  if (!deviceId || isNaN(deviceId)) {
    throw new Error("Invalid deviceId passed");
  }

  if (!outputName || typeof outputName !== 'string') {
    throw new Error("Invalid or missing outputName");
  }

  // Fetch the most recent matching decoded data
  const [latestDecoded] = await prisma.devicedecodedata.findMany({
    where: {
      deviceId: Number(deviceId),
      attributesName: outputName,
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: 1,
  });
// console.log("===latestDecoded======",latestDecoded)
  return latestDecoded || {}; // Return null if not found
};

module.exports = {
  fetchDecodedData,
  fetchRecentDecodedData,
	fetchRecentDecodedDataByDEVEUI,
  fetchTimeStampByDevEUI,
  getRecentDecodedDataByDeviceIdAndOutput
};

