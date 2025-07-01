const networkDataService =  require("../services/networkDataService")

const createNetworkData = async (req, res) => {
    try {
        const networkId = req.params.networkId; // Get networkId from URL params
        const networkData = req.body; // Get other data from request body

        // Call service to create network data
        const createdNetworkData = await networkDataService.createNetworkData(networkId, networkData);

        return res.status(201).json({
            success: true,
            message: "Network data created successfully.",
            data: createdNetworkData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error creating network data: ${error.message}`,
        });
    }
    
};

const getNetworkDataByNetworkId = async (req, res) => {
    try {

        const customerId = req.user.id;
        const networkId = parseInt(req.params.networkId);
        console.log("customerId and netwrok data controller IDs",customerId,networkId);
	const networkData = await networkDataService.getNetworkDataByNetworkId(networkId,customerId);
        
        if (!networkData.length) {
            return res.status(404).json({ success: false, message: "Network data not found" });
        }
        
        res.status(200).json({ success: true, data: networkData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllNetworkData = async (req, res) => {
    try {
        const networkDataList = await networkDataService.getAllNetworkData();
        res.status(200).json({ success: true, data: networkDataList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateNetworkDataByNetworkId = async (req, res) => {
    try {
        const { networkId } = req.params;
        const updateData = req.body;

        const updatedNetworkData = await networkDataService.updateNetworkDataByNetworkId(networkId, updateData);

        res.status(200).json({
            success: true,
            message: "Network data updated successfully",
            data: updatedNetworkData,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// network data controller


const createOrUpdateNetworkData = async (req, res) => {
    try {
        const { networkModelId } = req.params; // Get networkModel ID from URL params
        const updateData = req.body; // Get update data from request body
        const customerId = req.user.id

        // Call the service function
        const updatedNetworkData = await networkDataService.createOrUpdateNetworkData(networkModelId, updateData, customerId);
        const msg = updatedNetworkData.msg;
        return res.status(200).json({
            success: true,
            //message: "Network data created or updated successfully.",
            message:msg,
            data: updatedNetworkData.data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error updating/creating network data: ${error.message}`,
        });
    }
}; 

// const createOrUpdateNetworkData = async (req, res) => {
//   try {
//       const { networkModelId } = req.params; // Get networkModel ID from URL params
//       const updateData = req.body; // Get update data from request body
//       const customerId = req.user.id; // Get customer ID from request

//       // Call the service function
//       const updatedNetworkData = await networkDataService.createOrUpdateNetworkData(
//           customerId, networkModelId, updateData
//       );

//       return res.status(200).json({
//           success: true,
//           message: "Network data created or updated successfully.",
//           data: updatedNetworkData,
//       });
//   } catch (error) {
//       return res.status(500).json({
//           success: false,
//           message: `Error updating/creating network data: ${error.message}`,
//       });
//   }
// };

const deleteNetworkData = async (req, res) => {
    try {
        await networkDataService.deleteNetworkData(parseInt(req.params.id));
        res.status(200).json({ success: true, message: "Network data deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports =  {
    createNetworkData,
    getNetworkDataByNetworkId,
    getAllNetworkData,
    updateNetworkDataByNetworkId,
    createOrUpdateNetworkData,
    deleteNetworkData
};

