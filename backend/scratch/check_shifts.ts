import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Shift from '../src/modules/shift/shift.model';
import Exam from '../src/modules/exam/exam.model';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  
  const shifts = await Shift.find({});
  console.log(`Total shifts in DB: ${shifts.length}`);
  if (shifts.length > 0) {
    console.log('First shift:', shifts[0]);
  }
  
  const exams = await Exam.find({});
  console.log(`Total exams in DB: ${exams.length}`);
  
  process.exit(0);
}

run();
