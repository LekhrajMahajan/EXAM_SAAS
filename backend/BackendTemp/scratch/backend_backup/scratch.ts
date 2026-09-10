import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://ChoiceMart:Lekhraj_135@cluster0.rbiphvv.mongodb.net/exam_saas?retryWrites=true&w=majority').then(async () => {
    const candidate = await mongoose.connection.db.collection('candidates').findOne({ applicationNo: 'SSC-CGL-2026-1025' });
    console.log('Candidate:', candidate);
    if(candidate) {
        const exam = await mongoose.connection.db.collection('exams').findOne({ _id: candidate.assignedExamId });
        console.log('Exam:', exam);
    }
    process.exit(0);
}).catch(console.error);
