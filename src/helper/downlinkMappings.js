const { prisma } = require('../lib/prisma.js');
const { postDownlinkDevice } = require("../controllers/downlinkController");
const { downlinkLoriot } = require("../controllers/loriotcontroller");
const { controllerPDUByModel } = require("../helper/controllerPDUbyModel");
const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");

const mapTheDownlinkAndRoutetoSpecificServer = async (req, res) => {
  const customerId = req.user.id;

  console.log("checking the customerId", customerId);
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

  const data = {
    classType: classType,
    confirmed: confirmed,
    devEui: devEui,
    downlinkController: downlinkController,
    pdu: pdu,
    port: port,
    timeoutMinutes: timeoutMinutes,
  };

  const device = await prisma.device.findFirst({
    where: { deviceId: devEui },
  });
  console.log(
    "device acording to the devEUI in the maptheDownlinkTospecificServer",
    device
  );
  if (!device) {
    console.log("Device not found with ID:", devEui);
    return res.status(404).json({ message: "Device not found" });
  }
  const network = await prisma.networkdata.findFirst({
    where: {
      organizationId: device.organizationId,
      networkId: device.networkId,
      customerId: customerId,
    },
  });
  console.log(
    "device acording to the network in the maptheDownlinkTospecificServer",
    network
  );
  if (!network) {
    return res.status(500).json({ message: "network not found" });
  }

  if (network.networkId === 1) {
    //senra
    const response = await postDownlinkDevice(data);
    return res.status(response.status).json(response.data);
  } else if (network.networkId === 2) {
    //TTn
  } else if (network.networkId === 3) {
    //Loriot
    // create the mapping for the latest data

    //step 2   :---- second data for the paload from the deviceLevel like appid
    const deviceAppid = network.appid;

    //step 3:---- decode the data into the relevant Payloadf format
    // const deviceData = await prisma.device.findFirst({
    //     where: {
    //         deviceId: devEui
    //     },
    //     select: {
    //         hardwareId: true
    //     }
    // })

    const hardwareData = await prisma.hardware.findFirst({
      where: {
        id: device.hardwareId,
      },
      select: {
        id: true,
        //decoderPDU:true,
        modelNo: true,
      },
    });
    console.log("device and hardware data", device, hardwareData);

    //then call the decodePDU for that hardware
    const modelNumber = hardwareData.modelNo;

    //last step to call the mapping;
    const controllerPDUData = {
      downlinkController: downlinkController,
      pdu: pdu,
    };
    console.log(controllerPDUData);
    const responseOfControllerPDU = await controllerPDUByModel(
      controllerPDUData,
      modelNumber
    );

    console.log("data after the controllerPDU", responseOfControllerPDU);

    const PayloadForLoriot = {
      port: responseOfControllerPDU?.Port,
      confirmed: data.confirmed || true,
      data: responseOfControllerPDU?.Payload,
      EUI: data.devEui,
      appid: deviceAppid,
      priority: 2,
    };

    if (isActive === true) {
      const Device = await prisma.device.findFirst({
        where: { deviceId: devEui },
      });
      const response = await downlinkLoriot({
        body: PayloadForLoriot,
        customerId: customerId,
      });
      if (response.status === 200) {
        const savedDownlink = await prisma.downlinkdevice.create({
          data: {
            downlinkController: downlinkController,
            classType: classType,
            devEui: devEui,
            pdu: pdu,
            port: responseOfControllerPDU?.Port,
            payload: responseOfControllerPDU?.Payload,
            deviceId: device.id,
            timeoutMinutes: data.timeoutMinutes,
          },
        });

        console.log("Saved Downlink Device:", savedDownlink);
        const autoDownlinkWithdelay = await prisma.autodownlinkwithdelay.create(
          {
            data: {
              downlinkController,
              classType,
              devEui,
              pdu,
              isActive: true,
              timeoutMinutes: Number(timeoutMinutes),
              port: Number(responseOfControllerPDU?.Port),
              deviceId: Number(Device.id),
            },
          }
        );
        console.log("Saved autoDownlinkWithDelay:", autoDownlinkWithdelay);
      }
      return res.status(response.status).json(response.data);
    } else {
      const response = await downlinkLoriot({
        body: PayloadForLoriot,
        customerId: customerId,
      });
      if (response.status === 200) {
        const savedDownlink = await prisma.downlinkdevice.create({
          data: {
            downlinkController: downlinkController,
            classType: classType,
            devEui: devEui,
            pdu: pdu,
            port: responseOfControllerPDU?.Port,
            payload: responseOfControllerPDU?.Payload,
            deviceId: device.id,
            timeoutMinutes: data.timeoutMinutes,
          },
        });
      }
      try {
        const latestDownlinkData = await prisma.downlinkdevice.findFirst({
          where: { devEui },
          orderBy: { createdAt: "desc" },
        });


        console.log("Latest downlink data:", latestDownlinkData);

        if (latestDownlinkData?.createdAt && device.location) {
          const match = device.location.match(/Latitude:\s*([-\d.]+),\s*Longitude:\s*([-\d.]+)/);

          if (match) {
            const latitude = parseFloat(match[1]);
            const longitude = parseFloat(match[2]);
            const deviceTimezone = tzlookup(latitude, longitude);

            const createdAtUTC = moment.utc(latestDownlinkData.createdAt);
            const createdAtDeviceTime = createdAtUTC.clone().tz(deviceTimezone);
            const downlinkDay = createdAtDeviceTime.format("ddd"); // "Mon", "Tue", etc.
            const downlinkMinutes = createdAtDeviceTime.hours() * 60 + createdAtDeviceTime.minutes();

            const matchingSchedules = await prisma.scheduledownlink.findMany({
              where: {
                devEui,
                activeDays: {
                  array_contains: [downlinkDay],
                },
              },
            });

            const updates = matchingSchedules
              .filter(
                (schedule) =>
                  Array.isArray(schedule.activeDays) &&
                  schedule.activeDays.includes(downlinkDay) &&
                  downlinkMinutes >= schedule.activeStartTime &&
                  downlinkMinutes <= schedule.activeEndTime
              )
              .map((schedule) => {
                const updatedActiveDays = schedule.activeDays.filter((d) => d !== downlinkDay);
                const updatedRescheduledDays = Array.from(
                  new Set([...(schedule.reseduledDay || []), downlinkDay])
                );

                return prisma.scheduledownlink.update({
                  where: { id: schedule.id },
                  data: {
                    activeDays: updatedActiveDays,
                    reseduledDay: updatedRescheduledDays,
                  },
                });
              });

            if (updates.length > 0) {
              await prisma.$transaction(updates);
              console.log(`Rescheduled downlink for devEui ${devEui} on ${downlinkDay}`);
            } else {
              console.log("No active schedules to update for this downlink");
            }
          } else {
            console.warn("Invalid device location format");
          }
        } else {
          console.warn("Device location not found or no downlink history");
        }
      } catch (err) {
        console.error("Error while updating schedule days:", err);
      }
      return res.status(response.status).json(response.data);

    }
  } else {
    return res.status(500).json({ message: "Invalid network ID" });
  }
};

module.exports = { mapTheDownlinkAndRoutetoSpecificServer };
