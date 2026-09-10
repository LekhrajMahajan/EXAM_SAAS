const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  const center = await db.collection('centers').findOne({});
  console.log("=== CENTER ===");
  console.log(center);
  
  const user = await db.collection('users').findOne({ role: 'COMPANY_ADMIN' });
  console.log("=== USER ===");
  console.log(user);

  process.exit(0);
}

run().catch(console.dir);
