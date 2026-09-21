import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI as string).then(async () => {
    console.log('Connected');
    
    // Load models
    require('./modules/exam/exam.model');
    require('./modules/center/center.model');
    require('./modules/candidate/candidate.model');
    require('./modules/candidate/importCandidate.model');
    require('./modules/center-payments/centerPayments.model');
    require('./modules/shift/shift.model');
    
    const centerPaymentsService = require('./modules/center-payments/centerPayments.service').default;
    
    const examId = '6aabe8da696de247aaf02f70';
    const Exam = mongoose.model('Exam');
    const exam = await Exam.findById(examId);
    if(exam) {
        await centerPaymentsService.generatePaymentsForExam(examId, exam.companyId.toString());
        console.log('Generated payments for', examId);
    } else {
        console.log('Exam not found');
    }
    
    process.exit(0);
});
