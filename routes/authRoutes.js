const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // Import authController
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware"); // Import middlewares

// User registration route
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  try {
    await authController.register(req, res); // Call the register controller
  } catch (error) {
    // Error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// User login route
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  try {
    await authController.login(req, res); // Call the login controller
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// Protected route example
/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Example protected route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to protected route
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/protected", authenticateToken, authorizeRole(["user", "organizer"]), (req, res) => {
  res.json({ message: "This is a protected route", user: req.user }); // Protected route response
});

// Route to refresh token
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       500:
 *         description: Internal server error
 */
router.post("/refresh-token", async (req, res) => {
  try {
    await authController.refreshToken(req, res); // Call the refresh token controller
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// Route for logging out
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and revoke refresh token
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */
router.post('/logout', async (req, res) => {
  try {
    await authController.logout(req, res); // Call the logout controller
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

module.exports = router;
