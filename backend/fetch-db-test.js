require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const CandidateExamAnswer = mongoose.connection.collection('candidateexamanswers');
        const doc = await CandidateExamAnswer.findOne({ _id: new mongoose.Types.ObjectId("6aa2ad4d579109479f81ad5e") });
        
        if (!doc) {
            console.log("No cand answers found");
            return;
        }

        console.log("DB RESULTS (first 10):");
        console.log(JSON.stringify(doc.results.slice(0, 10), null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}
test();
