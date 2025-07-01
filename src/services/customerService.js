const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const emailService = require('./emailService');  // Import the email service
const saltRounds = 10;
const path = require('path');


exports.createCustomer = async (customerData) => {
  const { firstName, lastName, companyName, password, confirmPassword, countryCode, phoneNumber, email, role } = customerData;

  try {
    // Validate password match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the customer in the database
    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        companyName,
        password: hashedPassword,
        countryCode,
        phoneNumber,
        email,
//        role: role || 'customer',
      },
    });

    // Log customer creation success
    logger.info(`Customer created successfully with ID: ${customer.id}`);

    // Return success response immediately (before sending email)
    return customer;

  } catch (error) {
    logger.error(`Failed to create customer: ${error.message}`);
    throw error;
  }
};

exports.getAllCustomers = async () => {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        isDeleted: false,  // Fetch only customers who are not soft-deleted
      },
    });
    return customers;
  } catch (error) {
    logger.error(`Error fetching customers: ${error.message}`);
    throw error;
  }
};


exports.getCustomerById = async (customerId) => {
  try {
    // Convert customerId to an integer
    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(customerId),  // Ensure the ID is passed as an integer
      },
    });

    if (!customer || customer.isDeleted) {
      throw new Error('Customer not found or deleted');
    }

    return customer;
  } catch (error) {
    logger.error(`Error fetching customer with ID ${customerId}: ${error.message}`);
    throw error;
  }
};


// Function to verify the customer
exports.verifyCustomer = async (customerId) => {
  try {
    // Update the customer to mark as verified
    const customer = await prisma.customer.update({
      where: { id: customerId }, // Use the integer ID
      data: { isVerified: true },
    });

    if (!customer) {
      logger.error(`Customer not found with ID: ${customerId}`);
      return null;
    }

    // Log the verification
    logger.info(`Customer with ID: ${customerId} verified successfully`);

    return customer;
  } catch (error) {
    // Log the error and re-throw it to be handled by the controller
    logger.error(`Failed to verify customer: ${error.message}`);
    throw new Error('Failed to verify customer');
  }
};





exports.getCustomerByEmail = async (email) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      logger.error(`Customer not found with email: ${email}`);
      return null;
    }

    // Log customer retrieval
    logger.info(`Customer with email: ${email} retrieved successfully`);
    
    return customer;
  } catch (error) {
    logger.error(`Failed to retrieve customer: ${error.message}`);
    throw new Error('Failed to retrieve customer');
  }
};


exports.getCustomerById = async (customerId) => {
  return await prisma.customer.findUnique({
    where: { id: parseInt(customerId) },
  });
};



exports.updateCustomerPassword = async (email, hashedPassword) => {
  return await prisma.customer.update({
    where: { email },
    data: { password: hashedPassword }
  });
};



exports.updateCustomerProfile = async (profileData) => {
  const { customerId, firstName, lastName, countryCode, phoneNumber, currentPassword, newPassword, image } = profileData;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, customer.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      customer.password = hashedNewPassword;
    }

    // Update customer profile
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        firstName,
        lastName,
        countryCode,
        phoneNumber,
        image: image || customer.image // If new image is uploaded, update it
      }
    });

    return updatedCustomer;
  } catch (error) {
    console.error(error)
    throw error;
  }
};



