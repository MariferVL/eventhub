const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Create a reservation for an event (protected route)
router.post("/", authenticateToken, reservationController.createReservation);

// Get all reservations for the authenticated user
router.get("/", authenticateToken, reservationController.getUserReservations);

module.exports = router;
