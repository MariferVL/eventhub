const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");

// Create a new event (protected route for organizers)
router.post("/", authenticateToken, authorizeRole(["organizer"]), eventController.createEvent);

// Get all events
router.get("/", eventController.getEvents);

// Get event by ID
router.get("/:id", eventController.getEventById);

// Update an event (protected route for organizers)
router.put("/:id", authenticateToken, authorizeRole(["organizer"]), eventController.updateEvent);

// Delete an event (protected route for organizers)
router.delete("/:id", authenticateToken, authorizeRole(["organizer"]), eventController.deleteEvent);

module.exports = router;
