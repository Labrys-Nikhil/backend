// src/routes/customerRoutes.js

const express = require('express');
const customerController = require('../controllers/customerController');
const deviceDataController = require('../controllers/deviceControllers');
const deviceAttributeController = require("../controllers/deviceAttributeController");
const organizationController = require('../controllers/organizationController');
const projectController = require('../controllers/projectController');
const hardwareController = require('../controllers/hardwareController');
const outputController = require('../controllers/outputController');
const hardwareOutputController = require('../controllers/hardwareOutputController');
const alertController = require('../controllers/alertController');
const deviceServerController = require('../controllers/deviceServerDataController');
const decodeDeviceController = require('../controllers/decodedDataController');
const notificationController = require('../controllers/notificationController');
const hardwareAttributesController = require('../controllers/hardwareAttributeController')
const downlinkDeviceController = require('../controllers/downlinkController');
const timezoneController = require('../controllers/timezoneController');
const autoDownlinkController = require('../controllers/autoDownlinkController');
const deviceTypeController = require('../controllers/devicetypeController');
const labelsController = require('../controllers/labelsController');
const loraIotController = require('../controllers/loriotcontroller');

const emailService = require('../services/emailService');
const authenticateUser = require('../middlewares/auth');  // Authentication Middleware
const authorizeRoles = require('../middlewares/authorize');
const { hardwareDataToperticular } = require('../services/hardwareControllerService');
const widgetController = require('../controllers/addWidget');
const pageController = require('../controllers/pageController');
const { chartApiData } = require('../controllers/chartApiData');
const downlinkMapping = require('../helper/downlinkMappings');
const ReportController = require('../controllers/ReportController');
const cardController = require('../controllers/cardController');
const checkLicense = require('../middlewares/checkLicense');
const licenseController = require('../controllers/licenseController');
//const networkModelController =  require('../controllers/networkController');
//const networkDataController = require('../controllers/networkDataController');

const networkModelController =  require('../controllers/networkModelController');
const networkDataController = require('../controllers/networkDataController');
const manufactureController = require('../controllers/manufactureController');
const router = express.Router();

router.post('/create-customers', customerController.createCustomer);
router.get('/get-all-customers', customerController.getAllCustomers);
router.get('/get-customers-by-id/:id', customerController.getCustomerById);
router.get('/customers-verify/:id', customerController.verifyCustomer);
router.post('/customers-login', customerController.loginCustomer);
router.post('/customer-logout', authenticateUser, customerController.logoutCustomer);
router.get('/verify', customerController.verifyEmail);
router.get('/resend-verification/:id', customerController.resendVerificationMail);
router.post('/forgot-password', authenticateUser, emailService.forgetPassword);
router.post('/reset-password', authenticateUser, customerController.resetPassword);
router.put('/update-profile', authenticateUser, customerController.updateProfile);

// POST /api/organizations - Add a new organization     
router.post('/add-organizations', authenticateUser, organizationController.addOrganization);
router.get('/customers/:id/organizations', authenticateUser, checkLicense, customerController.getOrganizationsByCustomerId);
router.get('/customer-organization/:id', authenticateUser, customerController.getCustomerWithOrganizations);

// devices
router.post('/add-device-data', authenticateUser, deviceDataController.createDevice);
router.get('/get-device-data-by-id/:id', deviceDataController.getDeviceById);
router.get('/get-all-device', deviceDataController.getAllDevices);
router.put('/update-device-data/:id', authenticateUser, deviceDataController.updateDevice);
router.delete('/delete-device-data/:id', authenticateUser, deviceDataController.deleteDevice);
router.get('/get-device-data-by-deveui/:id', deviceDataController.getDeviceByDevEui);
router.get('/get-device-data-by-projectid/:id', deviceDataController.getDeviceByProjectId);

// //devicesAttributes
// router.post('/add-device-attribute',authenticateUser, deviceAttributeController.createDeviceAttribute);
// router.get('/get-device-attribute-by-id/:id',authenticateUser, deviceAttributeController.getDeviceAttributeById);
// router.put('/update-device-attribute/:id',authenticateUser, deviceAttributeController.updateDeviceAttribute);
// router.delete('/delete-device-attribute/:id',authenticateUser, deviceAttributeController.deleteDeviceAttribute);


// router.post('/add-projects',authenticateUser, projectController.addProjects);


// CRUD routes for Hardware
router.post('/add-hardware-devices', hardwareController.createHardware);      // Create a new hardware entry
router.get('/get-hardware-devices', hardwareController.getAllHardware);       // Get all hardware entries
router.get('/get-hardware-devices-by-id/:id', authenticateUser, hardwareController.getHardwareById);   // Get a hardware entry by ID
router.put('/update-hardware-devices/:id', authenticateUser, hardwareController.updateHardware);     // Update a hardware entry by ID
router.delete('delete-hardware-devices/:id', authenticateUser, hardwareController.deleteHardware);   // Delete a hardware entry by ID
router.get('/all-hardwaredata-customer-id', authenticateUser, hardwareController.hardwareDataToperticular);

// get locationName, all-devices, all output.
router.get('/all-location-customer-id-and-projectId/:projectId', authenticateUser, outputController.LocationBasesOnCustomerId);
router.get('/all-devices-customer-id', authenticateUser, deviceDataController.devicesByCustomerId);
router.get('/all-output-customer-id', authenticateUser,  outputController.outputBasesOnCustomerId);

//output
router.post('/add-output',  outputController.createOutput)
router.get('/get-all-outputs',  outputController.getAllOutputs);
router.get('/get-outputs/:id', outputController.getOutputById);
router.put('/update-outputs/:id', outputController.updateOutput);
router.delete('/delete-outputs/:id', outputController.deleteOutput);
router.get('/get-output/:id', outputController.getOutputsByDeviceId);
router.get('/get-all-output-customer-id', outputController.getOutputsByDeviceId);

//add widget data
router.post('/create-widget-data', widgetController.addWidgetData);
router.get('/get-specificPage-data/:projectId', widgetController.getSpecificPageWidgetData);

//chartApiData
router.get('/chart-data/:projectId', chartApiData);


//create page
router.get('/get-all-page/:projectId', pageController.getallpages);
router.get('/all-chart-name/:projectId', pageController.getChartPageNamebyProjectId);
router.post('/create-page', pageController.createPage);
router.put('/update-refresh-Interval/:projectId/:pageName/:pageId', authenticateUser, checkLicense, pageController.updateRefreshInterval);
router.delete('/delete-page-pageName/:projectId/:pageName/:pageId', authenticateUser, checkLicense, pageController.deletePageByProjectIdProjectName);

// hardware outputs
router.post('/add-hardware-output',authenticateUser, hardwareOutputController.createHardwareOutput)
router.get('/get-all-hardwares-output',hardwareOutputController.getAllHardwareOutputs);
router.get('/get-all-hardwares-output-by-id/:hardwareId', hardwareOutputController.getHardwareOutputByhardwareId);
router.get('/get-output-by-id/:id', hardwareOutputController.getHardwareOutputById)
router.put('/update-hardwares-output/:id',authenticateUser, hardwareOutputController.updateHardwareOutput);
router.delete('/delete-hardwares-output/:id',authenticateUser, hardwareOutputController.deleteHardwareOutput);


// hardware atttirubtes
router.post('/add-hardware-attributes', hardwareAttributesController.createHardwareAttribute)


//projects
router.post('/add-projects', authenticateUser, projectController.addProjects);
router.get('/get-all-projects',  projectController.getAllProjects);
router.get('/get-projects-by-id', authenticateUser, projectController.getProjectById);
router.put('/update-projects/:id', authenticateUser, projectController.updateProject);
router.delete('/delete-projects/:id', authenticateUser, projectController.deleteProject);
router.get('/get-project-name-by-projectId/:id', projectController.getProjectByProjectId);
router.get('/get-project-info-by-projectId/:id',authenticateUser, projectController.getProjectInfoByProjectId);
router.get('/get-device-limit-by-id/:id',authenticateUser, projectController.getDeviceLimitById);
router.get('/get-project-by-customer-id',authenticateUser, projectController.getProjectByCustomerId);

//alerts
router.get('/alerts', alertController.getAllAlerts);
router.put('/update-alert/:alertId', alertController.updateAlertById);
router.get('/alerts/:projectId', alertController.getAllAlertsByProjectId);
router.post('/add-alerts', alertController.createAlert);


// device server data
router.get('/get-all-device-server-data', deviceServerController.getAllDevices);
router.get('/get-all-device-server-data-by-id/:id', deviceServerController.getDeviceById);
router.post('/add-device-server-data', deviceServerController.createDevice);
router.put('/update-device-server-data/:id', deviceServerController.updateDevice);
router.delete('/delete-device-server-data/:id', deviceServerController.deleteDevice);
router.get('/get-recent-device-server-data/:devEui', deviceServerController.getRecentDevices)

//decoded data routes
router.get('/get-decoded-data/:devEui', decodeDeviceController.getDecodedData);
router.get('/recent-decode-data/:devEui', decodeDeviceController.getRecentDecodedData)

//notification apis
router.get('/get-notifications', notificationController.getNotifications);
router.get('/get-notifications/:projectId', notificationController.getNotificationsByProjectId);


//downlink and mappin to specific server
router.post('/send-downlink-device', downlinkMapping.mapTheDownlinkAndRoutetoSpecificServer);


//send downlink API

router.get('/get-downlink-device', downlinkDeviceController.getDownlinkData)
router.get('/get-downlink-device/:id', downlinkDeviceController.getDownlinkByDeviceId)
router.get('/get-downlink-device-all/:id', downlinkDeviceController.getDownlinkDatabyDeviceId);


// Create a new timezone
router.post('/create-timezones', timezoneController.createTimezone);
router.get('/timezones', timezoneController.getAllTimezones);
router.get('/timezones/:id', timezoneController.getTimezoneById);
router.put('/timezones/:id', timezoneController.updateTimezone);
router.delete('/timezones/:id', timezoneController.deleteTimezone);



// Downlink Device
router.post('/create-autodownlink', autoDownlinkController.createAutoDownlink);
// router.get('/downlinkDevices', autoDownlinkController.getAllDownlink);
router.get('/get-downlink-device-by-alert/:id', autoDownlinkController.getAutoDownlinkByAlertId);
router.put('/downlinkDevices/:id', autoDownlinkController.updateAutoDownlink);
router.delete('/downlinkDevices/:id', autoDownlinkController.deleteAutoDownlink);

// POST - Create a Device Type
router.post('/create-device-type', deviceTypeController.createDeviceType);
router.get('/get-device-type', deviceTypeController.getDeviceTypes);
router.get('/get-device-typeById/:id', deviceTypeController.getDeviceType);
router.put('/update-device-type/:id', deviceTypeController.updateDeviceType);
router.delete('/delete-device-type/:id', deviceTypeController.deleteDeviceType);

//labels api
router.get('/get-all-labels', labelsController.getAllLabels);
router.post('/create-label', labelsController.createLabel);
router.get('/get-label/:projectId', labelsController.getLabelByProjectId);
router.delete('/delete-label/:id', labelsController.deleteLabel);
router.put('/update-label/:id', labelsController.updateLabel);
router.get('/get-data-by-deviceId/:deviceId', labelsController.getDataByDeviceId);
router.get('/get-active-label-device/:projectId/:devEUI/:outputName/:outputValue', authenticateUser, labelsController.getActiveLabelByDevEUI);

//report routes
router.get('/get-hardware/:projectId', ReportController.getHardware);
router.get('/get-report-by/:id', ReportController.getReportById);
router.post('/create-reports', ReportController.addReport);
router.get('/get-reports', ReportController.getAllReports);
router.put('/update-report/:id', ReportController.updateReport)
router.delete('/delete-report/:id', ReportController.deleteReport)
router.post('/send-report-by-email', ReportController.sendDataByEmail)

router.get('/get-decoded-data-by-Device/:devEuis/:duration', decodeDeviceController.getDecodedDataByDeviceIdsAndDuration);

//loriot routes
router.post('/get-data-from-loriot', loraIotController.fetchAndStoreUplinkMessages);
//loriot downlink
router.post('/send-loriot-downlink', loraIotController.downlinkLoriot);


//card (authorization and user access management needs to be added)
router.get('/get-all-card-project-id/:projectId/:pageName', authenticateUser, cardController.getAllCardByProjectID);
router.put('/update-card-by-card-id', authenticateUser, cardController.updateCard);
router.delete('/delete-card-by-card-id/:cardId', authenticateUser, cardController.deleteCardByCardId);
router.post('/create-card', authenticateUser, cardController.createCard);




// License Endpoints
router.post("/licenses", authenticateUser, async (req, res) => {
    try {
        await LicenseService.createLicense(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/licenses/:id", authenticateUser, async (req, res) => {
    try {
        await LicenseService.getLicense(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/licenses/:id/activate", authenticateUser, async (req, res) => {
    try {
        await LicenseService.activateLicense(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/licenses/:id/deactivate", authenticateUser, async (req, res) => {
    try {
        await LicenseService.deactivateLicense(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Payment Endpoints
router.post("/payments", authenticateUser, async (req, res) => {
    try {
        await PaymentService.createPayment(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/payments/:id", authenticateUser, async (req, res) => {
    try {
        await PaymentService.getPayment(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Plan Endpoints
router.post("/plans", authenticateUser, async (req, res) => {
    try {
        await PlanService.createPlan(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/plans", authenticateUser, async (req, res) => {
    try {
        await PlanService.getPlans(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//license
router.get("/license-by-customer-id", authenticateUser,licenseController.getLicenseByCustomerId);

//decode-data-deveuis
router.get('/recent-decode-data-deveuis/:devEui', authenticateUser, decodeDeviceController.getRecentDecodedDataByDevEUIS);


//network Model
router.get('/get-all-Network-Model',networkModelController.fetchAllNetworkModel);
router.post('/create-network-model',networkModelController.createNetworkModel);
router.get('/get-network-model-by-id/:id', networkModelController.fetchNetworkModelById);
router.delete('/delete-network-model-by-id/:id', networkModelController.deleteNetworkModel);
router.put('/update-network-model/:id',networkModelController.updateNetworkModel)
router.get('/get-network-by-token',authenticateUser, networkModelController.getNetworkModelByCustomer)

// network data
router.post('/create-network-data/:networkId',networkDataController.createNetworkData)
router.get('/get-network-data-by-id/:networkId',authenticateUser, networkDataController.getNetworkDataByNetworkId)
router.put('/create-or-update-network-data-by/:networkModelId',authenticateUser, networkDataController.createOrUpdateNetworkData)
router.put('/update-network-data-by-networkid/:networkId', networkDataController.updateNetworkDataByNetworkId)
router.delete('/delete-network-data-by/:id', networkDataController.deleteNetworkData)
router.get('/get-all-network-data', networkDataController.getAllNetworkData)


//device-limit 
router.get('/get-device-limit-by-id/:id',authenticateUser, projectController.getDeviceLimitById);

//manufacturer
router.post('/create-manufacture', manufactureController.createManufacture)
router.get('/get-manufacture', manufactureController.getAllManufactures)
router.get('/get-manufacture-by-id/:id', manufactureController.getManufactureById)
//router.put('/update-manufacture/:id', manufactureController.updateManufactureById)
//router.delete('/delete-manufacture/:id', manufactureController.deleteManufactureById)
router.get('/manufacture-name-by-id/:manufactureId', manufactureController.getManufactureName)

//test api for creating the device
router.post('/add-device-data-test', authenticateUser, deviceDataController.createDeviceTest);

//router.post('/add-device-data-t3',authenticateUser ,deviceDataController.addDevice);

module.exports = router;

