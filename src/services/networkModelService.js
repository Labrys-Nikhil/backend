const { prisma } = require('../lib/prisma.js');
const createNetworkModel = async (networkModel) => {
    try {
      const networkData = await prisma.networkmodel.create({
       
        data: {
          name: networkModel.name,
          server: networkModel.server,
          method: networkModel.method,
          createdAt: new Date(),
        },
      });
      return networkData;
    } catch (error) {
      throw new Error("Error creating network model", error);
    }
  };
  
  const getAllNetworkModel = async () => {
    try {
      return await prisma.networkmodel.findMany();
    } catch (error) {
      throw new Error("Error fetching network models");
    }
  };
  // const getAllNetworks = async () => {
  //   try {
  //     console.log("Service: Fetching all networks...");
  //     const networks = await prisma.networkmodel.findMany({
  //       include: { networkdata: true },
  //     });
  //     return networks;
  //   } catch (error) {
  //     console.error("Error fetching all networks:", error);
  //     throw error;
  //   }
  // };
  
  const getNetworkModelById = async (id) => {
    try {
      return await prisma.networkmodel.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
      throw new Error("Error fetching network model");
    }
  };
  
  const updateNetworkModel = async (id, networkModel) => {
    try {
      return await prisma.networkmodel.update({
        where: { id: parseInt(id) },
        data: {
          name: networkModel.name,
          method: networkModel.method,
          server: networkModel.server,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error("Error updating network model");
    }
  };
  
  const deleteNetworkModel = async (id) => {
    try {
      return await prisma.networkmodel.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      throw new Error("Error deleting network model");
    }
  };


  const getNetworkModelByCustomer = async(customerId)=> {
        try {
            if (!customerId) {
                throw new Error("Customer ID is required.");
            }

            // Step 1: Fetch organization by customerId
            const organization = await prisma.organization.findFirst({
                where: { customerId: customerId },
            });

            if (!organization) {
                throw new Error("Organization not found for the given customer.");
            }

            // Step 2: Fetch network data for the organization
            const networkDataForOrganization = await prisma.networkdata.findMany({
                where: { organizationId: organization.id },
            });

            if (!networkDataForOrganization.length) {
                throw new Error("No network data found for the organization.");
            }

            // Step 3: Extract network IDs
            const networkIds = networkDataForOrganization.map((network) => network.networkId);

            // Step 4: Fetch network models based on network IDs
            const networks = await prisma.networkmodel.findMany({
                where: { id: { in: networkIds } },
            });

            if (!networks.length) {
                throw new Error("No networks found for the given organization.");
            }

            return networks;
        } catch (error) {
            console.error("Service Error: Unable to fetch network model", error);
            throw error;
        }
    }
  

module.exports =  { getAllNetworkModel, createNetworkModel, getNetworkModelById, updateNetworkModel, deleteNetworkModel, getNetworkModelByCustomer };
