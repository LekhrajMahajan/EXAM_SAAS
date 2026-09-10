require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const results = await mongoose.connection.collection('results').find({}, {projection: {examId: 1, candidateId: 1, resultStatus: 1, createdAt: 1}}).toArray();
        console.log('Results Count:', results.length);
        
        // Let's count by examId
        const counts = {};
        for (const r of results) {
            const eid = String(r.examId);
            counts[eid] = (counts[eid] || 0) + 1;
        }
        console.log('Counts by ExamId:', counts);
        
        // Find exams
        const exams = await mongoose.connection.collection('exams').find({_id: {$in: Object.keys(counts).map(id => new mongoose.Types.ObjectId(id))}}, {projection: {examTitle: 1, _id: 1}}).toArray();
        console.log('Exams:');
        console.log(JSON.stringify(exams, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
