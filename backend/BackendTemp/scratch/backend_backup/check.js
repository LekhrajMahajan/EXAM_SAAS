const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-saas');
    console.log('Connected to DB');
    
    const count = await mongoose.connection.collection('centerpayments').countDocuments();
    console.log('Total center payments in DB:', count);
    
    if (count > 0) {
      const payments = await mongoose.connection.collection('centerpayments').find({}).limit(1).toArray();
      console.log('Sample payment:', JSON.stringify(payments, null, 2));
    }
    
    const exams = await mongoose.connection.collection('exams').find({ status: 'Ended' }).toArray();
    console.log('Completed exams:', exams.length);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
