const User = require("../models/User"); // Import User model
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing

// Get user details
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    ); // Exclude sensitive data
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

// Update user details
/**
 * swagger: '2.0'
info:
  description: API for managing user details.
  version: "1.0.0"
  title: User Management API
host: localhost:5000
basePath: /api
schemes:
  - http
paths:
  /users/me:
    put:
      summary: Update user details
      description: Updates the authenticated user's details. If no new information is provided, a message will indicate that no changes were made.
      security:
        - bearerAuth: []  # Assuming you're using bearer token authentication
      parameters:
        - in: body
          name: body
          description: The user details to update. Only `username` and `password` fields can be updated.
          required: false
          schema:
            type: object
            properties:
              username:
                type: string
                example: "newUsername"
              password:
                type: string
                example: "newPassword"
      responses:
        200:
          description: Successful update of user details
          schema:
            type: object
            properties:
              message:
                type: string
                example: "User details updated successfully"
              user:
                type: object
                properties:
                  username:
                    type: string
                    example: "newUsername"
        400:
          description: Bad request due to invalid input or empty request
          schema:
            type: object
            properties:
              message:
                type: string
                example: "Invalid username type"
        404:
          description: User not found
          schema:
            type: object
            properties:
              message:
                type: string
                example: "User not found"
        default:
          description: Unexpected error
          schema:
            type: object
            properties:
              message:
                type: string
                example: "Error updating user details"

 */
exports.updateUserDetails = async (req, res) => {
  const { username, password } = req.body; // Destructure username and password from the request body

  try {
    // Validate that the ID is in the expected format (if applicable)
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Find the authenticated user by their ID
    const user = await User.findById(req.user.id);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updated = false; // Track if any updates were made

    // Validate field types
    if (username && typeof username !== "string") {
      return res.status(400).json({ message: "Invalid username type" });
    }
    if (password && typeof password !== "string") {
      return res.status(400).json({ message: "Invalid password type" });
    }

    // Check if any data is provided for the update
    if (!username && !password) {
      return res.status(400).json({ message: "No new information provided" });
    }

    // Update username if it is provided
    if (username) {
      user.username = username;
      updated = true; // Mark as updated
    }

    // Update password if it is provided
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the new password
      updated = true; // Mark as updated
    }

    // Save the changes to the database if there are updates
    if (updated) {
      await user.save();
      return res.json({ message: "User details updated successfully", user });
    }

    // Removed the unnecessary response about unchanged details
  } catch (error) {
    // Differentiate between a user not found and a general error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Handle any other errors
    res.status(500).json({ message: "Error updating user details", error });
  }
};
