const mongoose = require("mongoose"); // Import mongoose

// Event schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - capacity
 *         - availableSlots
 *         - organizer
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the event
 *         title:
 *           type: string
 *           description: The title of the event
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         capacity:
 *           type: integer
 *           description: The capacity of the event
 *         availableSlots:
 *           type: integer
 *           description: The available slots for the event
 *         organizer:
 *           type: string
 *           description: The ID of the user organizing the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was last updated
 *       example:
 *         id: d5fE_asz
 *         title: Tech Conference
 *         date: 2023-10-20
 *         capacity: 200
 *         availableSlots: 150
 *         organizer: 60c72b2f9b1d8b8b9c8d7d9e
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Event title
  date: { type: Date, required: true }, // Event date
  capacity: { type: Number, required: true }, // Total capacity of the event
  availableSlots: { type: Number, required: true, min: 0 }, // Slots available for reservations
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the organizer (User model)
  createdAt: { type: Date, default: Date.now }, // Date when the event was created
  updatedAt: { type: Date, default: Date.now } // Date when the event was last updated
});

// Export the Event model
module.exports = mongoose.model("Event", eventSchema);
