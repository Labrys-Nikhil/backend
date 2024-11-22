// /src/controllers/organizationController.js

const organizationService = require('../services/organizationService');
const logger = require('../utils/logger');

const addOrganization = async (req, res) => {
  const { name, description } = req.body;

  const customerId  = req.user.id;
  console.log(name,description,customerId);
  if (!name || !description || !customerId) {
    return res.status(400).json({ message: 'Name, description, and customerId are required.' });
  }

  try {
    const newOrganization = await organizationService.createOrganization({ name, description, customerId });
    return res.status(201).json(newOrganization);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addOrganization,
};
