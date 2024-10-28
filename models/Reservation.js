const mongoose = require("mongoose");

// Reservation schema definition
const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User making the reservation
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Event being reserved
  reservedAt: { type: Date, default: Date.now },
});

// Export the Reservation model
module.exports = mongoose.model("Reservation", reservationSchema);
