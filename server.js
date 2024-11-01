const express = require("express"); // Import Express
const mongoose = require("mongoose"); // Import Mongoose
const http = require("http"); // Import HTTP module
const cookieParser = require("cookie-parser"); // Import cookie-parser
const dotenv = require("dotenv"); // Import dotenv
const path = require("path"); 
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const eventRoutes = require("./routes/eventRoutes"); // Import event routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
const reservationRoutes = require("./routes/reservationRoutes"); // Import reservation routes
const { setupSocket } = require("./sockets/socketIo"); // Import Socket.io setup

dotenv.config(); // Load environment variables

// Create an Express application
const app = express();
const server = http.createServer(app); // Create the HTTP server

// Configure port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Connect to MongoDB
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
app.use("/api/reservations", reservationRoutes); // Reservation routes


// Initialize Socket.io
const io = setupSocket(server); // Pass the server to the Socket.io setup function

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error" });
});

// Serve static files
app.use(express.static("public"));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Asegúrate de que la ruta sea correcta
});

// Start the server
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}