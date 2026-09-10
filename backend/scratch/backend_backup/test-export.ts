import mongoose from "mongoose";

const run = async () => {
    await mongoose.connect('mongodb://localhost:27017/exam_saas');
    const Result = mongoose.connection.collection('results');
    const CandidateExamAnswer = mongoose.connection.collection('candidateexamanswer');

    const results = await Result.find({}).toArray();
    console.log(`Found ${results.length} results`);

    for (const r of results) {
        console.log(`Result _id: ${r._id}, submissionId: ${r.submissionId}`);
        const subId = r.submissionId;
        if (subId) {
            const candAns = await CandidateExamAnswer.findOne({ 
                $or: [{ _id: subId }, { submissionId: subId }, { _id: String(subId) }, { submissionId: String(subId) }]
            });
            console.log(`Found candAns using subId: ${!!candAns}`);
            if (candAns) {
                console.log(`candAns has results: ${!!candAns.results}`);
            }
        }
    }
    process.exit(0);
};

run().catch(console.error);
