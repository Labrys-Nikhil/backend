
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logger = require("../utils/logger");

const createNetworkData = async (networkId, networkData) => {
  try {
    // Convert networkId to integer
    networkId = parseInt(networkId);
    if (isNaN(networkId)) {
      throw new Error("Invalid network ID.");
    }

    const { urlString, hostname, token, appid, organizationId } = networkData;

    // Check if the networkId exists
    const networkExists = await prisma.networkmodel.findUnique({
      where: { id: networkId },
    });

    if (!networkExists) {
      throw new Error(`Network with ID ${networkId} does not exist.`);
    }

    // Create networkdata
    return await prisma.networkdata.create({
      data: {
        networkId,
        urlString,
        hostname,
        token,
        appid,
        organizationId,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create network data: ${error.message}`);
  }
};

const getNetworkDataByNetworkId = async (networkId) => {
  try {
    return await prisma.networkdata.findMany({
      where: { networkId },
    });
  } catch (error) {
    throw new Error("Error fetching network data: " + error.message);
  }
};

const getAllNetworkData = async () => {
  try {
    return await prisma.networkdata.findMany();
  } catch (error) {
    throw new Error("Error fetching all network data: " + error.message);
  }
};

const updateNetworkDataByNetworkId = async (networkId, data) => {
  try {
    // Find existing networkdata for the given networkId
    const existingData = await prisma.networkdata.findFirst({
      where: { networkId: parseInt(networkId) },
    });

    if (!existingData) {
      throw new Error("Network data not found for the provided networkId");
    }

    // Update the networkdata where networkId matches
    const updatedNetworkData = await prisma.networkdata.updateMany({
      where: { networkId: parseInt(networkId) },
      data,
    });
    // Fetch updated data
    const updatedData = await prisma.networkdata.findMany({
      where: { networkId: parseInt(networkId) },
    });

    return updatedData;
  } catch (error) {
    throw new Error("Error updating network data: " + error.message);
  }
};
// Network Data Service


const createOrUpdateNetworkData = async (networkModelId, data, customerId) => {
  try {
    // Convert networkModelId to an integer safely
    console.log("---------------->",customerId, networkModelId, data);
    const id = Number(networkModelId);
    console.log("networkModelId",id);
    if (isNaN(id)) {
      throw new Error("Invalid network model ID.");
    }

    // Step 1: Check if networkModel exists
    const networkModel = await prisma.networkmodel.findUnique({ where: { id } });
    if (!networkModel) {
      throw new Error(`Network model with ID ${id} does not exist.`);
    }

    // Step 2: Check if networkdata exists for this networkModel
    const existingNetworkData = await prisma.networkdata.findFirst({
      where: { networkId: id },
    });

    let result={};
    if (existingNetworkData) {
      // If networkdata exists, update it
      result.data = await prisma.networkdata.update({
        where: { id: existingNetworkData.id },
        data,
      });
      result.msg = "Network updated successfully";
    } else {
      // If networkdata does not exist, create a new one
      const organization = await prisma.organization.findFirst({
        where: { customerId },
      });

      if (!organization) {
        throw new Error("Organization not found for this customer.");
      }

      result.data = await prisma.networkdata.create({
        data: {
          networkId: id, // Assign networkModel ID to networkdata
          organizationId: organization.id,
          ...data,
        },
      });
      result.msg = "network data created successfully";
    }

    return result;
  } catch (error) {
    throw new Error("Error updating/creating network data: " + error.message);
  }
};

const deleteNetworkData = async (id) => {
  try {
    return await prisma.networkdata.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error("Error deleting network data: " + error.message);
  }
};

module.exports = {
  createNetworkData,
  getNetworkDataByNetworkId,
  getAllNetworkData,
  updateNetworkDataByNetworkId,
  createOrUpdateNetworkData,
  deleteNetworkData,
};

