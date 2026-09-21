import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected");

  const appNo = "UPSC-2026-ECANDIDATE-002";
  const examId = "6aabe8da696de247aaf02f70";

  const cands = await mongoose.connection.db.collection("importcandidates").find({ applicationNo: appNo }).toArray();
  const nativeCands = await mongoose.connection.db.collection("candidates").find({ applicationNo: appNo }).toArray();
  
  const allCands = [...cands, ...nativeCands];
  console.log(`Found ${allCands.length} candidates for ${appNo}`);

  for (let cand of allCands) {
    console.log("Candidate:", cand._id, "Exam:", cand.examId);
    
    const checkCandidateId = cand.candidateId ? cand.candidateId : cand._id;
    const existingSubmission = await mongoose.connection.db.collection('candidateexamanswer').findOne({ 
      $or: [
        { candidateId: cand._id, examId: new mongoose.Types.ObjectId(examId) },
        { candidateId: checkCandidateId, examId: new mongoose.Types.ObjectId(examId) },
        { candidateId: cand._id.toString(), examId: examId },
        { applicationNo: cand.applicationNo, examId: new mongoose.Types.ObjectId(examId) },
        { applicationNo: cand.applicationNo, examId: examId }
      ]
    });

    console.log("Existing Submission for this exam:", !!existingSubmission, existingSubmission ? existingSubmission._id : null);
    
    // Also log ANY submission for this candidate just to see
    const anySubmission = await mongoose.connection.db.collection('candidateexamanswer').find({
        $or: [
            { candidateId: cand._id },
            { candidateId: checkCandidateId },
            { candidateId: cand._id.toString() },
            { applicationNo: cand.applicationNo }
        ]
    }).toArray();
    console.log("All submissions for candidate:", anySubmission.length);
  }

  process.exit(0);
}

run().catch(console.error);
