import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Center = mongoose.model('Center', new mongoose.Schema({}, { strict: false }));
  const StaffAssignment = mongoose.model('StaffAssignment', new mongoose.Schema({}, { strict: false }));
  const ExamCenter = mongoose.model('ExamCenter', new mongoose.Schema({}, { strict: false }));
  const TrustScore = mongoose.model('TrustScore', new mongoose.Schema({}, { strict: false }));
  const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
  
  const centers = await Center.find().limit(2);
  console.log('Centers:', centers);
  
  if (centers.length > 0) {
    const cId = centers[0]._id;
    const staff = await StaffAssignment.find({ centerId: cId });
    console.log(`Staff Assignments for center ${cId}:`, staff.length);
    
    const exams = await ExamCenter.find({ centerId: cId });
    console.log(`ExamCenters for center ${cId}:`, exams.length);

    const scores = await TrustScore.find({ entityId: cId });
    console.log(`TrustScores for center ${cId}:`, scores.length, scores);

    const employeeCount = await Employee.countDocuments({ currentCenterId: cId }); // wait, does employee have currentCenterId?
    console.log(`Employees for center ${cId} (via currentCenterId):`, employeeCount);
  }
  
  mongoose.disconnect();
}
check().catch(console.error);
