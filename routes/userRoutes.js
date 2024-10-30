const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import userController
const { authenticateToken } = require("../middlewares/authMiddleware"); // Import authentication middleware

// Get the details of the authenticated user
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the details of the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/me", authenticateToken, userController.getUserDetails);

// Update user information
/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error updating user details
 *       500:
 *         description: Internal server error
 */
router.put("/me", authenticateToken, userController.updateUserDetails);

module.exports = router;
