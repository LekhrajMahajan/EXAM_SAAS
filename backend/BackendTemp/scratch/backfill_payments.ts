import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import Exam from "../src/modules/exam/exam.model";
import centerPaymentsService from "../src/modules/center-payments/centerPayments.service";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const allExams = await Exam.find({}).lean() as any[];
  const completedExams = allExams.filter(exam => ["EXAM_ENDED", "COMPLETED", "RESULT_PUBLISHED", "CLOSED"].includes(exam.status));

  console.log(`Found ${completedExams.length} completed exams.`);

  for (const exam of completedExams) {
    console.log(`Generating payments for exam ${exam.examName} (${exam._id})...`);
    try {
      await centerPaymentsService.generatePaymentsForExam(exam._id.toString(), exam.companyId.toString());
      console.log(`Generated payments for exam ${exam.examName}.`);
    } catch (e) {
      console.error(`Error for exam ${exam._id}:`, e);
    }
  }

  console.log("Done.");
  process.exit(0);
}

run();
