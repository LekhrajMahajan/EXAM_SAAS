import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Admin from "../modules/admin/admin.model";
import Manager from "../modules/manager/manager.model";
import Candidate from "../modules/candidate/candidate.model";
import { UserRole } from "../constants/roles";

async function migrate() {
  console.log("Connecting to Database...");
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected.");

  console.log("1. Migrating Users -> Admins");
  // Use raw collection access in case models are deleted
  const usersCollection = mongoose.connection.collection("users");
  const users = await usersCollection.find({}).toArray();

  for (const user of users) {
    if (["MASTER_ADMIN", "COMPANY_ADMIN", "ADMIN"].includes(user.role)) {
      // Migrate to Admins
      const existing = await Admin.findById(user._id);
      if (!existing) {
        await Admin.create({
          ...user,
          _id: user._id, // Preserve ObjectId
        });
        console.log(`Migrated Admin: ${user.email}`);
      }
    } else if (user.role === "CANDIDATE") {
      // Update existing candidate or create if auth-only candidate
      const existingCandidate = await Candidate.findOne({ email: user.email });
      if (existingCandidate) {
        existingCandidate.password = user.password;
        existingCandidate.loginHistory = user.loginHistory;
        existingCandidate.sessions = user.sessions;
        existingCandidate.devices = user.devices;
        existingCandidate.lastLogin = user.lastLogin;
        await existingCandidate.save();
        console.log(`Updated Candidate Auth: ${user.email}`);
      } else {
        console.log(`Warning: Found User Candidate but no matching Candidate record for ${user.email}`);
      }
    }
  }

  console.log("2. Migrating Employees -> Managers");
  const employeesCollection = mongoose.connection.collection("employees");
  const employees = await employeesCollection.find({}).toArray();

  for (const emp of employees) {
    // Check if the employee had a linked user
    const linkedUser = users.find(u => u._id.toString() === emp.userId?.toString());
    
    const existingManager = await Manager.findById(emp._id);
    if (!existingManager) {
      await Manager.create({
        ...emp,
        _id: emp._id, // Preserve ObjectId
        managerCode: emp.employeeCode,
        password: linkedUser?.password || "$2a$10$dummyHashRequiredBySchema",
        devices: linkedUser?.devices || [],
        sessions: linkedUser?.sessions || [],
        loginHistory: linkedUser?.loginHistory || [],
        lastLogin: linkedUser?.lastLogin,
        role: emp.role || "MANAGER",
        isEmailVerified: linkedUser?.isEmailVerified || false,
        isPhoneVerified: linkedUser?.isPhoneVerified || false,
      });
      console.log(`Migrated Manager: ${emp.email}`);
    }
  }

  console.log("Migration Complete! You can now safely drop 'users' and 'employees' collections.");
  process.exit(0);
}

migrate().catch(console.error);
