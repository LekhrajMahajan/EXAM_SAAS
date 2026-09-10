import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const Employee = mongoose.connection.collection('employees');
  const User = mongoose.connection.collection('users');

  const numEmployees = await Employee.countDocuments({ isDeleted: false });
  const numUsers = await User.countDocuments({ isDeleted: false });

  console.log('Employees (isDeleted: false):', numEmployees);
  console.log('Users (isDeleted: false):', numUsers);

  const employeesList = await Employee.find({ isDeleted: false }).limit(2).toArray();
  console.log('Sample Employees:', employeesList);

  mongoose.disconnect();
}

run();
