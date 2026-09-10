import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-saas');
  
  const CenterPayments = mongoose.connection.collection('centerpayments');
  const count = await CenterPayments.countDocuments();
  console.log('Total center payments in DB:', count);
  
  const payments = await CenterPayments.find({}).toArray();
  console.log('Payments:', JSON.stringify(payments, null, 2));

  const Exams = mongoose.connection.collection('exams');
  const exams = await Exams.find({ status: 'Ended' }).toArray();
  console.log('Completed exams:', exams.length);

  process.exit(0);
}
check();
