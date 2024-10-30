const { Server } = require('socket.io'); // Import Socket.io

// Function to setup Socket.io server
const setupSocket = (server) => {
  const io = new Server(server); // Initialize a new instance of Socket.io with the provided server

  // Handle Socket.io connections
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Channel for ticket availability notifications
    socket.on("checkAvailability", (data) => {
      io.emit("availabilityStatus", data);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io; // Return the io instance if needed in other modules
};

module.exports = { setupSocket }; // Export the setupSocket function for use in other modules
