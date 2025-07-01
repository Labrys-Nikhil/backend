// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// const { downlinkLoriot } = require("../controllers/loriotcontroller");

// const mapScheduledDownlink = async (req, res) => {
//   const customerId = req.user.id;

//   const {
//     classType,
//     confirmed, 
//     devEui,
//     downlinkController,
//     pdu,
//     port,
//     isEnabled,
//     activeStartTime,
//     activeEndTime,
//     activeDays,
//     reseduledDay
//   } = req.body;

//     const data = {
//         classType: classType,
//         confirmed: confirmed,
//         devEui: devEui,
//         downlinkController: downlinkController,
//         pdu: pdu,
//         port: port,
//         timeoutMinutes:0
//     }

//   const device = await prisma.device.findFirst({
//     where: { deviceId: devEui },
//   });

//    console.log("device acording to the devEUI in the maptheDownlinkTospecificServer",device)

//   if (!device) {
//     return res.status(404).json({ message: "Device not found" });
//   }

//   const network = await prisma.networkdata.findFirst({
//     where: {
//       organizationId: device.organizationId,
//       networkId: device.networkId,
//     },
//   });

//   console.log("device acording to the network in the maptheDownlinkTospecificServer",network);
//   if (!network) {
//     return res.status(500).json({ message: "Network not found" });
//   }

//   if (network.networkId === 3) {
//     const deviceAppid = network.appid;
//     let packet;

//     let relay1State = "off";
//     let relay2State = "off";

//     if (downlinkController === "relay 1") {
//       packet = generateRelay1Packet(pdu);
//       relay1State = pdu === "on" ? "on" : "off";
//     } else if (downlinkController === "relay 2") {
//       packet = generateRelay2Packet(pdu);
//       relay2State = pdu === "on" ? "on" : "off";
//     } else if (downlinkController === "relay 1+2") {
//       packet = generateBothRelayPacket(pdu);
//       relay1State = pdu === "on" ? "on" : "off";
//       relay2State = pdu === "on" ? "on" : "off";
//     } else {
//          console.log("Invalid downlinkController:", downlinkController);
//          return res.status(400).json({ message: "Invalid downlink controller" });
//     }

//     const payloadForLoriot = {
//       port: data.port,
//       confirmed: data.confirmed || true,
//       data: packet["Payload"],
//       EUI: data.devEui,
//       appid: deviceAppid,
//       priority: 2,
//     };

//      const response = await downlinkLoriot({
//             body: payloadForLoriot,
//             customerId: customerId,
//           });
//     // let loriotResponse = null;

// //    if (isEnabled === true) {
// //   try {
// //     const device = await prisma.device.findFirst({
// //       where: { deviceId: devEui },
// //     });

// //     if (!device) {
// //       return res.status(404).json({ message: "Device not found." });
// //     }

// //       const savedSchedule = await prisma.scheduledownlink.create({
// //         data: {
// //           devEui,
// //           downlinkController,
// //           deviceId: Number(device.id),
// //           classType,
// //           pdu,
// //           port: packet["Port"],
// //           activeStartTime,
// //           activeEndTime,
// //           activeDays,
// //           isEnabled : true,
// //           reseduledDay:null
// //         },
// //       });

// //       console.log("Saved Scheduled Downlink:", savedSchedule);

// //       return res.status(200).json({
// //         message: "Scheduled downlink saved and downlink sent.",
// //         data: savedSchedule,
// //       });
    
// //   } catch (error) {
// //     console.error("Error while scheduling downlink:", error);
// //     return res.status(500).json({ message: "Internal server error." });
// //   }
// // } else {
// //   return res.status(400).json({ message: "isActive must be true to schedule downlink." });
// // }

// // if (isEnabled === true) {
// //   try {
// //     const device = await prisma.device.findFirst({
// //       where: { deviceId: devEui },
// //     });

// //     if (!device) {
// //       return res.status(404).json({ message: "Device not found." });
// //     }

// //     // Step 1: Fetch all enabled schedules for same device
// //     const existingSchedules = await prisma.scheduledownlink.findMany({
// //       where: {
// //         devEui,
// //         deviceId: Number(device.id),
// //         isEnabled: true,
// //       },
// //     });

// //     const newStart = activeStartTime;
// //     const newEnd = activeEndTime;
// //     const newDays = activeDays || [];

// //     // Step 2: Check for overlapping days and overlapping time range
// //     const hasConflict = existingSchedules.some((schedule) => {
// //       const existingStart = schedule.activeStartTime;
// //       const existingEnd = schedule.activeEndTime;
// //       const existingDays = schedule.activeDays || [];

// //       const dayOverlap = newDays.some((day) => existingDays.includes(day));
// //       const timeOverlap = newStart < existingEnd && existingStart < newEnd;

// //       return dayOverlap && timeOverlap;
// //     });

// //     if (hasConflict) {
// //       return res.status(400).json({
// //         message: "Conflict: Schedule overlaps with an existing one for the same day and time range.",
// //       });
// //     }

// //     // Step 3: Save new schedule
// //     const savedSchedule = await prisma.scheduledownlink.create({
// //       data: {
// //         devEui,
// //         downlinkController,
// //         deviceId: Number(device.id),
// //         classType,
// //         pdu,
// //         port: packet["Port"],
// //         activeStartTime,
// //         activeEndTime,
// //         activeDays,
// //         isEnabled: true,
// //         reseduledDay: null,
// //       },
// //     });

// //     return res.status(200).json({
// //       message: "Scheduled downlink saved successfully.",
// //       data: savedSchedule,
// //     });

// //   } catch (error) {
// //     console.error("Error while scheduling downlink:", error);
// //     return res.status(500).json({ message: "Internal server error." });
// //   }
// // } else {
// //   return res.status(400).json({ message: "isEnabled must be true to schedule downlink." });
// // }



//   try {
//     // === FIELD-BY-FIELD VALIDATION ===
//     if (!devEui) {
//       return res.status(400).json({ message: "Invalid or missing 'devEui'." });
//     }

//     if (!downlinkController || typeof downlinkController !== "string") {
//       return res.status(400).json({ message: "Invalid or missing 'downlinkController'." });
//     }

//     if (!pdu || typeof pdu !== "string") {
//       return res.status(400).json({ message: "Invalid or missing 'pdu'." });
//     }

//     if (!packet?.Port ) {
//       return res.status(400).json({ message: "Invalid or missing 'port' from packet." });
//     }

//     if (activeStartTime === undefined || typeof activeStartTime !== "number") {
//       return res.status(400).json({ message: "Invalid or missing 'activeStartTime'." });
//     }

//     if (activeEndTime === undefined || typeof activeEndTime !== "number") {
//       return res.status(400).json({ message: "Invalid or missing 'activeEndTime'." });
//     }

//     if (activeStartTime >= activeEndTime) {
//       return res.status(400).json({ message: "'activeStartTime' must be less than 'activeEndTime'." });
//     }

//     if (!Array.isArray(activeDays) || activeDays.length === 0) {
//       return res.status(400).json({ message: "'activeDays' must be a non-empty." });
//     }

//     // === CHECK DEVICE EXISTENCE ===
//     const device = await prisma.device.findFirst({
//       where: { deviceId: devEui },
//     });

//     if (!device) {
//       return res.status(404).json({ message: "Device not found." });
//     }

//     // === FETCH EXISTING ENABLED SCHEDULES ===
//     const existingSchedules = await prisma.scheduledownlink.findMany({
//       where: {
//         devEui,
//         deviceId: Number(device.id),
        
//       },
//     });

//     const newStart = activeStartTime;
//     const newEnd = activeEndTime;
//     const newDays = activeDays;

//     // === CHECK FOR TIME/DAY CONFLICTS ===
//     const hasConflict = existingSchedules.some((schedule) => {
//       const existingStart = schedule.activeStartTime;
//       const existingEnd = schedule.activeEndTime;
//       const existingDays = schedule.activeDays || [];

//       const dayOverlap = newDays.some((day) => existingDays.includes(day));
//       const timeOverlap = newStart < existingEnd && existingStart < newEnd;

//       return dayOverlap && timeOverlap;
//     });

//     if (hasConflict) {
//       return res.status(400).json({
//         message: "Conflict: Schedule overlaps with an existing one for the same day and time range.",
//       });
//     }

//     // === SAVE SCHEDULE ===
//     const savedSchedule = await prisma.scheduledownlink.create({
//       data: {
//         devEui,
//         downlinkController,
//         deviceId: Number(device.id),
//         classType,
//         pdu,
//         port: packet.Port,
//         activeStartTime,
//         activeEndTime,
//         activeDays,
//         isEnabled,
//         reseduledDay: null,
//       },
//     });

//     return res.status(200).json({
//       message: "Scheduled downlink saved successfully.",
//       data: savedSchedule,
//     });

//   } catch (error) {
//     console.error("Error while scheduling downlink:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }

//   }

//   // Function to generate packet for Relay 1
//   function generateRelay1Packet(value) {
//     const packet = {};
//     if (value.toLowerCase() === "on") {
//       packet["Payload"] = "030111"; // Relay 1: On
//     } else if (value.toLowerCase() === "off") {
//       packet["Payload"] = "030011"; // Relay 1: Off
//     } else {
//       packet["Payload"] = "031111"; // Relay 1: No change
//     }
//     packet["Port"] = "2";
//     return packet;
//   }

//   // Function to generate packet for Relay 2
//   function generateRelay2Packet(value) {
//     const packet = {};
//     if (value.toLowerCase() === "on") {
//       packet["Payload"] = "031101"; // Relay 2: On
//     } else if (value.toLowerCase() === "off") {
//       packet["Payload"] = "031100"; // Relay 2: Off
//     } else {
//       packet["Payload"] = "031111"; // Relay 2: No change
//     }
//     packet["Port"] = "2";
//     return packet;
//   }

//   // Function to generate packet for Relay 1 and Relay 2
//   function generateBothRelayPacket(value) {
//     const packet = {};
//     if (value.toLowerCase() === "on") {
//       packet["Payload"] = "030101"; // Both Relays: On
//     } else if (value.toLowerCase() === "off") {
//       packet["Payload"] = "030000"; // Both Relays: Off
//     } else {
//       packet["Payload"] = "031111"; // No change
//     }
//     packet["Port"] = "2";
//     return packet;
//   }
// };

// module.exports = { mapScheduledDownlink }


const { prisma } = require('../lib/prisma.js');

const mapScheduledDownlink = async (req, res) => {
  const {
    devEui,
    downlinkController,
    classType,
    pdu,
    port,
    activeStartTime,
    activeEndTime,
    activeDays,
    isEnabled,
    reseduledDay
  } = req.body;

  try {
    // === VALIDATIONS ===
    if (!devEui) return res.status(400).json({ message: "Missing 'devEui'" });
    if (!downlinkController) return res.status(400).json({ message: "Missing 'downlinkController'" });
    if (!pdu) return res.status(400).json({ message: "Missing 'pdu'" });
    if (!port) return res.status(400).json({ message: "Missing 'port'" });

    if (typeof activeStartTime !== "number") {
      return res.status(400).json({ message: "Invalid or missing 'activeStartTime'" });
    }

    if (typeof activeEndTime !== "number") {
      return res.status(400).json({ message: "Invalid or missing 'activeEndTime'" });
    }

    if (activeStartTime >= activeEndTime) {
      return res.status(400).json({ message: "'activeStartTime' must be less than 'activeEndTime'" });
    }

    if (!Array.isArray(activeDays) || activeDays.length === 0) {
      return res.status(400).json({ message: "'activeDays' must be a non-empty array" });
    }

    // === FIND DEVICE ===
    const device = await prisma.device.findFirst({
      where: { deviceId: devEui },

    });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // // === CHECK CONFLICTING SCHEDULES ===
    const existingSchedules = await prisma.scheduledownlink.findMany({
      where: {
        devEui,
        deviceId: Number(device.id),
     
      },
    });

    // === CHECK CONFLICTING SCHEDULES ===
let hasConflict = false;

if (existingSchedules.length > 0) {
  hasConflict = existingSchedules.some((schedule) => {
    const existingDays = Array.isArray(schedule.activeDays) ? schedule.activeDays : [];

    const timeOverlap =
      activeStartTime < schedule.activeEndTime &&
      schedule.activeStartTime < activeEndTime;

    const dayOverlap = activeDays.some((day) => existingDays.includes(day));

    return timeOverlap && dayOverlap;
  });

  if (hasConflict) {
    return res.status(400).json({
      message: "Conflict: Schedule overlaps with existing schedule for same time and day.",
    });
  }
}


    // === SAVE NEW SCHEDULE ===
    const savedSchedule = await prisma.scheduledownlink.create({
      data: {
        devEui,
        downlinkController,
        deviceId: Number(device.id),
        classType,
        pdu,
        port,
        activeStartTime,
        activeEndTime,
        activeDays,
        isEnabled,
        reseduledDay: reseduledDay || null,
      },
    });

    return res.status(200).json({
      message: "Scheduled downlink saved successfully.",
      data: savedSchedule,
    });

  } catch (error) {
    console.error("Error creating scheduled downlink:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { mapScheduledDownlink };


/////////////////////////////////////////////////

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// const { downlinkLoriot } = require("../controllers/loriotcontroller");

// const mapScheduledDownlink = async (req, res) => {
//   const customerId = req.user.id;

//   const {
//     classType,
//     confirmed, 
//     devEui,
//     downlinkController,
//     pdu,
//     port,
//     isEnabled,
//     activeStartTime,
//     activeEndTime,
//     activeDays,
//     reseduledDay
//   } = req.body;

//     const data = {
//         classType: classType,
//         confirmed: confirmed,
//         devEui: devEui,
//         downlinkController: downlinkController,
//         pdu: pdu,
//         port: port,
//         timeoutMinutes:0
//     }

//   const device = await prisma.device.findFirst({
//     where: { deviceId: devEui },
//   });

//    console.log("device acording to the devEUI in the maptheDownlinkTospecificServer",device)

//   if (!device) {
//     return res.status(404).json({ message: "Device not found" });
//   }

//   const network = await prisma.networkdata.findFirst({
//     where: {
//       organizationId: device.organizationId,
//       networkId: device.networkId,
//     },
//   });

//   console.log("device acording to the network in the maptheDownlinkTospecificServer",network);
//   if (!network) {
//     return res.status(500).json({ message: "Network not found" });
//   }

//   if (network.networkId === 3) {
//     const deviceAppid = network.appid;
//     let packet;

//     let relay1State = "off";
//     let relay2State = "off";

//     if (downlinkController === "relay 1") {
//       packet = generateRelay1Packet(pdu);
//       relay1State = pdu === "on" ? "on" : "off";
//     } else if (downlinkController === "relay 2") {
//       packet = generateRelay2Packet(pdu);
//       relay2State = pdu === "on" ? "on" : "off";
//     } else if (downlinkController === "relay 1+2") {
//       packet = generateBothRelayPacket(pdu);
//       relay1State = pdu === "on" ? "on" : "off";
//       relay2State = pdu === "on" ? "on" : "off";
//     } else {
//          console.log("Invalid downlinkController:", downlinkController);
//          return res.status(400).json({ message: "Invalid downlink controller" });
//     }

//     const payloadForLoriot = {
//       port: data.port,
//       confirmed: data.confirmed || true,
//       data: packet["Payload"],
//       EUI: data.devEui,
//       appid: deviceAppid,
//       priority: 2,
//     };

//      const response = await downlinkLoriot({
//             body: payloadForLoriot,
//             customerId: customerId,
//           });
//   try {
//     // === FIELD-BY-FIELD VALIDATION ===
//     if (!devEui) {
//       return res.status(400).json({ message: "Invalid or missing 'devEui'." });
//     }

//     if (!downlinkController || typeof downlinkController !== "string") {
//       return res.status(400).json({ message: "Invalid or missing 'downlinkController'." });
//     }

//     if (!pdu || typeof pdu !== "string") {
//       return res.status(400).json({ message: "Invalid or missing 'pdu'." });
//     }

//     if (!packet?.Port ) {
//       return res.status(400).json({ message: "Invalid or missing 'port' from packet." });
//     }

//     if (activeStartTime === undefined || typeof activeStartTime !== "number") {
//       return res.status(400).json({ message: "Invalid or missing 'activeStartTime'." });
//     }

//     if (activeEndTime === undefined || typeof activeEndTime !== "number") {
//       return res.status(400).json({ message: "Invalid or missing 'activeEndTime'." });
//     }

//     if (activeStartTime >= activeEndTime) {
//       return res.status(400).json({ message: "'activeStartTime' must be less than 'activeEndTime'." });
//     }

//     if (!Array.isArray(activeDays) || activeDays.length === 0) {
//       return res.status(400).json({ message: "'activeDays' must be a non-empty." });
//     }

//     // === CHECK DEVICE EXISTENCE ===
//     const device = await prisma.device.findFirst({
//       where: { deviceId: devEui },
//     });

//     if (!device) {
//       return res.status(404).json({ message: "Device not found." });
//     }

//     // === FETCH EXISTING ENABLED SCHEDULES ===
//     const existingSchedules = await prisma.scheduledownlink.findMany({
//       where: {
//         devEui,
//         deviceId: Number(device.id),
//         isEnabled: true,
//       },
//     });

//     const newStart = activeStartTime;
//     const newEnd = activeEndTime;
//     const newDays = activeDays;

//     // === CHECK FOR TIME/DAY CONFLICTS ===
//     const hasConflict = existingSchedules.some((schedule) => {
//       const existingStart = schedule.activeStartTime;
//       const existingEnd = schedule.activeEndTime;
//       const existingDays = schedule.activeDays || [];

//       const dayOverlap = newDays.some((day) => existingDays.includes(day));
//       const timeOverlap = newStart < existingEnd && existingStart < newEnd;

//       return dayOverlap && timeOverlap;
//     });

//     if (hasConflict) {
//       return res.status(400).json({
//         message: "Conflict: Schedule overlaps with an existing one for the same day and time range.",
//       });
//     }

//     // === SAVE SCHEDULE ===
//     const savedSchedule = await prisma.scheduledownlink.create({
//       data: {
//         devEui,
//         downlinkController,
//         deviceId: Number(device.id),
//         classType,
//         pdu,
//         port: packet.Port,
//         activeStartTime,
//         activeEndTime,
//         activeDays,
//         isEnabled: true,
//         reseduledDay: null,
//         lastTriggeredStart: null,
//         lastTriggeredEnd: null,
//       },
//     });

//     return res.status(200).json({
//       message: "Scheduled downlink saved successfully.",
//       data: savedSchedule,
//     });

//   } catch (error) {
//     console.error("Error while scheduling downlink:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }

//   }

//   // Function to generate packet for Relay 1
//   function generateRelay1Packet(value) {
//     const packet = {};
//     if (value.toLowerCase() === "on") {
//       packet["Payload"] = "030111"; // Relay 1: On
//     } else if (value.toLowerCase() === "off") {
//       packet["Payload"] = "030011"; // Relay 1: Off
//     } else {
//       packet["Payload"] = "031111"; // Relay 1: No change
//     }
//     packet["Port"] = "2";
//     return packet;
//   }

//   // Function to generate packet for Relay 2
//   function generateRelay2Packet(value) {
//     const packet = {};
//     if (value.toLowerCase() === "on") {
//       packet["Payload"] = "031101"; // Relay 2: On
//     } else if (value.toLowerCase() === "off") {
//       packet["Payload"] = "031100"; // Relay 2: Off
//     } else {
//       packet["Payload"] = "031111"; // Relay 2: No change
//     }
//     packet["Port"] = "2";
//     return packet;
//   }

//   // Function to generate packet for Relay 1 and Relay 2
//   function generateBothRelayPacket(value) {
//     const packet = {};
//     if (value.toLowerCase() === "on") {
//       packet["Payload"] = "030101"; // Both Relays: On
//     } else if (value.toLowerCase() === "off") {
//       packet["Payload"] = "030000"; // Both Relays: Off
//     } else {
//       packet["Payload"] = "031111"; // No change
//     }
//     packet["Port"] = "2";
//     return packet;
//   }
// };

// module.exports = { mapScheduledDownlink }