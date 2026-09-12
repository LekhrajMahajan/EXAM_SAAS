const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
async function test() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/exam-saas");
  const Employee = mongoose.model("Employee", new mongoose.Schema({}, { collection: "generaterolecredentials", strict: false }));
  const StaffAssignment = mongoose.model("StaffAssignment", new mongoose.Schema({}, { collection: "staffassignments", strict: false }));
  
  const employees = await Employee.find({ role: "PAPER_SETTER" });
  console.log("Paper Setters:", employees.map(e => ({ id: e._id, name: e.firstName, companyId: e.companyId })));
  
  const assignments = await StaffAssignment.find({ role: "PAPER_SETTER" });
  console.log("Assignments:", assignments.map(a => ({ id: a._id, employeeId: a.employeeId, examId: a.examId, companyId: a.companyId, status: a.status })));
  
  mongoose.disconnect();
}
test().catch(console.error);
