const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new label
const createLabel = async (req, res) => {
  const { name, description, color, projectId, deviceId, conditionValue, outputId, outputName, conditionOperator } = req.body;

  try {
    const newLabel = await prisma.label.create({
      data: {
        name,
        description,
        color,
        projectId,
        deviceId,
        conditionValue: parseInt(conditionValue),
        outputId: parseInt(outputId),
        outputName,
        conditionOperator,
      },
    });
    res.status(201).json(newLabel);
  } catch (error) {
    console.error("Error creating label:", error);
    res.status(500).json({ error: "Failed to create label" });
  }
};

// Get all labels
const getAllLabels = async (req, res) => {
  try {
    const labels = await prisma.label.findMany({
      where:{
        
      }
  });
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ error: "Failed to fetch labels" });
  }
};

// Get a label by project ID
const getLabelByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    const labels = await prisma.label.findMany({
      where: { projectId: parseInt(projectId, 10) },
    });

    if (!labels || labels.length === 0) {
      return res.status(404).json({ error: "Labels not found for the given project ID" });
    }

    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ error: "Failed to fetch labels" });
  }
};

// Update a label by ID
const updateLabel = async (req, res) => {
  const { id } = req.params;
  const { name, description, color, deviceId, conditionValue, conditionOperator, outputId,
    outputName, } = req.body;

  try {
    const updatedLabel = await prisma.label.update({
      where: { id: parseInt(id, 10) },
      data: { name, description, color, deviceId, conditionValue: Number(conditionValue), outputId: Number(outputId), outputName, conditionOperator },
    });

    res.status(200).json(updatedLabel);
  } catch (error) {
    console.error("Error updating label:", error);
    res.status(500).json({ error: "Failed to update label" });
  }
};
const getDataByDeviceId = async (req, res) => {
  const { deviceId } = req.params;
  //first find the deviceId as devEUI is passed as deviceId in this
  const deviceResponse = await prisma.device.findMany({
    where: { deviceId: deviceId },
  });
  console.log('found deviceId',deviceResponse[0]);
  try {
    const labels = await prisma.label.findMany({
      where: { deviceId: deviceResponse[0].id },
    });
    console.log("found labels",labels);
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    return [];
  }
}
// Delete a label by ID
const deleteLabel = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.label.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ error: "Failed to delete label" });
  }
};
const getActiveLabelByDevEUI = async (req, res) => {
  const {projectId, devEUI, outputName, outputValue} = req.params;

  // const {outputName, outputValue} = req.body;

  if(!projectId || !devEUI || !outputName || !outputValue){
    return res.status(400).json({ error: 'ProjectId DevEui and OutputName outputValue is required.' });
  }
  try{

    const device = await prisma.device.findFirst({
      where:{
        deviceId:devEUI
      }
    });

    if(!device){
      return res.status(400).json({"error":"Device not found"});
    }


    //first get for gt gte and eq (descending)
    const allLabelDataForOutputGTGTEEQ = await prisma.label.findMany({
      where: {
        projectId: Number(projectId),
        deviceId: device.id,
        outputName: outputName,
        conditionOperator:{
          in:["EQ","GT","GTE"]
        }
      },
      orderBy: {
        conditionValue:"desc" // or 'desc' depending on your desired order
      },
    });

    let activeLabel  = null;

    for(let i = 0;i<allLabelDataForOutputGTGTEEQ.length;i++){

      if(allLabelDataForOutputGTGTEEQ[i].conditionOperator == "EQ"){

        if(Number(outputValue) === Number(allLabelDataForOutputGTGTEEQ[i].conditionValue)){
          activeLabel = allLabelDataForOutputGTGTEEQ[i];

          break;
        }

      } else if(allLabelDataForOutputGTGTEEQ[i].conditionOperator == "GT"){

        if(Number(outputValue) > Number(allLabelDataForOutputGTGTEEQ[i].conditionValue)){
          activeLabel = allLabelDataForOutputGTGTEEQ[i];
          break;  
        }


      } else if(allLabelDataForOutputGTGTEEQ[i].conditionOperator == "GTE"){
        if(Number(outputValue) >= Number(allLabelDataForOutputGTGTEEQ[i].conditionValue)){
          activeLabel = allLabelDataForOutputGTGTEEQ[i];
          break;
        }

      } 

    }

    //second get for lt lte (ascending)

    const allLabelDataForOutputLTLTE = await prisma.label.findMany({
      where: {
        projectId: Number(projectId),
        deviceId: device.id,
        outputName: outputName,
        conditionOperator:{
          in:["LT","LTE"]
        }
      },
      orderBy: {
        conditionValue:"asc" // or 'desc' depending on your desired order
      },
    });

    // console.log(allLabelDataForOutputLTLTE);


    for(let i = 0;i<allLabelDataForOutputLTLTE.length;i++){

      if(allLabelDataForOutputLTLTE[i].conditionOperator == "LT"){
        // console.log("hii");

        if(Number(outputValue) < Number(allLabelDataForOutputLTLTE[i].conditionValue)){
          // console.log(Number(outputValue) < Number(allLabelDataForOutputLTLTE[i].conditionValue));
          activeLabel = allLabelDataForOutputLTLTE[i];
          break;  
        }


      } else if(allLabelDataForOutputLTLTE[i].conditionOperator == "LTE"){
        if(Number(outputValue) <= Number(allLabelDataForOutputLTLTE[i].conditionValue)){
          activeLabel = allLabelDataForOutputLTLTE[i];
          break;
        }

      } 

    }

    // activeLabel  = null;

    return res.status(200).json(
      {
        activeLabel
      }
    );
    


  } catch (error) {
    console.error("Error findding label:", error);
    res.status(500).json({ error: error });
  }
}
module.exports = {
  createLabel,
  getAllLabels,
  getLabelByProjectId,
  updateLabel,
  deleteLabel,
  getDataByDeviceId,
  getActiveLabelByDevEUI
};

