// src/services/emailService.js

const nodemailer = require("nodemailer");
const logger = require("../utils/logger"); // Assuming you have a logger for handling logs
const customerService = require("./customerService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to send verification email

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for 587
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env file
    pass: process.env.EMAIL_PASS, // Your email password from .env file
  },
});



exports.sendVerificationMail = async (name, email, userId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Receiver email
      subject: "Welcome to Our Platform - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <img src="https://www.smartlynk.net/images/smart.jpg" alt="Logo" style="width: 100px; margin-bottom: 20px;">
          <h1 style="color: #333;">Welcome to Our Platform</h1>
          <p style="color: #666; font-size: 16px;"> 
            Hi ${name}, Thanks for signing up! We just need you to verify your email address to complete your account setup.
          </p>
          <a href="https://soodprints.in:8091/api/customers-verify/${userId}" 
             style="display: inline-block; background-color: #0B8EB6; color: white; padding: 10px 20px; 
                    text-decoration: none; font-size: 18px; border-radius: 5px; margin-top: 20px;">
            Verify Email
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Please do not reply to this email as it will not be received.
          </p>
        </div>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);

  } catch (error) {
    logger.error(`Error sending verification email: ${error.message}`);
    throw new Error("Failed to send verification email.");
  }
};


exports.sendAlertMail = async (name, email, alertDetails, deviceName, deviceEui) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Receiver email
      subject: "Alert: Action Required for Your Device",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <img src="https://www.smartlynk.net/images/smart.jpg" alt="Logo" style="width: 100px; margin-bottom: 20px;">
          <h1 style="color: #ff4d4d;">Important Device Alert</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${name},<br>
            We detected an issue with your device ${deviceName} (Device ID: ${deviceEui}). Please see the alert details below:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;">Attribute</th>
              <th style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;">Value</th>
            </tr>
            ${alertDetails
              .map(
                (alert) => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${alert.attribute}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${alert.value}</td>
                </tr>`
              )
              .join('')}
          </table>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Please take the necessary actions as soon as possible.<br>
            If you need assistance, feel free to reach out to our support team.
          </p>
          <p style="color: #999; font-size: 14px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    logger.info(`Alert email sent to ${email}`);

  } catch (error) {
    logger.error(`Error sending alert email: ${error.message}`);
    throw new Error("Failed to send alert email.");
  }
};


exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch customer by email
    const customer = await customerService.getCustomerByEmail(email);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign({ email: customer.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Generate reset URL with the token
    const resetUrl = `https://yourdomain.com/reset-password/${resetToken}`;


    // No need for reset token, just send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    height: 100% !important;
                    text-align: center;
                }

                * {
                    box-sizing: border-box;
                }

                table {
                    border-spacing: 0;
                    border-collapse: collapse;
                }

                .container {
                    width: 100%;
                    padding: 20px;
                    background-color: #f4f4f4;
                }

                .email-content {
                    background-color: #fff;
                    padding: 15px 20px; /* Adjusted padding */
                    margin: 10px auto;  /* Adds 10px space above and below the content to show the background */
                    max-width: 600px;
                    width: 100%;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #0B8EB6;
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                p {
                    font-size: 16px;
                    color: #666666;
                    line-height: 1.5;
                    padding: 20px;
            
                }

                .reset-btn {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #0B8EB6 !important;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 18px;
                    margin-top: 20px;
                }

                .reset-btn:hover {
                    background-color: #096b91;
                }

                .footer-hr {
                  border: 0; /* Remove default border */
                  height: 1px; /* Set the height of the hr line */
                  background-color: #ddd; /* Change color if needed */
                  margin: 10px 20px; /* Adjust top/bottom and left/right margin */
                  width: 80%; /* Adjust the width of the hr */
                  max-width: 500px; /* Optional: Set a max width */
              }

              .footer-text {
              font-size: 12px; /* Adjust this size as needed */
              color: #666666; /* Optional: Change the color */
              }

              .logo {
                  width: 150px;
                  margin-bottom: 20px;
              }

                /* Responsive styles for mobile devices */
                @media only screen and (max-width: 600px) {
                    .email-content {
                        padding: 15px;
                        max-width: 100% !important;
                    }

                    h1 {
                        font-size: 20px;
                    }

                    p {
                        font-size: 14px;
                    }

                    .reset-btn {
                        font-size: 16px;
                        padding: 10px 20px;
                    }

                    .logo {
                        width: 120px;
                    }
                }
            </style>
        </head>
        <body>
            <!-- Wrapping the content inside a table to ensure proper rendering across email clients -->
            <table class="container" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <!-- Content Table -->
                        <table class="email-content" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center">
                                    <img src="https://i.imgur.com/SJnB5Mw.jpeg" alt="Logo" class="logo">
                                    <h1>Forgot Your Password</h1>
                                    <p>We received a request to reset the password for your account. Click the button below to reset your password. If you didn't request this, please ignore this email.</p>
                                    <a href="${resetUrl}" class="reset-btn">Reset Password</a>
                                    <p>Please do not reply to this email as it will not be received. For further information and support, please <a href="https://yourdomain.com/support" style="color: #0B8EB6;">click here</a>.</p>
                                </td>
                            </tr>
                            <tr>
                              <td align="center">
                                  <div class="footer">
                                      <hr class="footer-hr">
                                      <p class="footer-text">Copyright © 2024, Labrys Solutions Pvt. Ltd | All rights reserved.</p>
                                  </div>
                              </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);

    logger.info(`Reset password email sent to ${email}`);
    res.status(200).json({ success: true, message: 'Reset password email sent successfully' });

  } catch (error) {
    logger.error(`Failed to send reset password email: ${error.message}`);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
}; 
