const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();// Assuming Prisma is configured and exported from this file
const logger = require("../utils/logger"); // Import your logger instance
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');


const getHardwareByProjectId = async (projectIds) => {
  try {
    // Log the incoming request
    logger.info(`Fetching hardware for projectIds: ${projectIds}`);
    console.log(`[DEBUG] Fetching hardware for projectIds: ${projectIds}`);

    // Ensure projectIds is an array of numbers
    const projectIdArray = projectIds.split(',').map((id) => Number(id));

    // Fetch hardware linked to the projectIds
    const hardware = await prisma.hardware.findMany({
      where: {
        device: {
          some: {
            projectId: { in: projectIdArray }, // Query for multiple projectIds
          },
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        modelNo: true,
        decoderName: true,
      },
    });

    // Check if no hardware was found for the projectIds
    if (hardware.length === 0) {
      logger.warn(`No hardware found for projectIds: ${projectIds}`);
      console.warn(`[WARN] No hardware found for projectIds: ${projectIds}`);
      return { error: "No hardware found for these projects" };
    }

    // Log and return hardware
    logger.info(`Found ${hardware.length} hardware items for projectIds: ${projectIds}`);
    console.log(`[DEBUG] Found hardware: ${JSON.stringify(hardware)}`);
    return hardware;
  } catch (error) {
    logger.error(`Error fetching hardware for projectIds: ${projectIds} - ${error.message}`);
    console.error(`[ERROR] Error fetching hardware: ${error.message}`);
    throw new Error(`Error fetching hardware: ${error.message}`);
  }
};

const createReport = async (reportData) => {
  try {
    const { reportName, description, duration, hardwareId, deviceId, projectId } = reportData;

    // Save report to database
    const newReport = await prisma.addreport.create({
      data: {
        reportName,
        description,
        duration,
        hardwareId, // JSON field
        deviceId,   // JSON field
        projectId,  // JSON field
      },
    });

    return newReport;
  } catch (error) {
    console.error('Error in ReportService.createReport:', error.message || error);
    throw error;
  }
};
const getReports = async () => {
  try {
    // Query the database to fetch all reports
	console.log("testing------> getReport");
    const reports = await prisma.addreport.findMany();
    return reports;
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
  
};
const updatedReport =  async (id, data) => {
    try {
      const updatedReport = await prisma.addreport.update({
        where: { id: parseInt(id) }, // Parse ID to an integer
        data,
      });
      return updatedReport;
    } catch (error) {
      throw new Error(`Failed to update report: ${error.message}`);
    }
  }


  // Delete a report
  const deletedReport =  async (id) => {
    try {
      await prisma.addreport.delete({
        where: { id: parseInt(id) }, // Parse ID to an integer
      });
      return { message: 'Report deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete report: ${error.message}`);
    }
  }

 
  const getReportDataById = async (reportId) => {
    console.log('Fetching report with ID:', reportId);
    try {
      const report = await prisma.addreport.findUnique({
        where: { id: reportId },
      });
  
      if (!report) {
        console.log(`No report found with ID: ${reportId}`);
        throw new Error(`Report with ID ${reportId} not found.`);
      }
  
      console.log('Fetched report:', report);
      return report;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw new Error(error.message || 'Error fetching report by ID.');
    }
  };
  
const shareDataByEmail = async ( recipientEmail, format, tableData) => {
  // Generate the file (CSV or PDF)
  const filePath = await generateFile(format, tableData);

  // Send the email
  await sendEmail(recipientEmail, format, filePath);

  // Return success message
  return { message: "Email sent successfully!" };
};
 
const generateFile = async (format, tableData) => {
  const dirPath = path.join(__dirname, "../temp");
  const filePath = path.join(dirPath, `data.${format}`);

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (format === "csv") {
    const csvParser = new Parser();
    const csvData = csvParser.parse(tableData);
    fs.writeFileSync(filePath, csvData, "utf8");
    return filePath;
  } else if (format === "pdf") {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        autoFirstPage: false, // Do not create the first page automatically
      });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Define constants for table
      const pageMargin = 40;
      const columnPadding = 5;
      const rowHeight = 25;

      const headers = Object.keys(tableData[0]);
      const rows = tableData.map((row) => headers.map((header) => row[header] || "-"));

      // Calculate column widths dynamically based on the content
      const columnWidths = headers.map((header, colIndex) => {
        const maxHeaderWidth = doc.widthOfString(header);
        const maxContentWidth = Math.max(
          ...rows.map((row) => doc.widthOfString(row[colIndex] || "-"))
        );
        return Math.max(maxHeaderWidth, maxContentWidth) + columnPadding * 2;
      });

      const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
      const pageWidth = Math.max(tableWidth + pageMargin * 2, 612); // Minimum width is 612 (A4 portrait)
      const pageHeight = Math.max(rows.length * rowHeight + rowHeight + pageMargin * 2, 792); // Minimum height is 792 (A4 portrait)

      // Add a new page with the calculated dimensions
      doc.addPage({
        size: [pageWidth, pageHeight],
        margins: { top: pageMargin, bottom: pageMargin, left: pageMargin, right: pageMargin },
      });

      let currentY = pageMargin;

      // Draw Table Header
      headers.forEach((header, colIndex) => {
        const x = pageMargin + columnWidths.slice(0, colIndex).reduce((sum, width) => sum + width, 0);
        doc.rect(x, currentY, columnWidths[colIndex], rowHeight).stroke();
        doc.text(header, x + columnPadding, currentY + 8, { width: columnWidths[colIndex] - columnPadding * 2, align: "center" });
      });

      currentY += rowHeight;

      // Draw Table Rows
      rows.forEach((row) => {
        row.forEach((cell, colIndex) => {
          const x = pageMargin + columnWidths.slice(0, colIndex).reduce((sum, width) => sum + width, 0);
          doc.rect(x, currentY, columnWidths[colIndex], rowHeight).stroke();
          doc.text(cell, x + columnPadding, currentY + 8, { width: columnWidths[colIndex] - columnPadding * 2, align: "center" });
        });
        currentY += rowHeight;

        // If currentY exceeds page height, create a new page
        if (currentY + rowHeight + pageMargin > pageHeight) {
          doc.addPage({
            size: [pageWidth, pageHeight],
            margins: { top: pageMargin, bottom: pageMargin, left: pageMargin, right: pageMargin },
          });
          currentY = pageMargin;
        }
      });

      doc.end();

      writeStream.on("finish", () => resolve(filePath));
      writeStream.on("error", reject);
    });
  } else {
    throw new Error("Invalid file format. Supported formats are CSV and PDF.");
  }
};
const sendEmail = async (recipientEmail, format, filePath) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Report Data (${format.toUpperCase()})`,
      text: "Please find the attached report data.",
      attachments: [
        {
          filename: `data.${format}`,
          path: filePath,
        },
      ],
    });

    // Delete the generated file after sending the email
    fs.unlinkSync(filePath);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Error sending email: " + error.message);
  }
};


 
  module.exports = {getHardwareByProjectId,createReport, getReports, updatedReport, deletedReport,getReportDataById, shareDataByEmail, sendEmail};
  
