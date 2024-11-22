const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger'); // Assuming logger is already configured

// Create Organization Service
const createOrganization = async (organizationData) => {
  try {
    const newOrganization = await prisma.organization.create({
      data: {
        name: organizationData.name,
        description: organizationData.description,
        customerId: organizationData.customerId,
        createdAt: new Date(),
      },
    });
    return newOrganization;
  } catch (error) {
    logger.error(`Failed to create organization: ${error.message}`, { error }); // Log detailed error
    throw new Error("Error creating organization");
  }
};

// Get Organizations by Customer ID Service
const getOrganizationsByCustomerId = async (customerId) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        customerId: parseInt(customerId), // Ensure customerId is an integer
      },
    });

    if (!organizations || organizations.length === 0) {
      throw new Error('No organizations found for this customer');
    }

    return organizations;
  } catch (error) {
    logger.error(`Error fetching organizations for customer ID ${customerId}: ${error.message}`, { error });
    throw error;
  }
};

// Get Customer with Organizations Service
const getCustomerWithOrganizations = async (customerId) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(customerId), // Ensure customerId is an integer
      },
      include: {
        organizations: true, // Include associated organizations
      },
    });

    if (!customer || customer.isDeleted) {
      throw new Error('Customer not found or deleted');
    }

    return customer;
  } catch (error) {
    logger.error(`Error fetching customer with organizations for ID ${customerId}: ${error.message}`, { error });
    throw error;
  }
};

module.exports = {
  createOrganization,
  getOrganizationsByCustomerId,
  getCustomerWithOrganizations
};
