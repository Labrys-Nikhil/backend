const {prisma} = require('../lib/prisma.js');

const addWidgetData = async (req, res) => {
  try {
    const { pageName, stepOneData, stepTwoData, stepThreeData, projectId } = req.body;

    if (!pageName) {
      return res.status(400).json({ error: 'Page name is required.' });
    }

    const widget = await prisma.addwidget.create({
      data: {
        pageName,
        stepOneData,
        stepTwoData,
        stepThreeData,
        projectId,
      },
    });

    res.status(201).json(widget);
  } catch (error) {
    console.error('Error saving widget:', error);
    res.status(500).json({ error: 'An error occurred while saving the widget.' });
  }
}

// const getSpecificPageWidgetData = async(req,res)=>{
//     try {
//         const { pageName } = req.params;

//     const widgets = await prisma.addWidget.findMany({
//       where: { page:pageName },
//     });

//     res.status(200).json(widgets);
//     } catch (eror) {
//         console.error('Error fetching widget:', error);
//       res.status(500).json({ error: 'An error occurred while fetching the widget.' });
//     }
// }

const getSpecificPageWidgetData = async (req, res) => {
  try {
    // Extract pageName from query parameters or request body
    const { pageName } = req.query; // Use req.body if it's sent in the body
    const { projectId } = req.params;

    console.log("Received request to fetch widgets for page and projectId:", pageName, projectId);

    if (!pageName || !projectId) {
      console.log("Page name is missing in the request.");
      return res.status(400).json({ error: 'Page name is required.' });
    }

    // Query the database to find widgets for the specified page name
    const widgets = await prisma.addwidget.findMany({
      where: {
        pageName: pageName,
        projectId: parseInt(projectId)
      },
    });

    console.log("Fetched widgets from the database:", widgets);

    res.status(200).json({ widgets });
  } catch (error) {
    console.error('Error fetching widget:', error);
    res.status(500).json({ error: 'An error occurred while fetching the widget.' });
  }
};

const getWidgetDataById = async (req, res) => {
  const { id } = req.params;

  try {
    const getWidget = await prisma.addwidget.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({
      message: "Get chart data successful by ID",
      data: getWidget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get chart data",
      error: error.message,
    });
  }
};

//Delete chart by ID
const deleteChartById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWidget = await prisma.addwidget.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({
      message: 'Chart deleted successfully',
      data: deletedWidget,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete chart',
      error: error.message,
    });
  }
}

const updateChartById = async (req, res) => {
  const { id } = req.params;
  const { pageName, stepOneData, stepTwoData, stepThreeData, projectId } = req.body;

  try {
    const updatedWidget = await prisma.addwidget.update({
      where: { id: parseInt(id) },
      data: {
        pageName,
        stepOneData,
        stepTwoData,
        stepThreeData,
        projectId,
      },
    });

    return res.status(200).json({
      message: 'Chart updated successfully',
      data: updatedWidget,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update chart',
      error: error.message,
    });
  }
}
module.exports = {
  getSpecificPageWidgetData,
  addWidgetData,
  deleteChartById,
  updateChartById,
  getWidgetDataById
}
