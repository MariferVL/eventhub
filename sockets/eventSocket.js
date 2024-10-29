const { io } = require('./server');

// Function to send real-time availability notifications
function notifyAvailability(status) {
    io.emit('availabilityStatus', status);
}

module.exports = { notifyAvailability };
