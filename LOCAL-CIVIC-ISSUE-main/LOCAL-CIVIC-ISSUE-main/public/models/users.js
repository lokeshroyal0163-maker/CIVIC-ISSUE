const { MongoClient } = require("mongodb");

let db;

async function initDB(MONGO_URI) {
  const client = await MongoClient.connect(MONGO_URI);
  db = client.db();
  console.log("✅ users.js: Connected to MongoDB");
}

async function createUser({ username, email, password }) {
  return await db.collection("users").insertOne({ username, email, password });
}

async function findUserByUsername(username) {
  return await db.collection("users").findOne({ username });
}

async function findUserByCredentials(username, password) {
  return await db.collection("users").findOne({ username, password });
}

module.exports = {
  initDB,
  createUser,
  findUserByUsername,
  findUserByCredentials
};
