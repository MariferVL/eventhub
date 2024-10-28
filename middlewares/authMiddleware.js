const jwt = require("jsonwebtoken"); // Import jsonwebtoken

// Middleware to verify token and authorize user
exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from the authorization header
  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token, forbidden
    req.user = user; // Store user info in request object
    next(); // Proceed to the next middleware
  });
};

// Middleware to check user role
exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" }); // Forbidden if role not allowed
    }
    next(); // Proceed to the next middleware
  };
};
