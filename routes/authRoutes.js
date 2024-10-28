const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // Import authController
const {
  authenticateToken,
  authorizeRole,
} = require("../middlewares/authMiddleware"); // Import middlewares


// User registration route
router.post("/register", authController.register);

// User login route
router.post("/login", authController.login);

// Protected route example
router.get(
  "/protected",
  authenticateToken,
  authorizeRole(["user", "organizer"]),
  (req, res) => {
    res.json({ message: "This is a protected route", user: req.user }); // Protected route response
  }
);

// Route to refresh token
router.post("/refresh-token", authController.refreshToken);

// Route for logging out
router.post('/logout', authController.logout); 

module.exports = router;
