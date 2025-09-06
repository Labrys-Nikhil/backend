const { prisma } = require('../lib/prisma.js');
const { postDownlinkDevice } = require("../controllers/downlinkController");
const { downlinkLoriot } = require("../controllers/loriotcontroller");
const { controllerPDUByModel } = require("../helper/controllerPDUbyModel");
const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");
const { getPDUCommand } = require("../helper/controllerPDU/meterPDUcontroller");

// const mapTheDownlinkAndRoutetoSpecificServer = async (req, res) => {
//   const customerId = req.user.id;

//   console.log("checking the customerId", customerId);
//   const {
//     classType,
//     confirmed,
//     devEui,
//     downlinkController,
//     pdu,
//     port,
//     timeoutMinutes,
//     isActive,
//   } = req.body;

//   const data = {
//     classType: classType,
//     confirmed: confirmed,
//     devEui: devEui,
//     downlinkController: downlinkController,
//     pdu: pdu,
//     port: port,
//     timeoutMinutes: timeoutMinutes,
//   };

//   const device = await prisma.device.findFirst({
//     where: { deviceId: devEui },
//   });
//   console.log(
//     "device acording to the devEUI in the maptheDownlinkTospecificServer",
//     device
//   );
//   if (!device) {
//     console.log("Device not found with ID:", devEui);
//     return res.status(404).json({ message: "Device not found" });
//   }
//   const network = await prisma.networkdata.findFirst({
//     where: {
//       organizationId: device.organizationId,
//       networkId: device.networkId,
//       customerId: customerId,
//     },
//   });
//   console.log(
//     "device acording to the network in the maptheDownlinkTospecificServer",
//     network
//   );
//   if (!network) {
//     return res.status(500).json({ message: "network not found" });
//   }

//   if (network.networkId === 1) {
//     //senra
//     const response = await postDownlinkDevice(data);
//     return res.status(response.status).json(response.data);
//   } else if (network.networkId === 2) {
//     //TTn
//   } else if (network.networkId === 3) {
//     //Loriot
//     // create the mapping for the latest data

//     //step 2   :---- second data for the paload from the deviceLevel like appid
//     const deviceAppid = network.appid;

//     //step 3:---- decode the data into the relevant Payloadf format
//     // const deviceData = await prisma.device.findFirst({
//     //     where: {
//     //         deviceId: devEui
//     //     },
//     //     select: {
//     //         hardwareId: true
//     //     }
//     // })

//     const hardwareData = await prisma.hardware.findFirst({
//       where: {
//         id: device.hardwareId,
//       },
//       select: {
//         id: true,
//         //decoderPDU:true,
//         modelNo: true,
//       },
//     });
//     console.log("device and hardware data", device, hardwareData);

//     //then call the decodePDU for that hardware
//     const modelNumber = hardwareData.modelNo;

//     //last step to call the mapping;
//     const controllerPDUData = {
//       downlinkController: downlinkController,
//       pdu: pdu,
//     };
//     console.log(controllerPDUData);
//     const responseOfControllerPDU = await controllerPDUByModel(
//       controllerPDUData,
//       modelNumber
//     );

//     console.log("data after the controllerPDU", responseOfControllerPDU);

//     const PayloadForLoriot = {
//       port: responseOfControllerPDU?.Port,
//       confirmed: data.confirmed || true,
//       data: responseOfControllerPDU?.Payload,
//       EUI: data.devEui,
//       appid: deviceAppid,
//       priority: 2,
//     };

//     if (isActive === true) {
//       const Device = await prisma.device.findFirst({
//         where: { deviceId: devEui },
//       });
//       const response = await downlinkLoriot({
//         body: PayloadForLoriot,
//         customerId: customerId,
//       });
//       if (response.status === 200) {
//         const savedDownlink = await prisma.downlinkdevice.create({
//           data: {
//             downlinkController: downlinkController,
//             classType: classType,
//             devEui: devEui,
//             pdu: pdu,
//             port: responseOfControllerPDU?.Port,
//             payload: responseOfControllerPDU?.Payload,
//             deviceId: device.id,
//             timeoutMinutes: data.timeoutMinutes,
//           },
//         });

//         console.log("Saved Downlink Device:", savedDownlink);
//         const autoDownlinkWithdelay = await prisma.autodownlinkwithdelay.create(
//           {
//             data: {
//               downlinkController,
//               classType,
//               devEui,
//               pdu,
//               isActive: true,
//               timeoutMinutes: Number(timeoutMinutes),
//               port: Number(responseOfControllerPDU?.Port),
//               deviceId: Number(Device.id),
//             },
//           }
//         );
//         console.log("Saved autoDownlinkWithDelay:", autoDownlinkWithdelay);
//       }
//       return res.status(response.status).json(response.data);
//     } else {
//       const response = await downlinkLoriot({
//         body: PayloadForLoriot,
//         customerId: customerId,
//       });
//       if (response.status === 200) {
//         const savedDownlink = await prisma.downlinkdevice.create({
//           data: {
//             downlinkController: downlinkController,
//             classType: classType,
//             devEui: devEui,
//             pdu: pdu,
//             port: responseOfControllerPDU?.Port,
//             payload: responseOfControllerPDU?.Payload,
//             deviceId: device.id,
//             timeoutMinutes: data.timeoutMinutes,
//           },
//         });
//       }
//       try {
//         const latestDownlinkData = await prisma.downlinkdevice.findFirst({
//           where: { devEui },
//           orderBy: { createdAt: "desc" },
//         });


//         console.log("Latest downlink data:", latestDownlinkData);

//         if (latestDownlinkData?.createdAt && device.location) {
//           const match = device.location.match(/Latitude:\s*([-\d.]+),\s*Longitude:\s*([-\d.]+)/);

//           if (match) {
//             const latitude = parseFloat(match[1]);
//             const longitude = parseFloat(match[2]);
//             const deviceTimezone = tzlookup(latitude, longitude);

//             const createdAtUTC = moment.utc(latestDownlinkData.createdAt);
//             const createdAtDeviceTime = createdAtUTC.clone().tz(deviceTimezone);
//             const downlinkDay = createdAtDeviceTime.format("ddd"); // "Mon", "Tue", etc.
//             const downlinkMinutes = createdAtDeviceTime.hours() * 60 + createdAtDeviceTime.minutes();

//             const matchingSchedules = await prisma.scheduledownlink.findMany({
//               where: {
//                 devEui,
//                 activeDays: {
//                   array_contains: [downlinkDay],
//                 },
//               },
//             });

//             const updates = matchingSchedules
//               .filter(
//                 (schedule) =>
//                   Array.isArray(schedule.activeDays) &&
//                   schedule.activeDays.includes(downlinkDay) &&
//                   downlinkMinutes >= schedule.activeStartTime &&
//                   downlinkMinutes <= schedule.activeEndTime
//               )
//               .map((schedule) => {
//                 const updatedActiveDays = schedule.activeDays.filter((d) => d !== downlinkDay);
//                 const updatedRescheduledDays = Array.from(
//                   new Set([...(schedule.reseduledDay || []), downlinkDay])
//                 );

//                 return prisma.scheduledownlink.update({
//                   where: { id: schedule.id },
//                   data: {
//                     activeDays: updatedActiveDays,
//                     reseduledDay: updatedRescheduledDays,
//                   },
//                 });
//               });

//             if (updates.length > 0) {
//               await prisma.$transaction(updates);
//               console.log(`Rescheduled downlink for devEui ${devEui} on ${downlinkDay}`);
//             } else {
//               console.log("No active schedules to update for this downlink");
//             }
//           } else {
//             console.warn("Invalid device location format");
//           }
//         } else {
//           console.warn("Device location not found or no downlink history");
//         }
//       } catch (err) {
//         console.error("Error while updating schedule days:", err);
//       }
//       return res.status(response.status).json(response.data);

//     }
//   } else {
//     return res.status(500).json({ message: "Invalid network ID" });
//   }
// };

const mapTheDownlinkAndRoutetoSpecificServer = async (req, res) => {
  const customerId = req.user.id;
  const {
    classType,
    confirmed,
    devEui,
    downlinkController,
    pdu,
    port,
    timeoutMinutes,
    isActive,
  } = req.body;

  try {
    // Fetch device only once
    const device = await prisma.device.findFirst({
      where: { deviceId: devEui },
    });

    if (!device) return res.status(404).json({ message: "Device not found" });

    const network = await prisma.networkdata.findFirst({
      where: {
        organizationId: device.organizationId,
        networkId: device.networkId,
        customerId,
      },
    });

    if (!network) return res.status(404).json({ message: "Network not found" });

    const data = { classType, confirmed, devEui, downlinkController, pdu, port, timeoutMinutes };

    // --- Handle network types ---
    if (network.networkId === 1) {
      const response = await postDownlinkDevice(data);
      return res.status(response.status).json(response.data);
    }

    if (network.networkId !== 3) {
      return res.status(400).json({ message: "Unsupported network type" });
    }

    // Loriot Specific Handling
    const hardwareData = await prisma.hardware.findFirst({
      where: { id: device.hardwareId },
      select: { modelNo: true },
    });

    const controllerPDUData = { downlinkController, pdu };
    const responseOfControllerPDU = await controllerPDUByModel(controllerPDUData, hardwareData.modelNo);

    const PayloadForLoriot = {
      port: responseOfControllerPDU?.Port,
      confirmed: confirmed ?? true,
      data: responseOfControllerPDU?.Payload,
      EUI: devEui,
      appid: network.appid,
      priority: 2,
    };

    const response = await downlinkLoriot({
      body: PayloadForLoriot,
      customerId,
    });

    if (response.status !== 200) {
      return res.status(response.status).json({ message: "Downlink failed" });
    }

    // Save the downlink to DB
    const downlinkSavePayload = {
      downlinkController,
      classType,
      devEui,
      pdu,
      port: responseOfControllerPDU?.Port,
      payload: responseOfControllerPDU?.Payload,
      deviceId: device.id,
      timeoutMinutes: timeoutMinutes,
    };

    await prisma.downlinkdevice.create({ data: downlinkSavePayload });

    if (isActive === true) {
      await prisma.autodownlinkwithdelay.create({
        data: {
          ...downlinkSavePayload,
          isActive: true,
        },
      });
    } else {
      await handleScheduleUpdateIfWithinWindow(devEui, device, customerId);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Downlink mapping error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const handleScheduleUpdateIfWithinWindow = async (devEui, device, customerId) => {
  try {
    const latestDownlinkData = await prisma.downlinkdevice.findFirst({
      where: { devEui },
      orderBy: { createdAt: "desc" },
    });

    if (!latestDownlinkData?.createdAt || !device.location) return;

    const match = device.location.match(/Latitude:\s*([-\d.]+),\s*Longitude:\s*([-\d.]+)/);
    if (!match) return;

    const [_, lat, lng] = match;
    const deviceTimezone = tzlookup(parseFloat(lat), parseFloat(lng));
    const deviceTime = moment.utc(latestDownlinkData.createdAt).tz(deviceTimezone);
    const day = deviceTime.format("ddd");
    const minutes = deviceTime.hours() * 60 + deviceTime.minutes();

    const matchingSchedules = await prisma.scheduledownlink.findMany({
      where: {
        devEui,
        activeDays: { array_contains: [day] },
      },
    });

    const updates = matchingSchedules
      .filter(s => s.activeDays.includes(day) && minutes >= s.activeStartTime && minutes <= s.activeEndTime)
      .map(s => {
        const updatedActiveDays = s.activeDays.filter(d => d !== day);
        const updatedRescheduled = Array.from(new Set([...(s.reseduledDay || []), day]));

        return prisma.scheduledownlink.update({
          where: { id: s.id },
          data: {
            activeDays: updatedActiveDays,
            reseduledDay: updatedRescheduled,
          },
        });
      });

    if (updates.length) await prisma.$transaction(updates);
  } catch (err) {
    console.error("Error in schedule update:", err);
  }
};


const CustomMeterDownlink = async(req, res) => {
  const customerId = req.user.id;
  const { EUI, commandName, value } = req.body;
  console.log(req.body);

  const pduGenerated = getPDUCommand(commandName, value, "03");

  console.log("Generated PDU:", pduGenerated);
  const downlinkPayload = {
    EUI: EUI,
    port: 2,
    confirmed: true,
    priority: 3,
    data: pduGenerated, 
    appid:'BE010091',
  };
  console.log("Downlink Payload that to be send for downnlink process:", downlinkPayload);
  const downlink = await downlinkLoriot({
    body: downlinkPayload,
    customerId: customerId,
  });
 if (downlink.status === 200) {
    return res.status(200).json({message: "Downlink command sent successfully", data: downlink.data});
  } else {
    return res.status(500).json({message: "Failed to send downlink command=----"+ commandName});
  }
}

module.exports = { mapTheDownlinkAndRoutetoSpecificServer, CustomMeterDownlink };
