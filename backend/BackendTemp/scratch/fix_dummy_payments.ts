import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import CenterPayments from '../src/modules/center-payments/centerPayments.model';
import Shift from '../src/modules/shift/shift.model';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  
  // Find payments where shiftId is null or missing
  const payments = await CenterPayments.find({ 
    $or: [
      { shiftId: { $exists: false } },
      { shiftId: null }
    ]
  });
  
  console.log(`Found ${payments.length} payments missing shiftId`);
  
  for (let p of payments) {
    const shift = await Shift.findOne({ examId: p.examId });
    if (shift) {
      p.shiftId = shift._id;
      await p.save();
      console.log('Fixed payment ' + p._id + ' with shift ' + shift.shiftName);
    } else {
      console.log('No shift found for exam ' + p.examId);
    }
  }
  
  console.log('Done');
  process.exit(0);
}

run();
