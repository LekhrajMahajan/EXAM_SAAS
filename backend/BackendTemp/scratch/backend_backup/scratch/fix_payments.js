const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const CenterPayments = mongoose.connection.collection('centerpayments');
    await CenterPayments.deleteMany({});
    console.log('Cleared old dummy payments');

    const Exams = mongoose.connection.collection('exams');
    const Shifts = mongoose.connection.collection('shifts');
    const Centers = mongoose.connection.collection('centers');

    const endedExams = await Exams.find({ status: 'Ended' }).toArray();
    console.log(`Found ${endedExams.length} ended exams`);

    let count = 0;
    const centersList = await Centers.find({}).toArray();
    const fallbackCenter = centersList[0];

    for (const exam of endedExams) {
      if (!exam.companyId) continue;
      
      const shifts = await Shifts.find({ examId: exam._id }).toArray();
      
      if (shifts.length > 0) {
        for (const shift of shifts) {
          const centerId = shift.centerId || shift.centers?.[0]?.center || fallbackCenter?._id;
          if (!centerId) continue;

          await CenterPayments.insertOne({
            companyId: exam.companyId,
            centerId: centerId,
            examId: exam._id,
            shiftId: shift._id,
            amount: 2500,
            status: 'Pending',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          count++;
        }
      } else {
        // No shifts? Let's just create a dynamic payment for it using the fallback center so it shows up.
        if (fallbackCenter) {
           await CenterPayments.insertOne({
            companyId: exam.companyId,
            centerId: fallbackCenter._id,
            examId: exam._id,
            amount: 2500,
            status: 'Pending',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          count++;
        }
      }
    }
    console.log(`Successfully generated ${count} real payments dynamically!`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fix();
