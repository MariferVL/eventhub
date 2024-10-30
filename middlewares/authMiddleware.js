const jwt = require("jsonwebtoken"); // Import jsonwebtoken

// Middleware to verify token and authorize user
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /protected-route:
 *   get:
 *     summary: Example protected route
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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
/**
 * @swagger
 * /role-protected-route:
 *   get:
 *     summary: Example role-protected route
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       403:
 *         description: Access denied
 */
exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" }); // Forbidden if role not allowed
    }
    next(); // Proceed to the next middleware
  };
};
