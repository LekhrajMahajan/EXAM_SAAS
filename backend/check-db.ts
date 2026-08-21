import mongoose from "mongoose";
import { env } from "./src/config/env";
import Employee from "./src/modules/employee/employee.model";
import Manager from "./src/modules/manager/manager.model";
import authService from "./src/modules/auth/auth.service";

async function test() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected");

  const email = "parmarvaibhav2703@gmail.com";
  
  const managers = await Manager.find({ email }).select("+password");
  console.log("Managers with this email:", managers.length);
  for (const m of managers) {
    console.log("Manager ID:", m._id, "Status:", m.status);
    const emp = await Employee.findOne({ userId: m._id });
    if (emp) {
      console.log("  -> Linked Employee:", emp._id, "isDeleted:", emp.isDeleted);
    } else {
      console.log("  -> NO LINKED EMPLOYEE FOUND");
    }
  }

  process.exit(0);
}

test().catch(console.error);
