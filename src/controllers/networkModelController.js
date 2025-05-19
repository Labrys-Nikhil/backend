const networkModelService = require('../services/networkModelService')

const createNetworkModel = async (req, res) => {
    const { name, server, method } = req.body;
    try {
      const networkModelData = await networkModelService.createNetworkModel({
        name,
        server,
        method,
      });
      return res.status(201).json({
        success: true,
        data: networkModelData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
        message:error,
      });
    }
  };
  
  const fetchAllNetworkModel = async (req, res) => {
    try {
      const data = await networkModelService.getAllNetworkModel();
      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
  
  const fetchNetworkModelById = async (req, res) => {
    try {
      const data = await networkModelService.getNetworkModelById(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          error: "Network model not found",
        });
      }
      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
  
  const updateNetworkModel = async (req, res) => {
    try {
      const data = await networkModelService.updateNetworkModel(req.params.id, req.body);
      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
  
  const deleteNetworkModel = async (req, res) => {
    try {
      await networkModelService.deleteNetworkModel(req.params.id);
      return res.json({
        success: true,
        message: "Network model deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }; 

  // const {PrismaClient} = require("@prisma/client");

  // const prisma = new PrismaClient();

  // const getNetworkModelByCustomer = async (req, res) => {
  //   try {
  //     const customerId = req.user.id;
  
  //     // Step 1: Fetch organization ID based on customerId
  //     // const organization = await customerService.getOrganizationIdByCustomerId(customerId);

  //     const organization = await prisma.organization.findFirst({
  //       where:{
  //         customerId:customerId
  //       }
  //     });

  //     //validation


  //     const networkDataFororganization = await prisma.networkdata.findMany({
  //       where:{
  //         organizationId:organization.id
  //       }
  //     });

  //     //validation


  //     const networIds = networkDataFororganization.map((networkData)=>networkData.networkId);

  //     const networks = await prisma.networkmodel.findMany({
  //       where:{
  //         id:{
  //           in:networIds
  //         }
  //       }
  //     });

  //     //validation


  //     // network model
  //     res.status(200).json({
  //       networks
  //     });
  //   } catch (error) {
  //     console.error("Error fetching network model:", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // };


const getNetworkModelByCustomer = async (req, res) => {
  try {
      const customerId = req.user.id;
      const networks = await networkModelService.getNetworkModelByCustomer(customerId);
      res.status(200).json({ networks });
  } catch (error) {
      console.error("Error fetching network model:", error);
      res.status(500).json({ message: error.message });
  }
};
  

module.exports = {createNetworkModel,fetchAllNetworkModel, fetchNetworkModelById, updateNetworkModel, deleteNetworkModel, getNetworkModelByCustomer}
