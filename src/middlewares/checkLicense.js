const jwt = require("jsonwebtoken");

// Define the secret key (ensure it's the same for both signing and verification)
const LICENSE_SECRET_KEY = "my_super_secure_license_secret_123!";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const checkLicense = async (req, res, next) => {

    try {
        const { licenseToken, id: customerId } = req.user; // Extract licenseToken & customerId from JWT payload

        // Fetch organization using customerId
        const organization = await prisma.organization.findFirst({
            where: { customerId },
            select: { id: true },
        });

        console.log("checking the organization",organization);

        //If user is not part of any organization
        if (!organization) {
            return res.status(301).json({
                success: true,
                message: "You haven't joined any organization. Please join or create an organization.",
                redirectUrl:"/create-organization"
            });
        }

        // If licenseToken is missing, check if organization has a license
        if (!licenseToken) {
            return res.status(403).json({
                success: false,
                message: "No valid license assigned to this organization. Please upgrade your plan.",
            });
        }

        // Verify the license token
        console.log('licenseToken in checkLicense', licenseToken);
        const decodedLicense = jwt.verify(licenseToken, LICENSE_SECRET_KEY);
        console.log('decodedLicense in checkLicense', decodedLicense);

        // Check if the license exists in the database
        const license = await prisma.license.findUnique({
            where: { id: decodedLicense.licenseId },
            select: { isActive: true},
        });

        if (!license) {
            return res.status(403).json({ success: false, message: "Invalid license." });
        }

        // Check if the license is expired or inactive
        if (!license.isActive || new Date(license.expiresAt) < new Date()) {
            return res.status(403).json({ success: false, message: "License is expired or inactive." });
        }

        // License is valid, proceed to the next middleware
        next();
    } catch (error) {
        console.error("License verification failed:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired license token." });
    }
};

module.exports = checkLicense;

