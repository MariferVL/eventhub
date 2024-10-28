const mongoose = require("mongoose");

// Event schema definition
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  availableSlots: { type: Number, required: true, min: 0 }, // Slots available for reservations
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the organizer
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Export the Event model
module.exports = mongoose.model("Event", eventSchema);
