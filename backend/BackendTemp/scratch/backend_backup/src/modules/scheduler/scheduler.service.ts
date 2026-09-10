import cron, {
    ScheduledTask,
} from "node-cron";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
    ISchedulerJob,
    SchedulerFrequency,
    SchedulerJob,
} from "./scheduler.types";

class SchedulerService {

    private jobs = new Map<
        SchedulerJob,
        ScheduledTask
    >();

    /*
    |--------------------------------------------------------------------------
    | Initialize
    |--------------------------------------------------------------------------
    */

    initialize() {
        this.registerJobs();
    }

    /*
    |--------------------------------------------------------------------------
    | Register Default Jobs
    |--------------------------------------------------------------------------
    */

    registerJobs() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Register Default Cron Jobs
        |
        */
    }

    /*
    |--------------------------------------------------------------------------
    | Get Jobs
    |--------------------------------------------------------------------------
    */

    async getJobs() {
        return Array.from(this.jobs.keys());
    }

    /*
    |--------------------------------------------------------------------------
    | Get Job
    |--------------------------------------------------------------------------
    */

    async getJob(name: SchedulerJob) {
        const job = this.jobs.get(name);

        if (!job) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Scheduler job not found."
            );
        }

        return {
            name,
            running: true,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Create Job
    |--------------------------------------------------------------------------
    */

    async createJob(payload: ISchedulerJob) {
        const expression =
            payload.frequency === SchedulerFrequency.CRON
                ? payload.cronExpression!
                : "* * * * *";

        const task = cron.schedule(
            expression,
            async () => {
                await this.runJob(payload.name);
            },
            {
                scheduled: payload.enabled,
            }
        );

        this.jobs.set(payload.name, task);

        return {
            success: true,
            job: payload.name,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Update Job
    |--------------------------------------------------------------------------
    */

    async updateJob(payload: ISchedulerJob) {
        await this.deleteJob(payload.name);
        return this.createJob(payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Run Job
    |--------------------------------------------------------------------------
    */

    async runJob(name: SchedulerJob) {
        switch (name) {
            case SchedulerJob.RESULT_PUBLISH:
                return this.executeResultPublish();

            case SchedulerJob.EXAM_REMINDER:
                return this.executeExamReminder();

            case SchedulerJob.REPORT:
                return this.executeReportGeneration();

            case SchedulerJob.CACHE_CLEANUP:
                return this.executeCleanup();

            case SchedulerJob.DATABASE_BACKUP:
                return this.executeBackup();

            default:
                return {
                    success: true,
                    message: `${name} executed.`,
                };
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Pause Job
    |--------------------------------------------------------------------------
    */

    async pauseJob(name: SchedulerJob) {
        const job = this.jobs.get(name);

        if (!job) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Scheduler job not found."
            );
        }

        job.stop();

        return {
            success: true,
            message: `${name} paused successfully.`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Resume Job
    |--------------------------------------------------------------------------
    */

    async resumeJob(name: SchedulerJob) {
        const job = this.jobs.get(name);

        if (!job) {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "Scheduler job not found."
            );
        }

        job.start();

        return {
            success: true,
            message: `${name} resumed successfully.`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Job
    |--------------------------------------------------------------------------
    */

    async deleteJob(name: SchedulerJob) {
        const job = this.jobs.get(name);

        if (!job) {
            return {
                success: true,
            };
        }

        job.stop();
        this.jobs.delete(name);

        return {
            success: true,
            message: `${name} deleted successfully.`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Result Publish
    |--------------------------------------------------------------------------
    */

    async executeResultPublish() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Publish Approved Results
        | Send Email
        | Send SMS
        | Send Push Notification
        |
        */
        return {
            success: true,
            job: SchedulerJob.RESULT_PUBLISH,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Exam Reminder
    |--------------------------------------------------------------------------
    */

    async executeExamReminder() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Email Reminder
        | SMS Reminder
        | Push Reminder
        |
        */
        return {
            success: true,
            job: SchedulerJob.EXAM_REMINDER,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Report Generation
    |--------------------------------------------------------------------------
    */

    async executeReportGeneration() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Generate Daily Reports
        | Queue Reports
        |
        */
        return {
            success: true,
            job: SchedulerJob.REPORT,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    async executeCleanup() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Redis Cleanup
        | Temp Files
        | Queue Cleanup
        | Activity Logs
        | Audit Logs
        |
        */
        return {
            success: true,
            job: SchedulerJob.CACHE_CLEANUP,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Database Backup
    |--------------------------------------------------------------------------
    */

    async executeBackup() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | MongoDB Backup
        | Upload Storage
        | Email Status
        |
        */
        return {
            success: true,
            job: SchedulerJob.DATABASE_BACKUP,
        };
    }
}

export default new SchedulerService();
