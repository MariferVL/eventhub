const cache = {};

const cacheMiddleware = async (req, res, next) => {
    const { eventId } = req.params; // Asumiendo que estás usando un ID de evento en la URL

    if (cache[eventId]) {
        return res.status(200).json(cache[eventId]); // Devuelve el dato del caché
    }
    
    next(); // Continúa si no hay caché
};

module.exports = cacheMiddleware;
