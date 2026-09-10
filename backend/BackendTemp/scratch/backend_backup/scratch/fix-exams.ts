import 'dotenv/config';
import mongoose from 'mongoose';
import Exam from '../src/modules/exam/exam.model';
import Center from '../src/modules/center/center.model';
import Shift from '../src/modules/shift/shift.model';
import Company from '../src/modules/company/company.model';

async function fixExams() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/exam_saas');
  console.log('Connected to DB');
  
  const company = await Company.findOne();
  let center = await Center.findOne();
  if (!center) {
    center = await Center.create({
      companyId: company?._id,
      centerCode: 'CEN-01',
      centerName: 'Main Exam Center',
      capacity: 500,
      contactPerson: 'Admin',
      contactEmail: 'admin@center.com',
      contactPhone: '9876543210'
    });
  }

  let shift = await Shift.findOne();
  if (!shift) {
    shift = await Shift.create({
      companyId: company?._id,
      shiftCode: 'SHIFT-01',
      shiftName: 'Morning Session',
      startTime: '09:00',
      endTime: '12:00',
      status: 'ACTIVE'
    });
  }

  const result = await Exam.updateMany(
    { $or: [{ centerId: { $exists: false } }, { centerId: null }, { shiftId: { $exists: false } }, { shiftId: null }] },
    { $set: { centerId: center._id, shiftId: shift._id } }
  );

  console.log(`Updated ${result.modifiedCount} exams with centerId and shiftId`);
  
  process.exit(0);
}

fixExams().catch(console.error);
