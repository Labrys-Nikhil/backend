// src/controllers/customerController.js

const customerService = require('../services/customerService');
const organizationService = require('../services/organizationService');

const jwt = require('jsonwebtoken'); // For generating JWT tokens
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { upload, deleteImage } = require('../helper/imageHelper');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
require("dotenv").config()

const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    console.log(req.body)
    // Register customer first
    const customer = await customerService.createCustomer(customerData);

    // Send success response immediately after customer registration
    res.status(201).json({ success: true, data: customer });

    // Send verification email in the background (non-blocking)
    emailService.sendVerificationMail(customer.firstName, customer.email, customer.id)
      .then(() => logger.info(`Verification email sent to ${customer.email}`))
      .catch((err) => logger.error(`Failed to send verification email: ${err.message}`));

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    console.log("customer", customer)
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};



// const verifyCustomer = async (req, res) => {
//   try {
//     const customerId = parseInt(req.params.id); 


//     const customer = await customerService.verifyCustomer(customerId);

//     if (!customer) {
//       return res.status(404).json({ success: false, message: "Customer not found" });
//     }

//     // Return success response if the customer is verified
//     // res.status(200).json({ success: true, message: "Customer verified successfully", data: customer });
//     return res.sendFile(path.join(__dirname, '..', 'public', 'views', 'verified.html'));
//   } catch (error) {
//     // Handle any errors and respond accordingly
//     res.status(500).json({ success: false, message: error.message });
//   }
// };




// Login customer


const verifyCustomer = async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);

    // Fetch the customer from the database
    const customer = await customerService.getCustomerById(customerId);

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    // Check if the customer is already verified
    if (customer.isVerified) {
      // If the customer is already verified, send a different HTML file or response
      return res.sendFile(path.join(__dirname, '..', 'public', 'views', 'already-verified.html'));
    }

    // Verify the customer if not already verified
    const verifiedCustomer = await customerService.verifyCustomer(customerId);

    // If verification is successful, return the verified.html file
    return res.sendFile(path.join(__dirname, '..', 'public', 'views', 'verified.html'));

  } catch (error) {
    // Handle any errors and respond accordingly
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the customer by email
    const customer = await customerService.getCustomerByEmail(email);

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer node --trace-warningsnot found" });
    }

    // Check customer is verified
    if (!customer.isVerified) {
      return res.status(403).json({ success: false, message: "Customer is not verified. Please verify your email before logging in." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate a JWT token (Replace 'secretkey' with your actual secret or use environment variables)
    const token = jwt.sign({ id: customer.id, firstName:customer.firstName,lastName:customer.lastName,email: customer.email, role: customer.role_id }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });

    // Return success response with the JWT token
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const logoutCustomer = async (req, res)=> {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent as a Bearer token

  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    // Verify the token
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

    // Add the token to the blacklist with expiration time
    await prisma.tokenblacklist.create({
      data: {
        token,
        expiresAt: new Date(decoded.exp * 1000), // Convert expiration time from seconds to Date
      },
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}


const verifyEmail = async (req, res) => {
  try {
    const userId = req.query.id;

    // Verify the customer by updating their status
    const customer = await customerService.verifyCustomer(userId);

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    // After successful verification, render the success view
    return res.sendFile(path.join(__dirname, '../views/verified.html'));

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const resendVerificationMail = async (req, res) => {
  try {
    const customerId = req.params.id; // Assuming the customer's ID is passed in the URL params

    // Fetch customer from the database
    const customer = await customerService.getCustomerById(customerId);

    // Check if customer exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check if customer is already verified
    if (customer.isVerified) {
      return res.status(400).json({ success: false, message: 'Customer is already verified' });
    }

    // Resend verification email
    await emailService.sendVerificationMail(customer.firstName, customer.email, customer.id);

    // Log the email resend event
    logger.info(`Verification email resent to ${customer.email}`);

    // Return success response
    res.status(200).json({ success: true, message: 'Verification email resent successfully' });

  } catch (error) {
    logger.error(`Failed to resend verification email: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to resend verification email' });
  }
};


const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch customer by email
    const customer = await customerService.getCustomerByEmail(email);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

  } catch (error) {
    logger.error(`Failed to sent forget password: ${error.message}`);
  }
}



const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update customer password
    await customerService.updateCustomerPassword(email, hashedPassword);

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};



const updateProfile = async (req, res) => {
  try {
    // Use multer to handle the image upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const customerId = req.user.id; // Assuming the user is authenticated and the ID is in req.user
      const { firstName, lastName, countryCode, phoneNumber, currentPassword, newPassword } = req.body;

      let imageUrl;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedCustomer = await customerService.updateCustomerProfile({
        customerId,
        firstName,
        lastName,
        countryCode,
        phoneNumber,
        currentPassword,
        newPassword,
        image: imageUrl
      });

      res.status(200).json({ success: true, data: updatedCustomer });
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message });
  }
};


const getOrganizationsByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.id;
    const organizations = await organizationService.getOrganizationsByCustomerId(customerId);
    res.status(200).json({ success: true, data: organizations });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};


const getCustomerWithOrganizations = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerWithOrganizations = await organizationService.getCustomerWithOrganizations(customerId);
    res.status(200).json({ success: true, data: customerWithOrganizations });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  verifyCustomer,
  loginCustomer,
  logoutCustomer,
  verifyEmail,
  resendVerificationMail,
  forgetPassword,
  resetPassword,
  updateProfile,
  getOrganizationsByCustomerId,
  getCustomerWithOrganizations
}