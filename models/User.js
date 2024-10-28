const mongoose = require("mongoose");

// User schema definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "organizer"], default: "user" },
  refreshToken: { type: String }, // Token for session management
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Export the User model
module.exports = mongoose.model("User", userSchema);
