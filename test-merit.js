const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

require('./backend/src/modules/candidate/candidate.model');
require('./backend/src/modules/exam/exam.model');
require('./backend/src/modules/result/result.model');
const MeritList = require('./backend/src/modules/merit-list/meritList.model').default;

async function main() {
  await connectDB();
  
  const merit = await MeritList.findOne().populate('candidateId examId resultId');
  if (merit) {
    console.log(JSON.stringify(merit, null, 2));
  } else {
    console.log('No merit list found');
  }
  
  process.exit(0);
}

main().catch(console.error);
