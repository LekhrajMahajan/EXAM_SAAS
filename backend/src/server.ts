import http from "http";

import app from "./app";

import { env } from "./config/env";

import { connectDatabase } from "./config/database";

import { initializeSocket } from "./socket";

import { seedRBAC } from "./modules/permission/rbacSeeder.service";
import { seedMasterAdmin, seedPlans } from "./seeders";


const startServer = async () => {
    try {
        await connectDatabase();

        // One-off patch to fix missing subjectIds in Exams
        const mongoose = require('mongoose');
        const Exam = mongoose.model('Exam');
        const Subject = mongoose.model('Subject');
        const exams = await Exam.find({});
        for (const exam of exams) {
            let needsUpdate = false;
            const subjects = exam.subjects || [];
            for (const subj of subjects) {
                if (!subj.subjectId && subj.name) {
                    const matchedSubject = await Subject.findOne({ 
                        $or: [ { name: subj.name }, { subjectName: subj.name } ],
                        companyId: exam.companyId
                    });
                    if (matchedSubject) {
                        subj.subjectId = matchedSubject._id;
                        needsUpdate = true;
                    }
                }
            }
            if (needsUpdate) {
                await Exam.updateOne({ _id: exam._id }, { $set: { subjects } });
                console.log(`[PATCH] Updated missing subjectId for exam: ${exam.examTitle}`);
            }
        }

        const settingsCache = require("./modules/system-settings/settingsCache.service").default;
        await settingsCache.initialize();

        await seedMasterAdmin();
        await seedPlans();
        await seedRBAC();

        // Initialize Workers
        require("./modules/backup/backup.worker");
        
        // Initialize Cron Jobs
        const { initExamStatusCron } = require("./jobs/examStatusCron");
        initExamStatusCron();

        const server = http.createServer(app);

        initializeSocket(server);

        server.listen(env.PORT, () => {
            console.log(
                `Server Running : http://localhost:${env.PORT}`
            );
            // One-time backfill: generate center payments for all ended exams that don't have payments yet
            setTimeout(async () => {
                try {
                    console.log("[Backfill] Generating missing center payments for ended exams...");
                    const ExamModel = require('./modules/exam/exam.model').default;
                    const centerPaymentsService = require('./modules/center-payments/centerPayments.service').default;
                    const CenterPayments = require('./modules/center-payments/centerPayments.model').default;
                    const endedExams = await ExamModel.find({
                        status: { $in: ['PENDING_RESULT_GENERATE', 'RESULT_GENERATED'] }
                    }).lean();
                    let created = 0;
                    for (const exam of endedExams) {
                        const existing = await CenterPayments.findOne({ examId: exam._id });
                        if (!existing) {
                            await centerPaymentsService.generatePaymentsForExam(exam._id.toString(), exam.companyId.toString());
                            created++;
                        }
                    }
                    console.log(`[Backfill] Done. Created payments for ${created} out of ${endedExams.length} ended exams.`);
                } catch (e) {
                    console.error('[Backfill] Failed to generate center payments:', e);
                }
            }, 3000);
        });
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

startServer();
// Trigger restart 2