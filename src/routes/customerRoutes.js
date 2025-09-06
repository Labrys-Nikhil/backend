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
const locationController = require('../controllers/locationController');

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
const scheduledDownlinkMapping = require('../helper/mapScheduleDownlink')
const scheduleDownlinkController = require('../controllers/scheduleDownlinkController');

// Rohit
const permissionController = require('../controllers/permissionsController');
const roleController = require('../controllers/roleController')
const modulesController = require('../controllers/modulesController');
const { JsonWebTokenError } = require('jsonwebtoken');

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

// POST /api/organizations - Add: a new organization     
router.post('/add-organizations', authenticateUser, organizationController.addOrganization);
router.get('/customers/:id/organizations', authenticateUser, checkLicense, customerController.getOrganizationsByCustomerId);
router.get('/customer-organization/:id', authenticateUser, customerController.getCustomerWithOrganizations);

// devices
router.post('/add-device-data', authenticateUser, deviceDataController.createDevice);
router.get('/get-device-data-by-id/:id',authenticateUser, deviceDataController.getDeviceById);
router.get('/get-all-device', authenticateUser,deviceDataController.getAllDevices);
router.put('/update-device-data/:id', authenticateUser, deviceDataController.updateDevice);
router.delete('/delete-device-data/:id', authenticateUser, deviceDataController.deleteDevice);
router.get('/get-device-data-by-deveui/:id',authenticateUser, deviceDataController.getDeviceByDevEui);
router.get('/get-device-data-by-projectid/:id',authenticateUser, deviceDataController.getDeviceByProjectId);
// saif
router.get('/get-device-data-by-hardwareId/:id',authenticateUser, deviceDataController.getAttributesByHardwareId);
// //devicesAttributes
// router.post('/add-device-attribute',authenticateUser, deviceAttributeController.createDeviceAttribute);
// router.get('/get-device-attribute-by-id/:id',authenticateUser, deviceAttributeController.getDeviceAttributeById);
// router.put('/update-device-attribute/:id',authenticateUser, deviceAttributeController.updateDeviceAttribute);
// router.delete('/delete-device-attribute/:id',authenticateUser, deviceAttributeController.deleteDeviceAttribute);


// router.post('/add-projects',authenticateUser, projectController.addProjects);


// CRUD routes for Hardware
router.post('/add-hardware-devices',authenticateUser, hardwareController.createHardware);      // Create a new hardware entry
router.get('/get-hardware-devices',authenticateUser, hardwareController.getAllHardware);       // Get all hardware entries
router.get('/get-hardware-devices-by-id/:id', authenticateUser, hardwareController.getHardwareById);   // Get a hardware entry by ID
router.put('/update-hardware-devices/:id', authenticateUser, hardwareController.updateHardware);     // Update a hardware entry by ID
router.delete('delete-hardware-devices/:id', authenticateUser, hardwareController.deleteHardware);   // Delete a hardware entry by ID
router.get('/all-hardwaredata-customer-id', authenticateUser, hardwareController.hardwareDataToperticular);

// get locationName, all-devices, all output.
router.get('/all-location-customer-id-and-projectId/:projectId', authenticateUser, outputController.LocationBasesOnCustomerId);
router.get('/all-devices-customer-id', authenticateUser, deviceDataController.devicesByCustomerId);
router.get('/all-output-customer-id', authenticateUser,  outputController.outputBasesOnCustomerId);

//output
router.post('/add-output',authenticateUser , outputController.createOutput)
router.get('/get-all-outputs', authenticateUser ,outputController.getAllOutputs);
router.get('/get-outputs/:id',authenticateUser, outputController.getOutputById);
router.put('/update-outputs/:id', authenticateUser,outputController.updateOutput);
router.delete('/delete-outputs/:id',authenticateUser, outputController.deleteOutput);
router.get('/get-output/:id', authenticateUser,outputController.getOutputsByDeviceId);
router.get('/get-all-output-customer-id',authenticateUser, outputController.getOutputsByDeviceId);

//add widget data
router.post('/create-widget-data',authenticateUser, widgetController.addWidgetData);
router.get('/get-specificPage-data/:projectId',authenticateUser, widgetController.getSpecificPageWidgetData);
router.put('/update-widget-by-id/:id',authenticateUser, widgetController.updateChartById)
router.delete('/delete-widget-by-id/:id',authenticateUser, widgetController.deleteChartById)
router.get('/get-widget-data-by-id/:id',authenticateUser, widgetController.getWidgetDataById)

//chartApiData
router.get('/chart-data/:projectId',authenticateUser, chartApiData);


//create page
router.get('/get-all-page/:projectId',authenticateUser, pageController.getallpages);
router.get('/all-chart-name/:projectId',authenticateUser, pageController.getChartPageNamebyProjectId);
router.post('/create-page',authenticateUser, pageController.createPage);
router.put('/update-refresh-Interval/:projectId/:pageName/:pageId', authenticateUser, pageController.updateRefreshInterval);
router.delete('/delete-page-pageName/:projectId/:pageName/:pageId', authenticateUser, pageController.deletePageByProjectIdProjectName);

// hardware outputs
router.post('/add-hardware-output',authenticateUser, hardwareOutputController.createHardwareOutput)
router.get('/get-all-hardwares-output',authenticateUser,hardwareOutputController.getAllHardwareOutputs);
router.get('/get-all-hardwares-output-by-id/:hardwareId',authenticateUser, hardwareOutputController.getHardwareOutputByhardwareId);
router.get('/get-output-by-id/:id',authenticateUser, hardwareOutputController.getHardwareOutputById)
router.put('/update-hardwares-output/:id',authenticateUser, hardwareOutputController.updateHardwareOutput);
router.delete('/delete-hardwares-output/:id',authenticateUser, hardwareOutputController.deleteHardwareOutput);
router.get('/get-output-by-customerId',authenticateUser, hardwareOutputController.getAllHardwareOutputsByCustomerId);

// hardware atttirubtes
router.post('/add-hardware-attributes', authenticateUser,hardwareAttributesController.createHardwareAttribute)


//projects
router.post('/add-projects', authenticateUser, projectController.addProjects);
router.get('/get-all-projects',authenticateUser,  projectController.getAllProjects);
router.get('/get-projects-by-id', authenticateUser, projectController.getProjectById);
router.put('/update-projects/:id', authenticateUser, projectController.updateProject);
router.delete('/delete-projects/:id', authenticateUser, projectController.deleteProject);
router.get('/get-project-name-by-projectId/:id', projectController.getProjectByProjectId);
router.get('/get-project-info-by-projectId/:id',authenticateUser, projectController.getProjectInfoByProjectId);
//router.get('/get-device-limit-by-id/:id',authenticateUser, projectController.getDeviceLimitById);
router.get('/get-project-by-customer-id',authenticateUser, projectController.getProjectByCustomerId);

//alerts
router.get('/alerts',authenticateUser, alertController.getAllAlerts);
router.put('/update-alert/:alertId',authenticateUser, alertController.updateAlertById);
router.get('/alerts/:projectId',authenticateUser, alertController.getAllAlertsByProjectId);
router.post('/add-alerts',authenticateUser, alertController.createAlert);
router.delete('/delete-alert/:id',authenticateUser, alertController.deleteAlert);



// device server data
router.get('/get-all-device-server-data',authenticateUser, deviceServerController.getAllDevices);
router.get('/get-all-device-server-data-by-id/:id',authenticateUser, deviceServerController.getDeviceById);
router.post('/add-device-server-data',authenticateUser, deviceServerController.createDevice);
router.put('/update-device-server-data/:id',authenticateUser, deviceServerController.updateDevice);
router.delete('/delete-device-server-data/:id',authenticateUser, deviceServerController.deleteDevice);
router.get('/get-recent-device-server-data/:devEui',authenticateUser, deviceServerController.getRecentDevices)

//decoded data routes
router.get('/get-decoded-data/:devEui',authenticateUser, decodeDeviceController.getDecodedData);
router.get('/recent-decode-data/:devEui',authenticateUser, decodeDeviceController.getRecentDecodedData)
router.get('/recent-device-timestamp/:devEui',decodeDeviceController.getTiemStampBydevEUI);
router.post('/recent-decoded-devices-data-by/',authenticateUser,decodeDeviceController.getRecentDecodedDataByDeviceIdAndOutputName);


//notification apis
router.get('/get-notifications',authenticateUser, notificationController.getNotifications);
router.get('/get-notifications/:projectId',authenticateUser, notificationController.getNotificationsByProjectId);
router.get('/get-notifications-by/:deviceId',authenticateUser, notificationController.getNotificationsByDeviceId);

router.get('/notification-page', authenticateUser, notificationController.getPaginatedNotifications);



//downlink and mappin to specific server
router.post('/send-downlink-device',authenticateUser, downlinkMapping.mapTheDownlinkAndRoutetoSpecificServer);


//send downlink API

router.get('/get-downlink-device',authenticateUser, downlinkDeviceController.getDownlinkData)
router.get('/get-downlink-device/:id',authenticateUser, downlinkDeviceController.getDownlinkByDeviceId)
router.get('/get-downlink-device-all/:id',authenticateUser, downlinkDeviceController.getDownlinkDatabyDeviceId);


// Create a new timezone
router.post('/create-timezones',authenticateUser, timezoneController.createTimezone);
router.get('/timezones',authenticateUser, timezoneController.getAllTimezones);
router.get('/timezones/:id',authenticateUser, timezoneController.getTimezoneById);
router.put('/timezones/:id',authenticateUser, timezoneController.updateTimezone);
router.delete('/timezones/:id',authenticateUser, timezoneController.deleteTimezone);



// Downlink Device
router.post('/create-autodownlink',authenticateUser, autoDownlinkController.createAutoDownlink);
// router.get('/downlinkDevices', autoDownlinkController.getAllDownlink);
router.get('/get-downlink-device-by-alert/:id',authenticateUser, autoDownlinkController.getAutoDownlinkByAlertId);
router.put('/downlinkDevices/:id',authenticateUser, autoDownlinkController.updateAutoDownlink);
router.delete('/downlinkDevices/:id',authenticateUser, autoDownlinkController.deleteAutoDownlink);

// POST - Create a Device Type
router.post('/create-device-type',authenticateUser, deviceTypeController.createDeviceType);
router.get('/get-device-type',authenticateUser, deviceTypeController.getDeviceTypes);
router.get('/get-device-typeById/:id',authenticateUser, deviceTypeController.getDeviceType);
router.put('/update-device-type/:id',authenticateUser, deviceTypeController.updateDeviceType);
router.delete('/delete-device-type/:id',authenticateUser, deviceTypeController.deleteDeviceType);

//labels api
router.get('/get-all-labels',authenticateUser, labelsController.getAllLabels);
router.post('/create-label',authenticateUser, labelsController.createLabel);
router.get('/get-label/:projectId',authenticateUser, labelsController.getLabelByProjectId);
router.delete('/delete-label/:id',authenticateUser, labelsController.deleteLabel);
router.put('/update-label/:id',authenticateUser, labelsController.updateLabel);
router.get('/get-data-by-deviceId/:deviceId',authenticateUser, labelsController.getDataByDeviceId);
router.get('/get-active-label-device/:projectId/:devEUI/:outputName/:outputValue', authenticateUser, labelsController.getActiveLabelByDevEUI);

//report routes
router.get('/get-hardware/:projectId',authenticateUser, ReportController.getHardware);
router.get('/get-report-by/:id',authenticateUser, ReportController.getReportById);
router.post('/create-reports',authenticateUser, ReportController.addReport);
router.get('/get-reports',authenticateUser, ReportController.getAllReports);
router.put('/update-report/:id',authenticateUser, ReportController.updateReport)
router.delete('/delete-report/:id',authenticateUser, ReportController.deleteReport)
router.post('/send-report-by-email',authenticateUser, ReportController.sendDataByEmail)

router.get('/get-decoded-data-by-Device/:devEuis/:duration',authenticateUser, decodeDeviceController.getDecodedDataByDeviceIdsAndDuration);

//loriot routes
router.post('/get-data-from-loriot', loraIotController.fetchAndStoreUplinkMessages);
//loriot downlink
router.post('/send-loriot-downlink',authenticateUser, loraIotController.downlinkLoriot);


//card (authorization and user access management needs to be added)
router.get('/get-all-card-project-id/:projectId/:pageName', authenticateUser, cardController.getAllCardByProjectID);
router.put('/update-card-by-card-id', authenticateUser, cardController.updateCard);
router.delete('/delete-card-by-card-id/:cardId', authenticateUser, cardController.deleteCardByCardId);
router.post('/create-card', authenticateUser, cardController.createCard);


// Schedule downlink
router.post("/schedule-downlink", authenticateUser, scheduledDownlinkMapping.mapScheduledDownlink )
router.get('/scheduledownlink/:projectId',authenticateUser, scheduleDownlinkController.getScheduleDownlinkByProjectId);
router.get('/get-scheduledownlink/:id', authenticateUser, scheduleDownlinkController.getScheduleDownlinkById)
router.put('/update-scheduledownlink/:id', authenticateUser, scheduleDownlinkController.updateScheduleDownlink)
router.delete("/delete-schedule/:id", authenticateUser, scheduleDownlinkController.deleteScheduleById)


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
router.get('/get-all-Network-Model',authenticateUser,networkModelController.fetchAllNetworkModel);
router.post('/create-network-model',authenticateUser,networkModelController.createNetworkModel);
router.get('/get-network-model-by-id/:id',authenticateUser, networkModelController.fetchNetworkModelById);
router.delete('/delete-network-model-by-id/:id',authenticateUser, networkModelController.deleteNetworkModel);
router.put('/update-network-model/:id',authenticateUser,networkModelController.updateNetworkModel)
router.get('/get-network-by-token',authenticateUser, networkModelController.getNetworkModelByCustomer)

// network data
router.post('/create-network-data/:networkId',authenticateUser,networkDataController.createNetworkData)
router.get('/get-network-data-by-id/:networkId',authenticateUser, networkDataController.getNetworkDataByNetworkId)
router.put('/create-or-update-network-data-by/:networkModelId',authenticateUser, networkDataController.createOrUpdateNetworkData)
router.put('/update-network-data-by-networkid/:networkId',authenticateUser, networkDataController.updateNetworkDataByNetworkId)
router.delete('/delete-network-data-by/:id',authenticateUser, networkDataController.deleteNetworkData)
router.get('/get-all-network-data',authenticateUser, networkDataController.getAllNetworkData)


//device-limit 
router.get('/get-device-limit-by-id/:id',authenticateUser, projectController.getDeviceLimitById);

//manufacturer
router.post('/create-manufacture',authenticateUser, manufactureController.createManufacture)
router.get('/get-manufacture',authenticateUser, manufactureController.getAllManufactures)
router.get('/get-manufacture-by-id/:id',authenticateUser, manufactureController.getManufactureById)
//router.put('/update-manufacture/:id', manufactureController.updateManufactureById)
//router.delete('/delete-manufacture/:id', manufactureController.deleteManufactureById)
router.get('/manufacture-name-by-id/:manufactureId',authenticateUser, manufactureController.getManufactureName)


router.get('/devices-decode-custom-datetime/:devEui', locationController.getDecodedDataByDateTime);
//test api for creating the device
//router.post('/add-device-data-test', authenticateUser, deviceDataController.createDeviceTest);

//router.post('/add-device-data-t3',authenticateUser ,deviceDataController.addDevice);

//Rohit

// module
router.post('/add-modules', modulesController.createModule );
router.get('/get-all-modules', modulesController.getAllModules);
router.get('/get-all-modules-by-id', modulesController.getModuleById);
router.post('/add-update-modules-with-permissions', modulesController.createModuleWithPermission)


// permission

router.post('/add-permissions', permissionController.createPermission)
router.get('/get-all-permissions', permissionController.getAllPermissions)
router.get('/get-permissions-by-role-id/:id',authenticateUser, permissionController.getPermissionsByRole)
router.post('/update-permissions-in-bulk',authenticateUser, permissionController.bulkUpsertPermissions);
router.get('/get-permissions-by-user-id/:id', permissionController.getPermissionsByUserId)
router.get('/get-view-permissions-by-role-id',authenticateUser, permissionController.getViewPermissionsByRole)

// get all role
router.get('/get-all-roles',authenticateUser, roleController.getAllRoles)

//create customer command.
router.post('/custom-meter-commands', downlinkMapping.CustomMeterDownlink);

module.exports = router;
