import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

import { connectDB } from './backend/src/config/database';
import MeritList from './backend/src/modules/merit-list/meritList.model';
import './backend/src/modules/candidate/candidate.model';
import './backend/src/modules/exam/exam.model';
import './backend/src/modules/result/result.model';

async function main() {
  await connectDB();
  
  const merit = await MeritList.findOne().populate('candidateId examId resultId subjectId');
  if (merit) {
    console.log(JSON.stringify(merit, null, 2));
  } else {
    console.log('No merit list found');
  }
  
  process.exit(0);
}

main().catch(console.error);
