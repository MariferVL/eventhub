const cache = {}; // In-memory cache store

// Middleware to handle caching
/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Get event details (with caching)
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     responses:
 *       200:
 *         description: Event details retrieved from cache if available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found in cache
 */
const cacheMiddleware = async (req, res, next) => {
    const { eventId } = req.params; // Assuming you're using an event ID in the URL
    
    if (cache[eventId]) {
        return res.status(200).json(cache[eventId]); // Return cached data if available
    }
    
    next(); // Proceed if no cache
};

module.exports = cacheMiddleware;
