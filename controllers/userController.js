const User = require("../models/User");

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken"); // Exclude sensitive data
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
  const { username, password } = req.body; // Assuming we want to update these fields
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { username, password }, { new: true, runValidators: true });
    res.json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Error updating user details", error });
  }
};
