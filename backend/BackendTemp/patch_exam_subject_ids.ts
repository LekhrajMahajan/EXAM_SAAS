import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const ExamSchema = new mongoose.Schema({}, { strict: false });
const SubjectSchema = new mongoose.Schema({}, { strict: false });

const Exam = mongoose.model('Exam', ExamSchema);
const Subject = mongoose.model('Subject', SubjectSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const exams = await Exam.find({});
    let updatedCount = 0;

    for (const exam of exams) {
      let needsUpdate = false;
      const subjects = exam.get('subjects') || [];

      for (const subj of subjects) {
        if (!subj.subjectId && subj.name) {
          // Find matching subject by name
          const matchedSubject = await Subject.findOne({ 
             $or: [ { name: subj.name }, { subjectName: subj.name } ],
             companyId: exam.get('companyId')
          });
          
          if (matchedSubject) {
            subj.subjectId = matchedSubject._id;
            needsUpdate = true;
          } else {
            console.warn(`Could not find a subjectId for subject name: ${subj.name} in exam: ${exam.get('examTitle')}`);
          }
        }
      }

      if (needsUpdate) {
        await Exam.updateOne({ _id: exam._id }, { $set: { subjects } });
        updatedCount++;
        console.log(`Updated exam: ${exam.get('examTitle')}`);
      }
    }

    console.log(`Finished patching. Total exams updated: ${updatedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
