
const scheduleDownlinkService = require("../services/scheduldeDownlinkService");

const createScheduleDownlink = async (req, res) => {
  try {
    const data = req.body;
    const result = await scheduleDownlinkService.createScheduleDownlink(data);

    return res.status(201).json({
      message: "Schedule downlink created successfully",
      scheduleDownlink: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create scheduled downlink",
      error: error.message,
    });
  }
};

const getScheduleDownlinkByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const scheduleData =
      await scheduleDownlinkService.getScheduleDownlinkByProjectId(
        Number(projectId)
      );

    return res.status(200).json({
      message: "Schedule downlink fetched successfully",
      data: scheduleData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch schedule downlink by projectId",
      error: error.message,
    });
  }
};

const getScheduleDownlinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const scheduleData = await scheduleDownlinkService.getScheduleDownlinkById(
      id
    );

    return res.status(200).json({
      message: "fetch schedule downlink data successfull",
      data: scheduleData,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to fetch schedule downlink based on id",
      error: error.message,
    });
  }
};

const updateScheduleDownlink = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "Invalid or missing schedule 'id' in request params.",
      });
    }

    const scheduleId = parseInt(id);
    const updateData = req.body;

    const existingSchedule = await prisma.scheduledownlink.findUnique({
      where: { id: scheduleId },
    });

    if (!existingSchedule) {
      return res.status(404).json({
        message: `No schedule found with ID: ${id}`,
      });
    }

    const {
      devEui,
      downlinkController,
      pdu,
      port,
      activeStartTime,
      activeEndTime,
      isEnabled,
      activeDays,
      reseduledDay,
    } = updateData;

    if (typeof updateData.isEnabled !== "undefined") {
      updateData.isEnabled = Boolean(updateData.isEnabled);
    }

    if (!devEui) return res.status(400).json({ message: "Missing 'devEui'" });
    if (!downlinkController || typeof downlinkController !== "string")
      return res.status(400).json({ message: "Missing 'downlinkController'" });
    if (!pdu || typeof pdu !== "string")
      return res.status(400).json({ message: "Missing 'pdu'" });
    if (!port) return res.status(400).json({ message: "Missing 'port'" });
    if (typeof activeStartTime !== "number")
      return res
        .status(400)
        .json({ message: "Missing or invalid 'activeStartTime'" });
    if (typeof activeEndTime !== "number")
      return res
        .status(400)
        .json({ message: "Missing or invalid 'activeEndTime'" });
    if (activeStartTime >= activeEndTime)
      return res.status(400).json({
        message: "'activeStartTime' must be less than 'activeEndTime'",
      });
    if (!Array.isArray(activeDays) || activeDays.length === 0)
      return res.status(400).json({
        message: "'activeDays' must be a non-empty array",
      });

    const device = await prisma.device.findFirst({
      where: { deviceId: devEui },
    });
    if (!device) return res.status(404).json({ message: "Device not found" });

    const existingScheduleResDays = await prisma.scheduledownlink.findUnique({
      where: { id: scheduleId },
      select: { reseduledDay: true },
    });

    const activeDaysSet = new Set(updateData.activeDays);
    const rescheduledSet = new Set(existingScheduleResDays.reseduledDay || []);
    const conflicts = [...activeDaysSet].filter((day) =>
      rescheduledSet.has(day)
    );

    // if (conflicts.length > 0) {
    //   return res.status(400).json({
    //     message: `Conflict: 'activeDays' [${conflicts.activeDaysSet}] and 'reseduledDay' ${conflicts.reseduledDay} must not contain the same days.`,
    //     conflictDays: conflicts,
    //   });
    // }

    if (conflicts.length > 0) {
      const activeDaysStr = Array.from(activeDaysSet).join(", ");
      const rescheduledDaysStr = Array.from(rescheduledSet).join(", ");
      const conflictDaysStr = conflicts.join(", ");

      return res.status(400).json({
        message: `Conflict: The following day(s) [${conflictDaysStr}] already exist in 'reseduledDay' [${rescheduledDaysStr}]. Please remove them from 'activeDays' to avoid duplication.`,
      });
    }

    // Duplicate schedule conflict check
    const existingSchedules = await prisma.scheduledownlink.findMany({
      where: {
        devEui,
        deviceId: device.id,
        NOT: { id: scheduleId },
      },
    });

    const hasConflict = existingSchedules.some((schedule) => {
      const dayOverlap = activeDays.some((day) =>
        schedule.activeDays.includes(day)
      );
      const timeOverlap =
        activeStartTime < schedule.activeEndTime &&
        schedule.activeStartTime < activeEndTime;
      return dayOverlap && timeOverlap;
    });

    if (hasConflict) {
      return res.status(400).json({
        message:
          "Conflict: Updated schedule overlaps with an existing enabled schedule.",
      });
    }

    updateData.deviceId = device.id;

    // Deduplicate activeDays
    updateData.activeDays = [...new Set(updateData.activeDays)];

    const updatedSchedule =
      await scheduleDownlinkService.updateScheduleDownlinkById(
        scheduleId,
        updateData
      );

    return res.status(200).json({
      message: "Schedule downlink update successful",
      data: updatedSchedule,
    });
  } catch (error) {
    console.error("Update Schedule Error:", error);
    return res.status(500).json({
      message: "Internal server error while updating schedule",
      error: error.message,
    });
  }
};
const deleteScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSchedule =
      await scheduleDownlinkService.deleteScheduleDownlinkById(id);

    res.status(200).json({
      message: "schedule delete successfull",
      data: deleteSchedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "error fetching to delete schedule",
      error: error.message,
    });
  }
};

module.exports = {
  createScheduleDownlink,
  getScheduleDownlinkByProjectId,
  getScheduleDownlinkById,
  updateScheduleDownlink,
  deleteScheduleById,
};
