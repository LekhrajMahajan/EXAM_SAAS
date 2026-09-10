import mongoose from "mongoose";
import { env } from "../config/env";
import dns from "dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

const EXAM_ID = "6a83092aaf7fd1ce4d1f94e5";

async function main() {
    await mongoose.connect(env.MONGODB_URI, { family: 4 } as any);
    const db = mongoose.connection.db!;
    
    // Simulate what the fixed code does
    const ceaCollection = db.collection('candidateexamanswer');
    
    // Query with string examId (as the data stores it)
    const docs = await ceaCollection.find({ 
        examId: EXAM_ID,
        submitReason: { $exists: true } 
    }).toArray();
    
    console.log(`Found ${docs.length} candidateexamanswer documents for exam ${EXAM_ID}`);
    
    if (docs.length === 0) {
        console.log("NO DOCS FOUND - this is the issue!");
        process.exit(1);
    }
    
    // Simulate evaluation for first doc
    const doc = docs[0];
    const results = doc.results || [];
    console.log(`\nCandidate: ${doc.candidateId} | Results entries: ${results.length}`);
    
    let correct = 0, wrong = 0, unanswered = 0;
    
    for (const r of results) {
        const statusLower = (r.status || "").toLowerCase();
        const notAttempted = r.candidateAnswer === null || r.candidateAnswer === undefined 
            || statusLower === "not_visited" || statusLower === "not answered" || statusLower === "not visited"
            || statusLower === "";
        
        if (notAttempted) {
            unanswered++;
            continue;
        }
        
        // Use embedded options to determine correctness
        let isCorrect = false;
        if (r.options && Array.isArray(r.options)) {
            const correctOptions = r.options.filter((o: any) => o.isCorrect).map((o: any) => o.optionId || o.optionLabel);
            const selected = String(r.candidateAnswer);
            isCorrect = correctOptions.includes(selected);
        }
        
        if (isCorrect) correct++;
        else wrong++;
    }
    
    console.log(`\nSimulation result:`);
    console.log(`  Correct: ${correct}`);
    console.log(`  Wrong: ${wrong}`);  
    console.log(`  Unanswered: ${unanswered}`);
    console.log(`  Score: ${correct * 1} marks (using 1 mark per Q from embedded data)`);
    
    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
