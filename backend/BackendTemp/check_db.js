const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/practice_exam_saas').then(async () => {
    const Result = mongoose.connection.collection('results');
    const ImportCandidate = mongoose.connection.collection('importcandidate');
    const res = await Result.findOne({ _id: new mongoose.Types.ObjectId('6a87529bb69c7d172c1268b4') });
    console.log('result candidateId:', res.candidateId);
    if(res && res.candidateId) {
        const cand = await ImportCandidate.findOne({ _id: res.candidateId });
        console.log('ImportCandidate:', cand);
        console.log('ImportCandidate photo:', cand ? cand.candidatePhoto : null);
    }
    process.exit(0);
});
