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
const notificationController  = require('../controllers/notificationController');
const hardwareAttributesController = require('../controllers/hardwareAttributeController')
const downlinkDeviceController = require('../controllers/downlinkController');
const timezoneController = require('../controllers/timezoneController');
const autoDownlinkController = require('../controllers/autoDownlinkController');
const deviceTypeController = require('../controllers/devicetypeController');

const emailService = require('../services/emailService');
const authenticateUser = require('../middlewares/auth');  // Authentication Middleware
const authorizeRoles = require('../middlewares/authorize');
const router = express.Router();

router.post('/create-customers', customerController.createCustomer);
router.get('/get-all-customers', customerController.getAllCustomers);
router.get('/get-customers-by-id/:id', customerController.getCustomerById);
router.get('/customers-verify/:id', customerController.verifyCustomer);
router.post('/customers-login', customerController.loginCustomer);
router.get('/verify', customerController.verifyEmail);
router.get('/resend-verification/:id', customerController.resendVerificationMail);
router.post('/forgot-password',authenticateUser, emailService.forgetPassword);
router.post('/reset-password',authenticateUser, customerController.resetPassword);
router.put('/update-profile', authenticateUser, customerController.updateProfile);

// POST /api/organizations - Add a new organization     
router.post('/add-organizations', authenticateUser, organizationController.addOrganization);
router.get('/customers/:id/organizations',authenticateUser, customerController.getOrganizationsByCustomerId);
router.get('/customer-organization/:id',authenticateUser, customerController.getCustomerWithOrganizations);

// devices
router.post('/add-device-data', deviceDataController.createDevice);
router.get('/get-device-data-by-id/:id', deviceDataController.getDeviceById);
router.get('/get-all-device', deviceDataController.getAllDevices);
router.put('/update-device-data/:id',authenticateUser, deviceDataController.updateDevice);
router.delete('/delete-device-data/:id',authenticateUser, deviceDataController.deleteDevice);
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
router.get('/get-hardware-devices',authenticateUser, hardwareController.getAllHardware);       // Get all hardware entries
router.get('get-hardware-devices-by-id/:id',authenticateUser, hardwareController.getHardwareById);   // Get a hardware entry by ID
router.put('update-hardware-devices/:id',authenticateUser, hardwareController.updateHardware);     // Update a hardware entry by ID
router.delete('delete-hardware-devices/:id',authenticateUser, hardwareController.deleteHardware);   // Delete a hardware entry by ID

//output
router.post('/add-output',authenticateUser, outputController.createOutput)
router.get('/get-all-outputs',authenticateUser, outputController.getAllOutputs);
router.get('/get-outputs/:id',authenticateUser, outputController.getOutputById);
router.put('/update-outputs/:id',authenticateUser, outputController.updateOutput);
router.delete('/delete-outputs/:id',authenticateUser, outputController.deleteOutput);



// hardware outputs

router.post('/add-hardware-output',authenticateUser, hardwareOutputController.createHardwareOutput)
router.get('/get-all-hardwares-output',authenticateUser, hardwareOutputController.getAllHardwareOutputs);
router.get('/get-all-hardwares-output-by-id/:id',authenticateUser, hardwareOutputController.getHardwareOutputById);
router.put('/update-hardwares-output/:id',authenticateUser, hardwareOutputController.updateHardwareOutput);
router.delete('/delete-hardwares-output/:id',authenticateUser, hardwareOutputController.deleteHardwareOutput);

// hardware atttirubtes
router.post('/add-hardware-attributes', hardwareAttributesController.createHardwareAttribute)


//projects
router.post('/add-projects',authenticateUser, projectController.addProjects);
router.get('/get-all-projects',authenticateUser, projectController.getAllProjects);
router.get('/get-projects-by-id',authenticateUser, projectController.getProjectById);
router.put('/update-projects/:id',authenticateUser, projectController.updateProject);
router.delete('/delete-projects/:id',authenticateUser, projectController.deleteProject);

//alerts
router.get('/alerts',alertController.getAllAlerts);
router.get('/alerts/:projectId',alertController.getAllAlertsByProjectId);
router.post('/add-alerts',alertController.createAlert);


// device server data
router.get('/get-all-device-server-data', deviceServerController.getAllDevices);
router.get('/get-all-device-server-data-by-id/:id', deviceServerController.getDeviceById);
router.post('/add-device-server-data', deviceServerController.createDevice);
router.put('/update-device-server-data/:id', deviceServerController.updateDevice);
router.delete('/delete-device-server-data/:id', deviceServerController.deleteDevice);
router.get('/get-recent-device-server-data/:devEui', deviceServerController.getRecentDevices)


router.get('/get-decoded-data/:devEui', decodeDeviceController.getDecodedData);
router.get('/recent-decode-data/:devEui', decodeDeviceController.getRecentDecodedData)

//notification apis
router.get('/get-notifications', notificationController.getNotifications);
router.get('/get-notifications/:projectId', notificationController.getNotificationsByProjectId);

//send downlink API
router.post('/send-downlink-device', downlinkDeviceController.postDownlinkDevice)
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
router.get('/get-downlink-device/:id', autoDownlinkController.getAutoDownlinkByAlertId);
router.put('/downlinkDevices/:id', autoDownlinkController.updateAutoDownlink);
router.delete('/downlinkDevices/:id', autoDownlinkController.deleteAutoDownlink);

// POST - Create a Device Type
router.post('/create-device-type', deviceTypeController.createDeviceType);
router.get('/get-device-type', deviceTypeController.getDeviceTypes);
router.get('/get-device-typeById/:id', deviceTypeController.getDeviceType);
router.put('/update-device-type/:id', deviceTypeController.updateDeviceType);
router.delete('/delete-device-type/:id', deviceTypeController.deleteDeviceType);

module.exports = router;
