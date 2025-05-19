const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Authentication Middleware
// const authenticateUser = async (req, res, next) => {
//   const token = req.headers['authorization'].split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'No token provided, access denied.' });
//   }

//   try {
//     // Check if token is blacklisted
//     const blacklistedToken = await prisma.tokenblacklist.findUnique({
//       where: { token },
//     });
    
//     if (blacklistedToken) return res.status(401).json({ error: 'Token is blacklisted' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode the token with your JWT secret
//     req.user = decoded; // Store the decoded user info (email, userId, etc.) in the request object

//     next(); // Move to the next middleware/controller if token is valid
//   } catch (error) {
//     console.error('JWT verification error:', error);
//     return res.status(401).json({ success: false, message: 'Invalid token, access denied.' });
//   }
// };

const authenticateUser = async (req, res, next) => {
  console.log('Authorization header:', req.headers['authorization']);
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: 'No token provided, access denied.' });
  }

  try {
    console.log('Checking if token is blacklisted');
    // Check if token is blacklisted
//    const blacklistedToken = await prisma.tokenblacklist.findUnique({
  //    where: { token },
    //});
    const blacklistedToken = await prisma.tokenblacklist.findFirst({
      where: { token },
      orderBy: { createdAt: 'desc' }, // descending order
    });

    if (blacklistedToken) {
      console.log('Token is blacklisted');
      return res.status(401).json({ error: 'Token is blacklisted' });
    }

    console.log('Verifying JWT token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode the token with your JWT secret
    console.log('Token decoded successfully:', decoded);

    req.user = decoded; // Store the decoded user info (email, userId, etc.) in the request object
    console.log('User info added to request:', req.user);

    next(); // Move to the next middleware/controller if token is valid
  } catch (error) {
    console.error('JWT verification error:', error);
    console.log('Invalid token verification');
    return res.status(401).json({ success: false, message: 'Invalid token, access denied.' });
  }
};

module.exports = authenticateUser;
