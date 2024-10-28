const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Get the details of the authenticated user
router.get("/me", authenticateToken, userController.getUserDetails);

// Update user information
router.put("/me", authenticateToken, userController.updateUserDetails);

module.exports = router;
