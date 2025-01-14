require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

let db;

async function connectToMongo() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    db = client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

function getMongoDb() {
  if (!db) {
    throw new Error('Database not connected. Call connectToMongo first.');
  }
  return db;
}

module.exports = { connectToMongo, getMongoDb };