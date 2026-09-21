import cron from 'node-cron';
import Exam from '../modules/exam/exam.model';
import { ExamStatus } from '../modules/exam/exam.types';

export const initExamStatusCron = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0);

            const endOfToday = new Date(now);
            endOfToday.setHours(23, 59, 59, 999);

            // 0. ACTIVE to PENDING_EXAM (Correction for future exams)
            // Condition: Exam is ACTIVE but the exam date is in the future (greater than today)
            await Exam.updateMany(
                {
                    status: ExamStatus.ACTIVE,
                    examDate: { $gt: endOfToday }
                },
                { $set: { status: ExamStatus.PENDING_EXAM } }
            );

            // 1. PENDING_EXAM to ACTIVE
            // Condition: Exam date is today or in the past, and it's currently PENDING_EXAM
            const examsToActivate = await Exam.updateMany(
                { 
                    status: ExamStatus.PENDING_EXAM,
                    examDate: { $lte: endOfToday }
                },
                { $set: { status: ExamStatus.ACTIVE } }
            );

            // 2. ACTIVE to EXAM_STARTED
            // Condition: Exam date is today, and start time has passed
            // MongoDB aggregation pipeline for time string comparison
            const examsToStart = await Exam.aggregate([
                { $match: { status: ExamStatus.ACTIVE } },
            ]);
            
            for (const exam of examsToStart) {
                if (!exam.examDate || !exam.startTime) continue;
                
                const examDate = new Date(exam.examDate);
                const [startH, startM] = exam.startTime.split(':').map(Number);
                
                if (isNaN(startH) || isNaN(startM)) continue;
                
                const startDT = new Date(examDate);
                startDT.setHours(startH, startM, 0, 0);

                if (now >= startDT) {
                    await Exam.updateOne(
                        { _id: exam._id },
                        { $set: { status: ExamStatus.EXAM_STARTED, startedAt: new Date() } }
                    );
                }
            }

            // 3. EXAM_STARTED to PENDING_RESULT_GENERATE
            // Condition: End time has passed
            const examsToEnd = await Exam.aggregate([
                { $match: { status: ExamStatus.EXAM_STARTED } },
            ]);

            for (const exam of examsToEnd) {
                if (!exam.examDate || !exam.startTime || !exam.endTime) continue;

                const examDate = new Date(exam.examDate);
                const [startH, startM] = exam.startTime.split(':').map(Number);
                const [endH, endM] = exam.endTime.split(':').map(Number);

                if (isNaN(endH) || isNaN(endM)) continue;

                const startDT = new Date(examDate);
                startDT.setHours(startH, startM, 0, 0);

                const endDT = new Date(examDate);
                endDT.setHours(endH, endM, 0, 0);

                // If end time is technically before start time on the same date, assume it crosses midnight
                if (endDT < startDT) {
                    endDT.setDate(endDT.getDate() + 1);
                }

                if (now >= endDT) {
                    await Exam.updateOne(
                        { _id: exam._id },
                        { $set: { status: ExamStatus.PENDING_RESULT_GENERATE, endedAt: new Date() } }
                    );

                    // Generate center payments automatically
                    try {
                        const centerPaymentsService = require("../modules/center-payments/centerPayments.service").default;
                        await centerPaymentsService.generatePaymentsForExam(exam._id.toString(), exam.companyId.toString());
                    } catch (e) {
                        console.error(`Failed to generate center payments for exam ${exam._id}:`, e);
                    }
                }
            }

        } catch (error) {
            console.error('Error running ExamStatusCron:', error);
        }
    });
    
    console.log('ExamStatusCron initialized to run every minute.');
};
