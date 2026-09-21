const mongoose = require("mongoose");
require("dotenv").config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");

  const appNo = "UPSC-2026-ECANDIDATE-002";

  const cands = await mongoose.connection.db.collection("importcandidates").find({ applicationNo: appNo }).toArray();
  const nativeCands = await mongoose.connection.db.collection("candidates").find({ applicationNo: appNo }).toArray();
  
  const allCands = [...cands, ...nativeCands];
  console.log(`Found ${allCands.length} candidates for ${appNo}`);

  for (let cand of allCands) {
    console.log("Candidate ID:", cand._id, "Exam ID:", cand.examId, "CandidateId Field:", cand.candidateId);
  }

  process.exit(0);
}

run().catch(console.error);
