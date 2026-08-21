const mongoose = require('mongoose');
const env = require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/practice-exam-saas');
    console.log("Connected to MongoDB.");
    const db = mongoose.connection.db;
    
    // Check indexes on managers collection
    const collection = db.collection('managers');
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes.map(i => i.name));
    
    // The index name for email is typically email_1
    try {
      await collection.dropIndex('email_1');
      console.log("Dropped email_1 index on managers collection.");
    } catch (e) {
      console.log("email_1 index not found or already dropped.", e.message);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
