const { prisma } = require('../lib/prisma.js');

const createScheduleDownlink = async (scheduleDownlinkData) => {
  const {
    devEui,
    downlinkController,
    classType,
    pdu,
    port, scheduledEnabled, activeStartTime, activeEndTime, activeDays, deviceId, isActive,
  } = scheduleDownlinkData;
  try {
    const scheduleDownlink = await prisma.scheduledownlink.create({
      data:{
        devEui,
    downlinkController,
    classType,
    pdu,
    port, scheduledEnabled, activeStartTime, activeEndTime, activeDays, deviceId, isActive,
      }
    })
    
    return scheduleDownlink
  } catch (error) {
    console.log("error fetching to send downlink", error);
    throw error
  }
};


const getScheduleDownlinkByProjectId = async (projectId) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT sd.*
      FROM scheduledownlink sd
      JOIN device d ON sd.deviceId = d.id
      WHERE d.projectId = ${projectId}
    `;
    return result;
  } catch (error) {
    console.error("Error in getScheduleDownlinkByProjectId service:", error);
    throw error;
  }
};


const getScheduleDownlinkById = async (id) =>{
  try {
   
    const getScheduleDownlinkData  = await prisma.scheduledownlink.findFirst({
      where :{
        id:parseInt(id)
      }}
    )

    return getScheduleDownlinkData
  }
  catch (error){
    console.log("error fetching to get schedule downlink by id", error)
    throw error;
  }
}


// const updateScheduleDownlinkById = async (id, updateData) => {
//   try {
//     const updatedSchedule = await prisma.scheduledownlink.update({
//       where: {
//         id: parseInt(id),
//       },
//       data: updateData,
//     });

//     return updatedSchedule;
//   } catch (error) {
//     console.log("Error updating schedule downlink:", error);
//     throw error;
//   }
// };


const updateScheduleDownlinkById = async (id, updateData) => {
  try {
    const updatedSchedule = await prisma.scheduledownlink.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    return updatedSchedule;
  } catch (error) {
    console.log("Error updating schedule downlink:", error);
    throw error;
  }
};


const deleteScheduleDownlinkById = async (id) =>{
  try {
    const deleteSchedule = await prisma.scheduledownlink.delete({
      where:{
        id:parseInt(id)
      }
    })

    return deleteSchedule
  }
  catch(error){
     console.log("error fetching to delete schedule", error)
  }
}
module.exports = {createScheduleDownlink, getScheduleDownlinkByProjectId, getScheduleDownlinkById, updateScheduleDownlinkById, deleteScheduleDownlinkById}
