const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // or whichever path .env is in

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ChoiceMart:Lekhraj_135@cluster0.rbiphvv.mongodb.net/exam_saas?retryWrites=true&w=majority";

const activityLogSchema = new mongoose.Schema({
  title: String,
  description: String,
  activityType: String,
  module: String,
  performedByRole: String,
  priority: String,
  visibility: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    const logs = [];
    const types = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'EXPORT'];
    const modules = ['Exams', 'Topics', 'Scheduling', 'Shifts', 'Authentication'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];

    for (let i = 0; i < 20; i++) {
      const isToday = i < 10;
      const date = new Date();
      if (!isToday) {
        date.setDate(date.getDate() - Math.floor(Math.random() * 7) - 1);
      }

      logs.push({
        title: `Exam Manager Action ${i + 1}`,
        description: `This is a dynamically generated log for testing purposes. Action ${i + 1} was performed.`,
        activityType: types[Math.floor(Math.random() * types.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        performedByRole: 'EXAM_MANAGER',
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        visibility: 'COMPANY',
        createdAt: date,
        updatedAt: date,
        isDeleted: false,
      });
    }

    console.log("Inserting logs...");
    await ActivityLog.insertMany(logs);
    console.log(`Successfully inserted ${logs.length} activity logs for EXAM_MANAGER.`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding logs:", err);
    process.exit(1);
  }
}

seed();
