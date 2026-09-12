import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

import resultService from '../backend/src/modules/result/result.service';

async function verify() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://developer:68J0g7cpxxG1d7V5@cluster0.dbw3c.mongodb.net/test');
    console.log("Connected.");

    const submissionId = "6aa2ad4d579109479f81ad5e";
    const examId = "6a83092aaf7fd1ce4d1f94e5";

    // 1. Get the raw CandidateExamAnswer from DB
    const CandidateExamAnswer = mongoose.connection.collection('candidateexamanswer');
    const candAns = await CandidateExamAnswer.findOne({ _id: new mongoose.Types.ObjectId(submissionId) });
    
    if (!candAns) {
        console.error("CandidateExamAnswer not found for submissionId:", submissionId);
        process.exit(1);
    }
    
    console.log(`Found candidate answers document. Total raw results: ${candAns.results?.length || 0}`);

    // Create a map of questionId -> actual DB candidate answer for O(1) lookup
    const dbAnswersMap = new Map();
    if (candAns.results) {
        for (const res of candAns.results) {
            dbAnswersMap.set(String(res.questionId), res);
        }
    }

    // 2. Get the Result document to pass to getDetails
    const Result = mongoose.connection.collection('results');
    const resultDoc = await Result.findOne({ 
        submissionId: new mongoose.Types.ObjectId(submissionId),
        examId: new mongoose.Types.ObjectId(examId) 
    });

    if (!resultDoc) {
        console.error("Result document not found for submissionId:", submissionId);
        process.exit(1);
    }

    console.log(`Found result document: ${resultDoc._id}`);

    // 3. Call resultService.getDetails
    console.log("Calling resultService.getDetails...");
    const details = await resultService.getDetails(String(resultDoc._id));

    // 4. Verify mismatches
    console.log(`\nVerifying ${details.answers.length} rows in Question Analysis response...`);
    
    let mismatches = 0;
    
    for (const apiRow of details.answers) {
        const qId = String(apiRow.questionId);
        const dbRow = dbAnswersMap.get(qId);
        
        if (!dbRow) {
            console.error(`Mismatch: questionId ${qId} is in API response but missing in DB results`);
            mismatches++;
            continue;
        }

        // apiRow.selectedAnswer is a comma separated string
        let apiSelectedStr = apiRow.selectedAnswer || "";
        
        // dbRow.candidateAnswer could be array or single value
        let dbSelectedStr = "";
        if (dbRow.options && Array.isArray(dbRow.options)) {
            const selectedOptions = Array.isArray(dbRow.candidateAnswer) ? dbRow.candidateAnswer : (dbRow.candidateAnswer ? [dbRow.candidateAnswer] : []);
            dbSelectedStr = selectedOptions.map((optId: any) => {
                const opt = dbRow.options.find((o: any) => o.optionId === optId);
                const txt = opt?.optionText || opt?.text;
                return txt ? `${optId} - ${txt.replace(/<[^>]*>?/gm, '')}` : optId;
            }).join(', ');
        } else {
            const selectedOptions = Array.isArray(dbRow.candidateAnswer) ? dbRow.candidateAnswer.map(String) : (dbRow.candidateAnswer ? [String(dbRow.candidateAnswer)] : []);
            dbSelectedStr = selectedOptions.join(', ');
        }

        if (apiSelectedStr !== dbSelectedStr) {
            console.error(`Mismatch for questionId ${qId}: API shows "${apiSelectedStr}", DB expects "${dbSelectedStr}"`);
            mismatches++;
        }
    }

    console.log(`\nVerification complete. Total mismatches: ${mismatches}`);
    process.exit(mismatches > 0 ? 1 : 0);
}

verify().catch(console.error);
