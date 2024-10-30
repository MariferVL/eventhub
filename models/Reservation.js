const mongoose = require("mongoose"); // Import mongoose

// Reservation schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - event
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the reservation
 *         user:
 *           type: string
 *           description: The ID of the user making the reservation
 *         event:
 *           type: string
 *           description: The ID of the event being reserved
 *         reservedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the reservation was made
 *       example:
 *         id: d5fE_asz
 *         user: 60c72b2f9b1d8b8b9c8d7d9e
 *         event: 60c72b2f9b1d8b8b9c8d7d9e
 *         reservedAt: 2023-01-01T00:00:00.000Z
 */
const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User making the reservation
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Event being reserved
  reservedAt: { type: Date, default: Date.now }, // Date and time the reservation was made
});

// Export the Reservation model
module.exports = mongoose.model("Reservation", reservationSchema);
