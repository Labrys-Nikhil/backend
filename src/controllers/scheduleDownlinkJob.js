
// const { prisma } = require('../lib/prisma.js');
const moment = require("moment-timezone");

const { controllerPDUByModel } = require("../helper/controllerPDUbyModel");
const { downlinkLoriot } = require("../controllers/loriotcontroller");
const { postDownlinkDevice } = require("../controllers/downlinkController"); 
const tzlookup = require("tz-lookup");

const checkTimeAccordingTODeviceTimezone = (deviceData) => {
  if (!deviceData || !deviceData.location) {
    console.warn("Device data or location not found");
    return;
  }

  // Extract latitude and longitude from string

  const match = deviceData.location.match(/Latitude:\s*([-\d.]+),\s*Longitude:\s*([-\d.]+)/);

  if (!match) {
    console.warn("Invalid location format");
    return;
  }

  const latitude = parseFloat(match[1]);
  const longitude = parseFloat(match[2]);

  let deviceTimezone;
  try {
    deviceTimezone = tzlookup(latitude, longitude);
  } catch (err) {
    console.warn("Could not resolve timezone:", err);
    return;
  }

  const nowUTC = moment.utc();
  const nowInDeviceTimezone = nowUTC.tz(deviceTimezone);

  const currentDay = nowInDeviceTimezone.format("ddd"); // "Mon"
  const currentMinutes = nowInDeviceTimezone.hours() * 60 + nowInDeviceTimezone.minutes();

  console.log(`Device Timezone: ${deviceTimezone}`);
  console.log("Time:", currentMinutes, "| Day:", currentDay);

  return { currentDay, currentMinutes, timezone: deviceTimezone };
};

const checkScheduledDownlink = async (req, res) => {
  try {
    // const now = new Date();
    // const currentDay = moment().format("ddd"); // E.g., "Mon"
    // const currentMinutes = now.getHours() * 60 + now.getMinutes();

    //  const nowUTC = moment.utc(); // Get UTC time
    
    // const currentMinutes = nowUTC.hours() * 60 + nowUTC.minutes(); // Total minutes since midnight in UTC
    // console.log("Time:", currentMinutes, "| Day:", currentDay);

    const currentDay = moment.utc().format("ddd"); // e.g., "Mon"
    const downlinks = await prisma.scheduledownlink.findMany({
      where: {
        isEnabled: true,
        activeDays: {
          array_contains: [currentDay],
        },
      },
    });

    console.log("Downlinks fetched", downlinks.length);

    for (const downlink of downlinks) {
      const {
        id,
        devEui,
        deviceId,
        downlinkController,
        pdu,
        classType,
        activeStartTime,
        activeEndTime,
      } = downlink;

      console.log("downlink data is : ", downlink)

      //fetch the individual device Data
      const deviceData = await prisma.device.findFirst({
        where: { deviceId: devEui },
      });
      // // //check according to the device timezone
      // const tzValue = checkTimeAccordingTODeviceTimezone(deviceData);
      // console.log(tzValue);

      // if (![activeStartTime, activeEndTime].includes(tzValue.currentMinutes)) {
      //   continue;
      // }

      const timeInfo = checkTimeAccordingTODeviceTimezone(deviceData);
      if (!timeInfo) {
        console.warn(`Timezone info not available for devEui: ${devEui}`);
        continue;
      }


      const { currentMinutes, currentDay } = timeInfo;

      if (![activeStartTime, activeEndTime].includes(currentMinutes)) {
        console.log(`Skipped: Not active time for ${devEui}`);
        console.log(`Scheduled Start: ${activeStartTime}, End: ${activeEndTime}`);
        continue;
      }

      const scheduledPduToSend =
        currentMinutes === activeEndTime
          ? pdu === "on"
            ? "off"
            : "on"
          : pdu;

      console.log(
        `Sending payload for ${devEui} | Scheduled PDU: ${pdu} | Time: ${currentMinutes} | Action: ${scheduledPduToSend}`
      );

      const device = await prisma.device.findFirst({ where: { deviceId: devEui } });
      if (!device) {
        console.warn(`Device not found for devEui: ${devEui}`);
        continue;
      }

      const customerData = await prisma.organization.findFirst({
        where: { id: device.organizationId },
        select: { customerId: true },
      });

      const network = await prisma.networkdata.findFirst({
        where: {
          networkId: device.networkId,
          organizationId: device.organizationId,
          customerId: customerData?.customerId,
        },
      });

      if (!network) {
        console.warn(`Network not found for devEui: ${devEui}`);
        continue;
      }

      const controllerPDUData = {
        downlinkController: downlinkController?.replace(/\s+/g, "").toLowerCase(),
        pdu: scheduledPduToSend,
      };

      const hardware = await prisma.hardware.findFirst({
        where: { id: device.hardwareId },
        select: { modelNo: true },
      });

      const responseOfControllerPDU = await controllerPDUByModel(
        controllerPDUData,
        hardware?.modelNo
      );

      if (!responseOfControllerPDU?.Payload) {
        console.warn(`Payload not generated for devEui: ${devEui}`);
        continue;
      }

      const payload = {
        port: responseOfControllerPDU?.Port,
        confirmed: true,
        data: responseOfControllerPDU?.Payload,
        EUI: devEui,
        appid: network.appid,
        priority: 2,
      };

      if (network.networkId === 1) {
        await postDownlinkDevice({
          classType,
          confirmed: true,
          devEui,
          downlinkController: controllerPDUData.downlinkController,
          pdu: scheduledPduToSend,
          port: responseOfControllerPDU?.Port,
          timeoutMinutes: 0,
        });
      } else if (network.networkId === 3) {
        const response = await downlinkLoriot({
          body: payload,
          customerId: customerData?.customerId,
        });

        if (response.status === 200) {
          await prisma.downlinkdevice.create({
            data: {
              downlinkController: controllerPDUData.downlinkController,
              classType,
              devEui,
              pdu: scheduledPduToSend,
              port: responseOfControllerPDU?.Port,
              payload: responseOfControllerPDU?.Payload,
              deviceId: device.id,
              timeoutMinutes: 0,
            },
          });

          console.log(`Downlink success for ${devEui} | Sent PDU: ${scheduledPduToSend}`);
        } else {
          console.error("Loriot response failed", response.data);
        }
      } else {
        console.warn(`Unsupported networkId: ${network.networkId}`);
      }
    }

    if (res) {
      return res.status(200).json({ message: "Scheduled downlink check completed." });
    }
  } catch (err) {
    console.error("Scheduled Downlink Error:", err.message);
    if (res) {
      return res.status(500).json({ message: err.message });
    }
  }
};


const resetRescheduledDays = async () => {
  try {
    const allSchedules = await prisma.scheduledownlink.findMany({
      where: {
        isEnabled: true,
        NOT: {
          reseduledDay: {
            equals: [],
          },
        },
      },
    });

    for (const schedule of allSchedules) {
      const updatedActiveDays = Array.from(new Set([
        ...(schedule.activeDays || []),
        ...(schedule.reseduledDay || []),
      ]));

      await prisma.scheduledownlink.update({
        where: { id: schedule.id },
        data: {
          activeDays: updatedActiveDays,
          reseduledDay: [],
        },
      });

      console.log(`Reset reseduledDay to activeDays for ID ${schedule.id}`);
    }
  } catch (err) {
    console.error(" Error resetting rescheduledDays:", err.message);
  }
};

module.exports = {
  checkScheduledDownlink,
  resetRescheduledDays,
};

