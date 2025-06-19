const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { postDownlinkDevice } = require('../controllers/downlinkController');
const { downlinkLoriot } = require("../controllers/loriotcontroller");
const {controllerPDUByModel} = require('../helper/controllerPDUbyModel');

const mapTheDownlinkAndRoutetoSpecificServer = async (req, res) => {
    const {
        classType,
        confirmed,
        devEui,
        downlinkController,
        pdu,
        port,
        timeoutMinutes,
        isActive
    } = req.body;

    const data = {
        classType: classType,
        confirmed: confirmed,
        devEui: devEui,
        downlinkController: downlinkController,
        pdu: pdu,
        port: port,
        timeoutMinutes: timeoutMinutes
    }

    const device = await prisma.device.findFirst({
        where: { deviceId: devEui },
        select: {
            networkId: true,
        }
    });

    if (!device) {
        console.log("Device not found with ID:", devEui);
        return res.status(404).json({ message: "Device not found" });
    }
    const network = await prisma.networkdata.findFirst({
        where: {
            networkId: device.networkId,
        }
    })
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

        //step 3:---- decode the data into the relevant payloadf format
        
        //first get the hardware through devEUI and modelNumber.
        const deviceData = await prisma.device.findFirst({
            where:{
                deviceId:devEui
            },
            select:{
                hardwareId:true
            }
        })

        const hardwareData = await prisma.hardware.findFirst({
            where:{
                id:deviceData.hardwareId,
            },
            select:{
                id:true,
                decoderPDU:true,
                modelNo:true
            }
        });
        console.log("device and hardware data",deviceData,hardwareData);

        //then call the decodePDU for that hardware
        const modelNumber = hardwareData.modelNo;

        //last step to call the mapping;
        const controllerPDUData = {
            downlinkController: downlinkController,
            pdu: pdu
        }
        console.log(controllerPDUData);
        const responseOfControllerPDU = await controllerPDUByModel(controllerPDUData, modelNumber);

        console.log("data after the controllerPDU",responseOfControllerPDU);
        //return responseOfControllerPDU;
        const payloadForLoriot = {
            port: data.port,
            confirmed: data.confirmed || true, 
            data: responseOfControllerPDU?.Payload,
            EUI: data.devEui,
            appid: deviceAppid,
            priority: 2
        }
       
        if (isActive === true) {

       	const Device = await prisma.device.findFirst({
                where: { deviceId: devEui }
        });
            const response = await downlinkLoriot({ body: payloadForLoriot });
            if (response.status === 200) {
                const savedDownlink = await prisma.downlinkdevice.create({
                    data: {
                        downlinkController: downlinkController,
                        classType: classType,
                        devEui: devEui,
                        pdu: pdu,
                        port: responseOfControllerPDU?.port,
                        payload: responseOfControllerPDU?.payload,
                        deviceId: device.id,
                        timeoutMinutes: data.timeoutMinutes
                    }
                });
                console.log("Saved Downlink Device:", savedDownlink);
                const autoDownlinkWithdelay = await prisma.autodownlinkwithdelay.create({
                    data: {
                        downlinkController,
                        classType,
                        devEui,
                        pdu,
                        isActive: true,
                        timeoutMinutes: Number(timeoutMinutes),
                        port: Number(responseOfControllerPDU?.port),
                        deviceId: Number(Device.id)
                    }
                });
                console.log("Saved autoDownlinkWithDelay:", autoDownlinkWithdelay);
            }
            return res.status(response.status).json(response.data);
        } else {
            const response = await downlinkLoriot({ body: payloadForLoriot });
            if (response.status === 200) {
                const savedDownlink = await prisma.downlinkdevice.create({
                    data: {
                        downlinkController: downlinkController,
                        classType: classType,
                        devEui: devEui,
                        pdu: pdu,
                        port: responseOfControllerPDU?.port,
                        payload: responseOfControllerPDU?.payload,
                        deviceId: device.id,
                        timeoutMinutes: data.timeoutMinutes
                    }
                });
            }

            return res.status(response.status).json(response.data);
        }

    } else {
        return res.status(500).json({ message: "Invalid network ID" });
    }
}


module.exports = { mapTheDownlinkAndRoutetoSpecificServer };
