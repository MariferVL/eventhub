const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
// Load environment variables from a .env file into process.env
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config(); // Common way to configure dotenv
// Alternative concise approach
// require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000; // Set port from environment or default to 5000

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

// Configurar socket.io para manejar eventos de disponibilidad en tiempo real
io.on("connection", (socket) => {
  console.log("New client connected");

  // Canal para notificaciones de disponibilidad de entradas
  socket.on("checkAvailability", (data) => {
    io.emit("availabilityStatus", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { io };
