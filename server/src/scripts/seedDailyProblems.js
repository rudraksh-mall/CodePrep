const mongoose = require("mongoose");
const connectDB = require("../config/db");
const env = require("../config/env");
const { syncAllProblemsToPinecone } = require("../services/pineconeSync.service");

async function seed() {
  await connectDB(env.mongodbUri);
  const count = await syncAllProblemsToPinecone();
  console.log(`Synced ${count} problems from database to Pinecone namespace "daily-problems".`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
