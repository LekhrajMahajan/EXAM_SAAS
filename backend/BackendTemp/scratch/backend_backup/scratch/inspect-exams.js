const mongoose = require('mongoose');
require('dotenv').config();

async function inspect() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/exam_saas');
  const Exam = mongoose.model('Exam', new mongoose.Schema({}, { strict: false }));
  const exams = await Exam.find().lean();
  console.log(JSON.stringify(exams, null, 2));
  mongoose.disconnect();
}

inspect();
