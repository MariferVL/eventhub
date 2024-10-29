const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // Import authController
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware"); // Import middlewares

// User registration route
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
router.post("/login", async (req, res) => {
  try {
    await authController.login(req, res); // Call the login controller
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// Protected route example
router.get("/protected", authenticateToken, authorizeRole(["user", "organizer"]), (req, res) => {
  res.json({ message: "This is a protected route", user: req.user }); // Protected route response
});

// Route to refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    await authController.refreshToken(req, res); // Call the refresh token controller
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// Route for logging out
router.post('/logout', async (req, res) => {
  try {
    await authController.logout(req, res); // Call the logout controller
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

module.exports = router;
