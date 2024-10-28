const Event = require("../models/Event");
const Reservation = require("../models/Reservation");

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, date, capacity } = req.body;

  const event = new Event({
    title,
    date,
    capacity,
    availableSlots: capacity,
    organizer: req.user.id // Assuming req.user is populated by the auth middleware
  });

  await event.save();
  res.status(201).json({ message: "Event created successfully", event });
};

// Get all events
exports.getEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};

// Get a specific event by ID
exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { title, date, capacity } = req.body;
  const event = await Event.findByIdAndUpdate(req.params.id, { title, date, capacity }, { new: true });
  
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event updated successfully", event });
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted successfully" });
};
