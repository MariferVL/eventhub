const Reservation = require("../models/Reservation");
const Event = require("../models/Event");

// Create a reservation for an event
exports.createReservation = async (req, res) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });
  
  if (event.availableSlots <= 0) {
    return res.status(400).json({ message: "No available slots for this event" });
  }

  const reservation = new Reservation({
    user: req.user.id, // Assuming req.user is populated by the auth middleware
    event: eventId
  });

  await reservation.save();
  
  // Update available slots
  event.availableSlots -= 1;
  await event.save();

  res.status(201).json({ message: "Reservation created successfully", reservation });
};

// Get all reservations for a user
exports.getUserReservations = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user.id }).populate('event');
  res.json(reservations);
};
