const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exam_saas').then(async () => {
    try {
        const Result = mongoose.connection.db.collection('results');
        const resObj = await Result.findOne({ _id: new mongoose.Types.ObjectId('6a7e04202428976f8edbca1d') });
        console.log('Result SubmissionId:', resObj.submissionId);
        
        const CEA = mongoose.connection.db.collection('candidateexamanswer');
        
        const query = [];
        if (resObj.submissionId) {
            query.push({ submissionId: String(resObj.submissionId) });
            query.push({ submissionId: resObj.submissionId });
        }
        if (resObj.candidateId) {
            query.push({ candidateId: String(resObj.candidateId) });
            query.push({ candidateId: resObj.candidateId });
        }
        
        let candAns = null;
        const examId = resObj.examId;
        console.log('Querying with examId:', examId);
        candAns = await CEA.findOne({ 
            $or: query,
            examId: { $in: [examId, String(examId)] }
        });
        
        if (!candAns) {
            console.log('Not found with examId, trying without...');
            candAns = await CEA.findOne({ $or: query });
        }
        
        if (candAns) {
            console.log('CandAns FOUND!');
            if (candAns.results) {
                console.log('candAns.results length:', candAns.results.length);
            } else {
                console.log('candAns has NO results array!');
            }
        } else {
            console.log('CandAns NOT FOUND AT ALL using query:', JSON.stringify(query));
        }
        
    } catch(e) { console.log(e); }
    process.exit(0);
});
