import mongoose from "mongoose";
import { env } from "./src/config/env";
import employeeService from "./src/modules/employee/employee.service";
import authService from "./src/modules/auth/auth.service";
import Manager from "./src/modules/manager/manager.model";

async function test() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected");

  const companyId = new mongoose.Types.ObjectId().toString();
  const email = `test.bug.${Date.now()}@test.com`;

  // 1. Create first employee
  console.log("Creating Emp1...");
  const emp1 = await employeeService.create({
    companyId,
    firstName: "Test1",
    lastName: "User",
    email,
    phone: "1234567890",
    role: "PRIVATE_AUTHORITY",
    password: "Password1!"
  });
  console.log("Emp1 created:", emp1._id);

  // 2. Delete it
  console.log("Deleting Emp1...");
  await employeeService.delete(emp1._id.toString());
  console.log("Emp1 deleted.");

  // Check if Manager is deleted
  const m1 = await Manager.findOne({ email });
  console.log("Manager after delete:", m1 ? "STILL EXISTS!" : "Deleted properly.");

  // 3. Create second employee with SAME email
  console.log("Creating Emp2...");
  const emp2 = await employeeService.create({
    companyId,
    firstName: "Test2",
    lastName: "User",
    email,
    phone: "1234567890",
    role: "PRIVATE_AUTHORITY",
    password: "Password2!"
  });
  console.log("Emp2 created:", emp2._id);

  // 4. Try logging in with BOTH passwords
  try {
    await authService.login(email, "Password1!");
    console.log("LOGIN 1 (Old Password) SUCCEEDED! BUG EXISTS!");
  } catch(e: any) {
    console.log("LOGIN 1 (Old Password) failed as expected:", e.message);
  }

  try {
    await authService.login(email, "Password2!");
    console.log("LOGIN 2 (New Password) SUCCEEDED! Normal behavior.");
  } catch(e: any) {
    console.log("LOGIN 2 (New Password) failed:", e.message);
  }

  process.exit(0);
}
test().catch(console.error);
