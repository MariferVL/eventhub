const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const { setupSocket } = require("./sockets/socketIo"); // Importar la configuración de Socket.io

dotenv.config(); // Cargar las variables de entorno

// Crear una aplicación Express
const app = express();
const server = http.createServer(app); // Crear el servidor HTTP

// Configurar puerto desde las variables de entorno o por defecto 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parsear cuerpos JSON
app.use(cookieParser()); // Parsear cookies

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Rutas
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/events", eventRoutes); // Rutas de eventos
app.use("/api/users", userRoutes); // Rutas de usuarios
app.use("/api/reservations", reservationRoutes); // Rutas de reservas

// Ruta por defecto
app.get("/", (req, res) => {
  res.send("Welcome to the Event Reservation API");
});

// Inicializar Socket.io
const io = setupSocket(server); // Pasa el servidor al configurador de Socket.io

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error" });
});

// Servir archivos estáticos
app.use(express.static("public"));

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
