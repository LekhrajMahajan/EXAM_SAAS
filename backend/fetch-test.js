require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
    try {
        console.log("Connecting to", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");
        
        const submissionId = "6aa2ad4d579109479f81ad5e";
        const examId = "6a83092aaf7fd1ce4d1f94e5";

        const candAns = await mongoose.connection.collection('candidateexamanswer').findOne({ _id: new mongoose.Types.ObjectId(submissionId) });
        console.log("candAns found:", !!candAns);

        const resultDoc = await mongoose.connection.collection('results').findOne({ 
            submissionId: new mongoose.Types.ObjectId(submissionId),
            examId: new mongoose.Types.ObjectId(examId) 
        });
        
        if (!resultDoc) {
            console.log("ResultDoc not found");
            return;
        }

        // Just fetch the results from DB and print them to prove it matches? No, the user wants me to call `getDetails`.
        // I can just import `resultService` and call `getDetails`? Yes!
        
        // Wait, if I'm running raw node, importing ts files won't work.
        // Let's use tsx! `npx tsx fetch-test.ts`
        
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}
test();
