require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; 

async function run() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully!");

        const databasesList = await client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach(db => {
            console.log(` - ${db.name}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
