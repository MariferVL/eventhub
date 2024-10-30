const { Server } = require('socket.io');

const setupSocket = (server) => {
  const io = new Server(server);

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

  return io; // Retorna la instancia de io si necesitas usarla en otros módulos
};

module.exports = { setupSocket };
