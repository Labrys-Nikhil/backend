// const ReportService = require("../services/ReportService");
// const logger = require("../utils/logger"); // Import your logger instance
// const {PrismaClient} = require('@prisma/client')
// const prisma = new PrismaClient();


// const addReport = async (req, res) => {
//   try {
//     const reportData = req.body;
//     const customerId = req.user.id;
//     // Validate request data
//     if (!reportData.reportName || !reportData.projectId || !reportData.hardwareId || !reportData.deviceId) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Pass data to service
//     const report = await ReportService.createReport(reportData,customerId);
//     return res.status(201).json({
//       message: "Report created successfully",
//       data: report,
//       success:true
//     });
//   } catch (error) {
//     console.error('Error creating report:', error);
//     return res.status(500).json({ error: 'Internal Server Error',
//       message: "Failed to create report",
//       success:false
//      });
//   }
// };



// const getAllReports = async (req, res) => {
//   try {
//     // Fetch all reports from the database
// //    const customerId = req.user.id;
// //	  console.log("customerID passed in report-------------------------->",customerId);
//     const reports = await ReportService.getReports( req.user.id);

//     // Respond with the fetched reports
//     return res.status(200).json({
//       success: true,
//       data: reports,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Controller for updating a report
// const updateReport = async (req, res) => {
//   try {
//     const { id } = req.params; // ID of the report to update
//     const data = req.body; // Data to update

//     const updatedReport = await ReportService.updatedReport(id, data);

//     res.status(200).json({
//       success: true,
//       message: 'Report updated successfully',
//       updatedReport,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success:false,
//       message:error.message
//     });
//   }
// };

// // Controller for deleting a report
// const deleteReport = async (req, res) => {
//   try {
//     const { id } = req.params; // ID of the report to delete

//     const result = await ReportService.deletedReport(id);

//     res.status(200).json({
//       message: 'Report deleted successfully',
//       success:true,
//       result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: 'Failed to delete report',
//       details: error.message,
//       success:false
//     });
//   }
// };

// const getHardware = async (req, res) => {
//   const { projectId } = req.params;

//   // Validate the projectId
//   if (!projectId) {
//     return res.status(400).json({ message: "projectId is required" });
//   }

//   try {
//     // Fetch hardware using the service class
//     const hardware = await ReportService.getHardwareByProjectId(projectId);

//     // If hardware not found, send appropriate response
//     if (hardware.error) {
//       return res.status(404).json({
//         message: hardware.error,
//         success: true,
//       });
//     }

//     // Send hardware list
//     return res.status(200).json(hardware);
//   } catch (error) {
//     console.error("Error in getHardwareByProjectId:", error.message);
//     return res.status(500).json({
//       message: error.message,
//       success: false,
//     });
//   }
// };
//   const getReportById = async (req, res) => {
//     const { id } = req.params;
  
//     if (!id) {
//       return res.status(400).json({ error: 'Report ID is required.' });
//     }
  
//     try {
//       console.log('Controller received ID:', id);
//       const report = await ReportService.getReportDataById(parseInt(id, 10));
//       return res.status(200).json({ data: report });
//     } catch (error) {
//       console.error('Error in controller:', error.message);
//       return res.status(404).json({ error: error.message });
//     }
//   };
  



// const sendDataByEmail = async (req, res) => {
//   // const { customerId } = customerService.getCustomerById(req, res);
//   const {recipientEmail, format, tableData } = req.body;

//   // Validate required fields
//   if ( !recipientEmail || !format || !tableData) {
//     return res.status(400).send({
//       message: "Missing required fields",
//       missingFields: {
//         recipientEmail: !recipientEmail ? "Recipient email is required" : undefined,
//         format: !format ? "Format (csv or pdf) is required" : undefined,
//         tableData: !tableData ? "Table data is required" : undefined,
//       },
//     });
//   }

//   try {
//     // Call the service method to send data by email
//     const result = await ReportService.shareDataByEmail(recipientEmail, format, tableData);

//     res.status(200).send({
//       message: result.message,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).send({
//       message: "Error sending email",
//       error: error.message,
//       success: false,
//     });
//   }
// };
  
// module.exports = { getHardware, addReport, getAllReports, updateReport, deleteReport,getReportById, sendDataByEmail };
const ReportService = require("../services/ReportService");
const logger = require("../utils/logger"); // Import your logger instance



const addReport = async (req, res) => {
  try {
    const reportData = req.body;
    const customerId = req.user.id;
    // Validate request data
    if (!reportData.reportName || !reportData.projectId || !reportData.hardwareId || !reportData.deviceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Pass data to service
    const report = await ReportService.createReport(reportData,customerId);
    return res.status(201).json({
      message: "Report created successfully",
      data: report,
      success:true
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return res.status(500).json({ error: 'Internal Server Error',
      message: "Failed to create report",
      success:false
     });
  }
};



const getAllReports = async (req, res) => {
  try {
    // Fetch all reports from the database
//    const customerId = req.user.id;
//	  console.log("customerID passed in report-------------------------->",customerId);
    const reports = await ReportService.getReports( req.user.id);

    // Respond with the fetched reports
    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller for updating a report
const updateReport = async (req, res) => {
  try {
    const { id } = req.params; // ID of the report to update
    const data = req.body; // Data to update

    const updatedReport = await ReportService.updatedReport(id, data);

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      updatedReport,
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

// Controller for deleting a report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params; // ID of the report to delete

    const result = await ReportService.deletedReport(id);

    res.status(200).json({
      message: 'Report deleted successfully',
      success:true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete report',
      details: error.message,
      success:false
    });
  }
};

const getHardware = async (req, res) => {
  const { projectId } = req.params;

  // Validate the projectId
  if (!projectId) {
    return res.status(400).json({ message: "projectId is required" });
  }

  try {
    // Fetch hardware using the service class
    const hardware = await ReportService.getHardwareByProjectId(projectId);

    // If hardware not found, send appropriate response
    if (hardware.error) {
      return res.status(404).json({
        message: hardware.error,
        success: true,
      });
    }

    // Send hardware list
    return res.status(200).json(hardware);
  } catch (error) {
    console.error("Error in getHardwareByProjectId:", error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
  const getReportById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'Report ID is required.' });
    }
  
    try {
      console.log('Controller received ID:', id);
      const report = await ReportService.getReportDataById(parseInt(id, 10));
      return res.status(200).json({ data: report });
    } catch (error) {
      console.error('Error in controller:', error.message);
      return res.status(404).json({ error: error.message });
    }
  };
  



const sendDataByEmail = async (req, res) => {
  // const { customerId } = customerService.getCustomerById(req, res);
  const {recipientEmail, format, tableData } = req.body;

  // Validate required fields
  if ( !recipientEmail || !format || !tableData) {
    return res.status(400).send({
      message: "Missing required fields",
      missingFields: {
        recipientEmail: !recipientEmail ? "Recipient email is required" : undefined,
        format: !format ? "Format (csv or pdf) is required" : undefined,
        tableData: !tableData ? "Table data is required" : undefined,
      },
    });
  }

  try {
    // Call the service method to send data by email
    const result = await ReportService.shareDataByEmail(recipientEmail, format, tableData);

    res.status(200).send({
      message: result.message,
      success: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({
      message: "Error sending email",
      error: error.message,
      success: false,
    });
  }
};
  
module.exports = { getHardware, addReport, getAllReports, updateReport, deleteReport,getReportById, sendDataByEmail };