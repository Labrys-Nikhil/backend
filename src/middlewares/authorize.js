// Authorization Middleware to verify role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const { role } = req.user; // Assume the user's role is stored in the token
  
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
      }
  
      next(); // Proceed if role matches one of the allowed roles
    };
  };
  
  module.exports = authorizeRoles;
  