const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const appNo = 'UPSC-2026-ECANDIDATE-002';
  const cands = await db.collection('importcandidates').find({ applicationNo: appNo }).toArray();
  console.log('Candidates for', appNo);
  for (let c of cands) {
    console.log(`- _id: ${c._id}, examId: ${c.examId}, isLoginEnabled: ${c.isLoginEnabled}`);
    const subs = await db.collection('candidateexamanswer').find({ candidateId: c._id }).toArray();
    console.log(`  Submissions: ${subs.length}`);
    for (let s of subs) {
      console.log(`    - subId: ${s._id}, examId: ${s.examId}`);
    }
  }

  process.exit(0);
}
main().catch(console.error);
