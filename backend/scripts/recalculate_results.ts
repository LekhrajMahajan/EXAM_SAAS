import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";

// Load environment variables
config({ path: "d:/COMPANY PORJTECS/Exam management folder/Final Exam SaaS Product/backend/.env" });

import { resultService } from "../src/modules/result/result.service";

async function recalculateResults() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // We can either find a specific exam or process all
    const Exam = mongoose.model("Exam", new mongoose.Schema({}, { strict: false }));
    const rbiExam = await Exam.findOne({ examTitle: { $regex: /Reserve Bank/i } }).lean();
    
    let filter = {};
    if (rbiExam) {
      console.log(`Found RBI Exam: ${rbiExam._id}`);
      filter = { examId: rbiExam._id };
    } else {
      console.log("RBI exam not found, processing ALL results...");
    }

    const Result = mongoose.model("Result", new mongoose.Schema({}, { strict: false }));
    const resultsToRecalculate = await Result.find(filter).lean();
    
    console.log(`Found ${resultsToRecalculate.length} results to recalculate.`);

    let successCount = 0;
    let failCount = 0;

    for (const result of resultsToRecalculate) {
      try {
        console.log(`Re-evaluating result ID: ${result._id}`);
        await resultService.reEvaluate(String(result._id));
        successCount++;
      } catch (err: any) {
        console.error(`Failed to re-evaluate ${result._id}: ${err.message}`);
        failCount++;
      }
    }

    console.log("Recalculation Complete.");
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Migration script failed:", error);
    process.exit(1);
  }
}

recalculateResults();
