import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  const db = mongoose.connection.db;
  const cands = await db?.collection('importcandidates').find({ applicationNo: 'UPSC-2026-ECANDIDATE-002' }).toArray();
  console.log('CANDIDATES:', JSON.stringify(cands?.map(c => ({ _id: c._id, examId: c.examId, isLoginEnabled: c.isLoginEnabled })), null, 2));

  const candIds = cands?.map(c => c._id) || [];
  const submissions = await db?.collection('candidateexamanswer').find({ candidateId: { $in: candIds } }).toArray();
  console.log('SUBMISSIONS BY CANDIDATE ID:', JSON.stringify(submissions?.map(s => ({ _id: s._id, candidateId: s.candidateId, examId: s.examId })), null, 2));

  const appSubmissions = await db?.collection('candidateexamanswer').find({ applicationNo: 'UPSC-2026-ECANDIDATE-002' }).toArray();
  console.log('SUBMISSIONS BY APP NO:', JSON.stringify(appSubmissions?.map(s => ({ _id: s._id, candidateId: s.candidateId, examId: s.examId })), null, 2));

  process.exit(0);
});
