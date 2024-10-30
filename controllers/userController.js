const User = require("../models/User"); // Import User model

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
    const user = await User.findById(req.user.id).select("-password -refreshToken"); // Exclude sensitive data
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

// Update user details
/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update user details
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
exports.updateUserDetails = async (req, res) => {
  const { username, password } = req.body; // Assuming we want to update these fields
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { username, password }, { new: true, runValidators: true });
    res.json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Error updating user details", error });
  }
};
