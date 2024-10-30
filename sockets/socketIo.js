const { Server } = require('socket.io');
const http = require('http'); // Asegúrate de que esto sea correcto según tu implementación

const socketServer = http.createServer(); // Crea el servidor HTTP si aún no lo has hecho
const io = new Server(socketServer);

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

// Exporta el objeto io para ser utilizado en otros módulos
module.exports = { io, socketServer };
