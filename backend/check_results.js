const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exam_saas_db').then(async () => {
    try {
        const resultsColl = mongoose.connection.collection('results');
        const results = await resultsColl.find({}, {projection: {examId: 1, candidateId: 1, marksObtained: 1}}).toArray();
        console.log('Results:');
        console.log(JSON.stringify(results, null, 2));
        
        const examsColl = mongoose.connection.collection('exams');
        const exams = await examsColl.find({_id: {$in: results.map(r => new mongoose.Types.ObjectId(r.examId))}}, {projection: {examTitle: 1, _id: 1}}).toArray();
        console.log('Exams:');
        console.log(JSON.stringify(exams, null, 2));

        const subColl = mongoose.connection.collection('examsubmissions');
        const submissions = await subColl.find({}, {projection: {examId: 1, candidateId: 1, submissionStatus: 1}}).toArray();
        console.log('Submissions:');
        console.log(JSON.stringify(submissions, null, 2));

        const candAns = mongoose.connection.collection('candidateanswers');
        const candAnsDocs = await candAns.find({}, {projection: {examId: 1, candidateId: 1}}).limit(10).toArray();
        console.log('Candidate Answers (Sample):');
        console.log(JSON.stringify(candAnsDocs, null, 2));
    } catch(e) {
        console.error(e);
    }
    process.exit(0);
});
