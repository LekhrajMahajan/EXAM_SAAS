import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { QueueType } from "../queue/queue.types";
import backupService from "./backup.service";
import { BackupHistory, BackupStatus } from "./backupHistory.model";


const connection = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    maxRetriesPerRequest: null,
}) as any;

export const backupWorker = new Worker(
    QueueType.BACKUP,
    async (job: Job) => {
        console.log(`Processing BACKUP job ${job.id}`);
        try {
            const { action, backupId, triggeredBy } = job.data;

            if (action === "CREATE_DATABASE_BACKUP") {
                await backupService.createDatabaseBackup(triggeredBy);
            } else if (action === "RESTORE_DATABASE_BACKUP") {
                await backupService.restoreDatabaseBackup(backupId);
            } else {
                throw new Error("Unknown backup action");
            }
        } catch (error: any) {
            console.error(`Backup job failed: ${error.message}`);
            throw error;
        }
    },
    { connection, concurrency: 1 } // concurrency 1 for heavy backup operations
);

backupWorker.on("completed", (job: Job) => {
    console.log(`BACKUP job ${job.id} completed.`);
});

backupWorker.on("failed", (job: Job | undefined, err: Error) => {
    if (job) {
        console.error(`BACKUP job ${job.id} failed: ${err.message}`);
    } else {
        console.error(`BACKUP job failed: ${err.message}`);
    }
});
