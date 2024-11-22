const jwt = require('jsonwebtoken');

// Authentication Middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided, access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode the token with your JWT secret
    req.user = decoded; // Store the decoded user info (email, userId, etc.) in the request object
    
    next(); // Move to the next middleware/controller if token is valid
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token, access denied.' });
  }
};

module.exports = authenticateUser;
