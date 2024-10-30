// Load environment variables from .env file
require('dotenv').config();

const { MongoClient } = require('mongodb'); // Import MongoClient
const uri = process.env.MONGO_URI; // Get MongoDB URI from environment variables

// Define an asynchronous function to test MongoDB connection
async function run() {
    const client = new MongoClient(uri); // Create a new MongoClient instance

    try {
        await client.connect(); // Connect to MongoDB
        console.log("Connected to MongoDB successfully!");

        const databasesList = await client.db().admin().listDatabases(); // List all databases
        console.log("Databases:");
        databasesList.databases.forEach(db => {
            console.log(` - ${db.name}`); // Print each database name
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error); // Log any connection errors
    } finally {
        await client.close(); // Close the connection
    }
}

// Execute the run function and catch any unhandled errors
run().catch(console.dir);
