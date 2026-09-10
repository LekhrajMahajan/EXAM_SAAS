import mongoose from 'mongoose';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const CenterPaymentsSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  paymentDate: { type: Date },
  referenceId: { type: String },
  remarks: { type: String }
}, { timestamps: true });

const ShiftSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
});

const ExamSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  status: { type: String }
});

const CenterPayments = mongoose.models.CenterPayments || mongoose.model('CenterPayments', CenterPaymentsSchema);
const Shift = mongoose.models.Shift || mongoose.model('Shift', ShiftSchema);
const Exam = mongoose.models.Exam || mongoose.model('Exam', ExamSchema);

async function backfill() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-saas');
    console.log('Connected to DB');

    const endedExams = await Exam.find({ status: 'Ended' }).lean();
    console.log(`Found ${endedExams.length} ended exams`);

    let totalInserted = 0;

    for (const exam of endedExams) {
      if (!exam.companyId) continue;
      const shifts = await Shift.find({ examId: exam._id }).lean();
      for (const shift of shifts) {
        if (!shift.centerId) continue;
        
        const existing = await CenterPayments.findOne({
          examId: exam._id,
          shiftId: shift._id,
          centerId: shift.centerId
        });

        if (!existing) {
          await CenterPayments.create({
            companyId: exam.companyId,
            centerId: shift.centerId,
            examId: exam._id,
            shiftId: shift._id,
            amount: 2500,
            status: 'Pending'
          });
          totalInserted++;
        }
      }
    }
    
    console.log(`Backfill complete. Inserted ${totalInserted} new payments.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

backfill();
