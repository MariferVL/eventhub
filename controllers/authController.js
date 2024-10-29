const User = require("../models/User"); // Import User model
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation
const dotenv = require("dotenv"); // Import dotenv to use environment variables

dotenv.config(); // Load environment variables from .env file

// Register a new user
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate role
    const validRoles = ['user', 'organizer']; // Valid roles
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `'${role}' is not a valid role.` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      role: role || "user", // Default role to 'user' if not specified
    });
    await user.save(); // Save user to the database

    res.status(201).json({ message: "User registered successfully" }); // Return success message
  } catch (error) {
    console.error("Error during user registration:", error); // Log error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

// Authenticate user and return JWT and refresh token
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Create access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    // Save refresh token in user's document in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set the refresh token in a secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevent access from JavaScript
      secure: true, // Only send cookie over HTTPS
      sameSite: "Strict", // Helps prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ accessToken }); // Return only the access token
  } catch (error) {
    console.error("Error during user login:", error); // Log error
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

// Refresh access token using refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });
  try {
    // Verify the refresh token
    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Ensure refresh token matches one in database
    const user = await User.findById(userData.id);
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error during token refresh:", error); // Log error
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Logout user and revoke refresh token
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(204).send(); // No content
  try {
    // Revoke token logic
    const user = await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null } // Revoke the token
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie('refreshToken'); // Clear cookie
    res.sendStatus(204); // No content
  } catch (error) {
    console.error("Logout error:", error); // Log error
    res.status(500).json({ message: "Internal server error" });
  }
};
