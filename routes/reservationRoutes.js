const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController"); // Import reservationController
const { authenticateToken } = require("../middlewares/authMiddleware"); // Import authentication middleware

// Create a reservation for an event (protected route)
/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a reservation for an event
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: No available slots for this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, reservationController.createReservation);

// Get all reservations for the authenticated user
/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations for the authenticated user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateToken, reservationController.getUserReservations);

module.exports = router;
