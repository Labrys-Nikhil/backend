const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addWidgetData = async (req, res) => {
    try {
      const { pageName, stepOneData, stepTwoData, stepThreeData,projectId } = req.body;
  
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
      const {projectId} = req.params;

      console.log("Received request to fetch widgets for page and projectId:", pageName,projectId);
  
      if (!pageName || !projectId) {
        console.log("Page name is missing in the request.");
        return res.status(400).json({ error: 'Page name is required.' });
      }
  
      // Query the database to find widgets for the specified page name
      const widgets = await prisma.addwidget.findMany({
        where: { 
          pageName: pageName,
          projectId:parseInt(projectId)
        },
      });
  
      console.log("Fetched widgets from the database:", widgets);
  
      res.status(200).json({ widgets });
    } catch (error) {
      console.error('Error fetching widget:', error);
      res.status(500).json({ error: 'An error occurred while fetching the widget.' });
    }
  };
  
module.exports = {
    getSpecificPageWidgetData,
    addWidgetData
}