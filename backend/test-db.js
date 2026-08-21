const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  
  const Employee = mongoose.connection.collection("generaterolecredentials");
  const Manager = mongoose.connection.collection("managers");
  
  const email = "parmarvaibhav2703@gmail.com".toLowerCase();
  
  const managers = await Manager.find({ email }).toArray();
  console.log("Found managers:", managers.length);
  
  for (const m of managers) {
    console.log("Manager:", m._id, m.email, m.status, m.role);
    const emp = await Employee.findOne({ userId: m._id });
    if (emp) {
      console.log(" -> Employee:", emp._id, "isDeleted:", emp.isDeleted);
    } else {
      console.log(" -> No linked employee found for Manager", m._id);
      // Wait! Check if it's stored as string!
      const empStr = await Employee.findOne({ userId: m._id.toString() });
      if (empStr) {
         console.log(" -> Employee found with STRING ID:", empStr._id, "isDeleted:", empStr.isDeleted);
      }
    }
  }
  process.exit(0);
}
test().catch(console.error);
