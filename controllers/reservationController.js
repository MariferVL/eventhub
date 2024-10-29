const Reservation = require("../models/Reservation");
const Event = require("../models/Event");
const { io } = require("../server"); // Import `io` from server.js

// Create a reservation for an event
exports.createReservation = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check the availability of slots
    if (event.availableSlots <= 0) {
      return res.status(400).json({ message: "No available slots for this event" });
    }

    // Create and save the reservation
    const reservation = new Reservation({
      user: req.user.id, // req.user must be populated by authentication middleware
      event: eventId
    });
    await reservation.save();

    // Update available slots and save the event
    event.availableSlots -= 1;
    await event.save();

    // Emit real-time notification about availability update
    io.emit("availabilityStatus", {
      eventId: event._id,
      availableSlots: event.availableSlots
    });

    // Respond with the confirmation of the created reservation
    res.status(201).json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reservations for a user
exports.getUserReservations = async (req, res) => {
  try {
    // Find and return the current user's reservations
    const reservations = await Reservation.find({ user: req.user.id }).populate('event');
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
