import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const ExamSchema = new mongoose.Schema({}, { strict: false });
const Exam = mongoose.model('Exam', ExamSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const exams = await Exam.find().sort({ createdAt: -1 }).limit(1);
  if (exams.length > 0) {
    console.log(JSON.stringify(exams[0].get('subjects'), null, 2));
  } else {
    console.log("No exams found");
  }
  process.exit(0);
}
check();
