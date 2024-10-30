const mongoose = require("mongoose"); // Import mongoose
const Reservation = require("../models/Reservation"); // Import Reservation model
const Event = require("../models/Event"); // Import Event model
const { notifyAvailability } = require("../sockets/eventSocket");

// Create a reservation for an event
/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a reservation for an event
 *     tags: [Reservations]
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
 *                 description: The ID of the event
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: No available slots for this event or invalid event ID format
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
exports.createReservation = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format." });
    }

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    // Check the availability of slots
    if (event.availableSlots <= 0) {
      return res
        .status(400)
        .json({ message: "No available slots for this event." });
    }

    // Create and save the reservation
    const reservation = new Reservation({
      user: req.user.id, // req.user must be populated by authentication middleware
      event: eventId,
    });
    await reservation.save();

    // Update available slots and save the event
    event.availableSlots -= 1;
    await event.save();

    // Emit real-time notification about availability update
    notifyAvailability({
      eventId: event._id,
      availableSlots: event.availableSlots,
    });

    // Respond with the confirmation of the created reservation
    res
      .status(201)
      .json({ message: "Reservation created successfully.", reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the reservation." });
  }
};

// Get all reservations for a user
/**
 * @swagger
 * /reservations/user:
 *   get:
 *     summary: Get all reservations for a user
 *     tags: [Reservations]
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
exports.getUserReservations = async (req, res) => {
  try {
    // Find and return the current user's reservations
    const reservations = await Reservation.find({ user: req.user.id }).populate(
      "event"
    );
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching your reservations." });
  }
};
