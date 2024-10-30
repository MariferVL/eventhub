const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const listEndpoints = require('express-list-endpoints');

// Load environment variables from a .env file into process.env
const dotenv = require("dotenv");
dotenv.config(); // Common way to configure dotenv

// Import routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/events", eventRoutes); // Event routes
app.use("/api/users", userRoutes); // User routes

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Event Reservation API");
});

// Configure socket.io to handle real-time availability events
io.on("connection", (socket) => {
  console.log("New client connected");

  // Channel for ticket availability notifications
  socket.on("checkAvailability", (data) => {
    io.emit("availabilityStatus", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    // Handle validation errors and respond with a 400 status code and the error message
    return res.status(400).json({ message: err.message });
  }
  // For other errors, you can send a generic or specific message
  res.status(500).json({ message: "Internal server error" });
});

app.use(express.static("public"));

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(listEndpoints(app));
});

module.exports = { io };
