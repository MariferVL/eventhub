const Event = require("../models/Event"); // Import Event model
const Reservation = require("../models/Reservation"); // Import Reservation model
const cache = {}; // Cache store

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, date, capacity } = req.body;
    
    // Input validation
    if (!title || !date || !capacity) {
      return res.status(400).json({ message: "All fields are required: title, date, capacity." });
    }

    // Create a new event instance
    const event = new Event({
      title,
      date,
      capacity,
      availableSlots: capacity,
      organizer: req.user.id // Assuming req.user is populated by the authentication middleware
    });
    await event.save();

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating the event:", error);
    res.status(500).json({ message: "An error occurred while creating the event." });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "An error occurred while fetching events." });
  }
};

// Get a specific event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  
  // Check if the event is already in cache
  if (cache[id]) {
    return res.status(200).json(cache[id]);
  }

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Store the event in cache
    cache[id] = event;
    res.json(event);
  } catch (error) {
    console.error("Error fetching the event:", error);
    res.status(500).json({ message: "An error occurred while fetching the event." });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { title, date, capacity } = req.body;
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { title, date, capacity }, { new: true });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating the event:", error);
    res.status(500).json({ message: "An error occurred while updating the event." });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting the event:", error);
    res.status(500).json({ message: "An error occurred while deleting the event." });
  }
};
