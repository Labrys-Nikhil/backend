// src/controllers/emailController.js

const emailService = require('../services/emailService');

// Controller function to send verification email
exports.sendVerificationEmail = async (req, res) => {
  const { name, email, userId } = req.body; // Extract data from request body

  try {
    // Call the service to send email
    await emailService.sendVerificationMail(name, email, userId);

    return res.status(200).json({
      success: true,
      message: 'Verification email sent successfully.',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send verification email.',
    });
  }
};
