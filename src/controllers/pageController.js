const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getallpages = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Query the database to find all pages for the specified projectId
    const pages = await prisma.pages.findMany({
      where: {
        projectId: parseInt(projectId, 10),
      },
    });

    // Return the data as a response
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to retrieve pages' });
  }
};

const getChartPageNamebyProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Query the database for widgets with the specified projectId
    const allChartData = await prisma.addwidget.findMany({
      where: {
        projectId: parseInt(projectId), // Ensure projectId is treated as an integer
      },
      select: {
        stepTwoData: true, // Only fetch the stepTwoData field
      },
    });

    // Extract only 'name' from stepTwoData where 'name' exists
    const names = allChartData
      .map((widget) => widget.stepTwoData?.name) // Extract 'name' if it exists
      .filter((name) => name); // Remove null or undefined names

    // Return the extracted names
    res.status(200).json({ names });
  } catch (error) {
    console.error('Error fetching names from stepTwoData:', error);
    res.status(500).json({ error: 'Failed to retrieve names from stepTwoData' });
  }
};

const createPage = async (req, res) => {
  try {
    const { pageName, projectId } = req.body;

    const existingPage = await prisma.pages.findFirst({ where: { projectId:parseInt(projectId), pageName } });
    if (existingPage) {
      return res.status(409).json({ message: 'Page name already exists for this project.' });
    }

    // Check if the required fields are provided
    if (!pageName || !projectId) {
      return res.status(400).json({ error: 'Page name and project ID are required.' });
    }

    console.log('Received request to create a new page with pageName:', pageName, 'and projectId:', projectId);

    // Create a new page in the database
    const newPage = await prisma.pages.create({
      data: {
        pageName,
        projectId,
      },
    });

    console.log('Created new page:', newPage);

    res.status(201).json({ message: 'Page created successfully.', page: newPage });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'An error occurred while creating the page.' });
  }
};
const updateRefreshInterval = async (req, res) => {
  try{

    const {projectId, pageName, pageId} = req.params;
    const {refershInterval} = req.body;

    if(!refershInterval){
      return res.status(400).json({error:"TimeInterval is required"});
    }

    if(!projectId || !pageName || !pageId){
      return res.status(400).json({ error: 'Page name project ID and pageId are required.' });
    }

    const updatedPage = await prisma.pages.update({
      where:{
        id:Number(pageId),
        projectId: Number(projectId),
        pageName:pageName
      },
      data:{
        refershInterval: Number(refershInterval)
      }
    });

    return res.status(200).json({"message":"refersh interval updated successfully"});

  } catch(error){
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'An error occurred while Updating the refresh Interval for the page.' });
  }
}

const deletePageByProjectIdProjectName = async (req, res) => {
  try{

    const {projectId, pageName, pageId} = req.params;

    if(!projectId || !pageName || !pageId){
      return res.status(400).json({ error: 'Page name project ID and pageId are required.' });
    }

    // console.log("this is pageId", pageId);

    if(pageName == "LiveDashboard" || pageName == "MyDashboard"){
      return res.status(400).json({ error: 'Not allowed to delete this page'});
    }

    const deletedWidget = await prisma.addwidget.deleteMany({
      where:{
        projectId:Number(projectId),
        pageName:pageName
      }
    });

    const deletedPage = await prisma.pages.delete({
      where:{
        id:Number(pageId),
        projectId:Number(projectId),
        pageName:pageName
      }
    });


    return res.status(200).json({"message":"page deleted successfully"});


  } catch(error){
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'An error occurred while Updating the refresh Interval for the page.' });
  }
}
module.exports = { getallpages, createPage,getChartPageNamebyProjectId,deletePageByProjectIdProjectName,updateRefreshInterval  };
