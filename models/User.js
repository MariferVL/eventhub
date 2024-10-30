const mongoose = require("mongoose"); // Import mongoose

// User schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           description: The role of the user (user or organizer)
 *           enum:
 *             - user
 *             - organizer
 *         refreshToken:
 *           type: string
 *           description: The token for session management
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: d5fE_asz
 *         username: johndoe
 *         password: $2a$10$CwTycUXWue0Thq9StjUM0u
 *         role: user
 *         refreshToken: null
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username for the user
  password: { type: String, required: true }, // Password for the user
  role: { type: String, enum: ["user", "organizer"], default: "user" }, // Role of the user, default is 'user'
  refreshToken: { type: String }, // Token for session management
  createdAt: { type: Date, default: Date.now }, // Date when the user was created
  updatedAt: { type: Date, default: Date.now } // Date when the user was last updated
});

// Export the User model
module.exports = mongoose.model("User", userSchema);
