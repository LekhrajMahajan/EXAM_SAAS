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

        const server = http.createServer(app);

        initializeSocket(server);

        server.listen(env.PORT, () => {
            console.log(
                `Server Running : http://localhost:${env.PORT}`
            );
        });
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

startServer();
// Trigger restart 2