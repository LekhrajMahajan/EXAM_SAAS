const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exam_saas').then(async () => {
    try {
        const Result = mongoose.connection.db.collection('results');
        const resObj = await Result.findOne({ _id: new mongoose.Types.ObjectId('6a7e04202428976f8edbca1d') });
        
        const CEA = mongoose.connection.db.collection('candidateexamanswer');
        const candAns = await CEA.findOne({ submissionId: resObj.submissionId });
        
        const resultsData = candAns.results;
        
        const PaperQuestion = mongoose.connection.db.collection('paperquestions');
        const Question = mongoose.connection.db.collection('questions');
        
        const paperQuestionsForDetails = await PaperQuestion.find({ paperId: resObj.paperId }).toArray();
        const pqIdToMasterQForDetails = new Map();
        for (const pq of paperQuestionsForDetails) {
            if (pq.questionId) {
                pqIdToMasterQForDetails.set(String(pq._id), { _id: String(pq.questionId) });
            }
        }
        
        const masterIds = resultsData.map((res) => {
            const pqMaster = pqIdToMasterQForDetails.get(String(res.questionId));
            return pqMaster ? String(pqMaster._id) : String(res.questionId);
        }).filter(Boolean);
        
        const questionsForPath2 = await Question.find({ _id: { $in: masterIds.map(id => new mongoose.Types.ObjectId(id)) } }).toArray();
        
        const questionDocMap2 = new Map();
        for (const q of questionsForPath2) questionDocMap2.set(String(q._id), q);
        
        const questionsDetails = resultsData.map((res) => {
            const pqMaster = pqIdToMasterQForDetails.get(String(res.questionId));
            const masterId = pqMaster ? String(pqMaster._id) : String(res.questionId);
            const question = questionDocMap2.get(masterId);
            
            return {
                questionId: res.questionId,
                questionText: res.questionText || question?.question || 'Unknown Question',
                isAnswered: true
            };
        });
        
        console.log('questionsDetails length:', questionsDetails.length);
        console.log('first question:', questionsDetails[0]);
        console.log('empty text count:', questionsDetails.filter(q => q.questionText === 'Unknown Question' || !q.questionText).length);
        
    } catch(e) { console.log(e); }
    process.exit(0);
});
