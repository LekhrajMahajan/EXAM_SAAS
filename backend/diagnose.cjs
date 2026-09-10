// Diagnostic script - uses env var directly
process.env.MONGODB_URI = 'mongodb+srv://ChoiceMart:Lekhraj_135@cluster0.rbiphvv.mongodb.net/exam_saas?retryWrites=true&w=majority';

const mongoose = require('mongoose');

async function diagnose() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB!');
    
    const db = mongoose.connection.db;
    
    // Find the exam for "Reserve Bank of India (RBI)"
    const exams = await db.collection('exams').find({ 
        $or: [
            { examTitle: { $regex: /reserve bank|RBI/i } },
            { examName: { $regex: /reserve bank|RBI/i } }
        ]
    }).limit(3).toArray();
    
    console.log('\n=== EXAMS FOUND ===', exams.length);
    for (const exam of exams) {
        console.log(`\nExam: ${exam.examTitle || exam.examName} (${exam._id})`);
        console.log(`  marksPerQuestion: ${exam.marksPerQuestion}`);
        console.log(`  negativeMarksPerQuestion: ${exam.negativeMarksPerQuestion}`);
        console.log(`  passingMarks: ${exam.passingMarks}`);
        console.log(`  totalMarks: ${exam.totalMarks}`);
        console.log(`  Subjects count: ${(exam.subjects || []).length}`);
        for (const s of (exam.subjects || [])) {
            console.log(`    SubjectId: ${s.subjectId} | marks: ${s.marksPerQuestion} (${typeof s.marksPerQuestion}) | negMarks: ${s.negativeMarksPerQuestion} (${typeof s.negativeMarksPerQuestion}) | sectionalCutoff: ${s.sectionalCutoff} | questions: ${s.questions}`);
        }
    }
    
    // Also find the recent results
    const results = await db.collection('results').find({}).sort({ updatedAt: -1 }).limit(3).toArray();
    
    console.log('\n=== RECENT RESULTS ===');
    for (const r of results) {
        console.log(`\nResult: ${r._id}`);
        console.log(`  marksObtained: ${r.marksObtained} | negativeMarks: ${r.negativeMarks} | correctAnswers: ${r.correctAnswers} | wrongAnswers: ${r.wrongAnswers} | totalMarks: ${r.totalMarks}`);
        if (r.subjectWiseBreakdown) {
            for (const s of r.subjectWiseBreakdown) {
                console.log(`    Subject ${s.subjectName}: marks=${s.marksObtained}, correct=${s.correctAnswers}, wrong=${s.wrongAnswers}`);
            }
        }
    }
    
    // Check candidateexamanswer collection structure
    const answers = await db.collection('candidateexamanswers').find({}).limit(1).toArray();
    if (answers.length > 0) {
        const sample = answers[0];
        console.log('\n=== SAMPLE ANSWER DOC ===');
        console.log('Keys:', Object.keys(sample));
        if (sample.results && sample.results.length > 0) {
            const firstResult = sample.results[0];
            console.log('First result item keys:', Object.keys(firstResult));
            console.log('First result item:', JSON.stringify(firstResult, null, 2).substring(0, 500));
        }
    }
    
    await mongoose.disconnect();
    console.log('\nDone!');
}

diagnose().catch(e => { console.error(e); process.exit(1); });
