import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-saas';

// Migration script for standardizing Exam statuses
async function migrateExamStatuses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('Database connection not established.');
    }
    const examCollection = db.collection('exams');

    const updateDrafts = await examCollection.updateMany(
      { status: 'DRAFT' },
      { $set: { status: 'PENDING_EXAM' } }
    );
    console.log(`Updated ${updateDrafts.modifiedCount} DRAFT exams to PENDING_EXAM`);

    const updateCompleted = await examCollection.updateMany(
      { status: { $in: ['EXAM_ENDED', 'COMPLETED'] } },
      { $set: { status: 'PENDING_RESULT_GENERATE' } }
    );
    console.log(`Updated ${updateCompleted.modifiedCount} EXAM_ENDED/COMPLETED exams to PENDING_RESULT_GENERATE`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updateFutureActive = await examCollection.updateMany(
      { 
        status: 'ACTIVE', 
        examDate: { $gt: today } 
      },
      { $set: { status: 'PENDING_EXAM' } }
    );
    console.log(`Updated ${updateFutureActive.modifiedCount} future ACTIVE exams to PENDING_EXAM`);

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateExamStatuses();
