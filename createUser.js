// Load environment variables from .env file
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: String,
    created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Create a new user document
const newUser = new User({
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
});

newUser.save()
    .then(() => {
        console.log('User created successfully!');
        mongoose.connection.close(); // Close the connection
    })
    .catch(err => {
        console.error('Error creating user:', err);
    });
