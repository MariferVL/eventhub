// sockets/eventSocket.js
/// Function to send real-time availability notifications
/**
 * @swagger
 * components:
 *   schemas:
 *     AvailabilityStatus:
 *       type: object
 *       properties:
 *         eventId:
 *           type: string
 *           description: The ID of the event
 *         availableSlots:
 *           type: integer
 *           description: The number of available slots for the event
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Send real-time availability notifications
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailabilityStatus'
 *     responses:
 *       200:
 *         description: Notification sent successfully
 */
function notifyAvailability(status) {
    const io = require('../sockets/socketIo').setupSocket(); // Obtiene la instancia de io desde socketio.js
    io.emit('availabilityStatus', status); // Emit the availability status to all connected clients
}

module.exports = { notifyAvailability };
