import { Job, Queue } from "bullmq";
import IORedis from "ioredis";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
    IQueueJob,
    QueueType,
} from "./queue.types";

const connection = new IORedis({

    host: process.env.REDIS_HOST || "127.0.0.1",

    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,

    maxRetriesPerRequest: null,

}) as any;

class QueueService {

    private queues: Record<QueueType, Queue>;

    constructor() {

        this.queues = {

            [QueueType.EMAIL]:

                new Queue(

                    QueueType.EMAIL,

                    { connection }

                ),

            [QueueType.SMS]:

                new Queue(

                    QueueType.SMS,

                    { connection }

                ),

            [QueueType.WHATSAPP]:

                new Queue(

                    QueueType.WHATSAPP,

                    { connection }

                ),

            [QueueType.PDF]:

                new Queue(

                    QueueType.PDF,

                    { connection }

                ),

            [QueueType.QR]:

                new Queue(

                    QueueType.QR,

                    { connection }

                ),

            [QueueType.REPORT]:

                new Queue(

                    QueueType.REPORT,

                    { connection }

                ),

            [QueueType.NOTIFICATION]:

                new Queue(

                    QueueType.NOTIFICATION,

                    { connection }

                ),

            [QueueType.CUSTOM]:

                new Queue(

                    QueueType.CUSTOM,

                    { connection }

                ),
            
            [QueueType.BACKUP]:

                new Queue(

                    QueueType.BACKUP,

                    { connection }

                ),

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Get Queue
    |--------------------------------------------------------------------------
    */

    private getQueue(
        queue: QueueType
    ): Queue {

        const instance =
            this.queues[queue];

        if (!instance) {

            throw new ApiError(

                HTTP_STATUS.NOT_FOUND,

                "Queue not found."

            );

        }

        return instance;

    }

    /*
    |--------------------------------------------------------------------------
    | Add Job
    |--------------------------------------------------------------------------
    */

    async addJob(
        payload: IQueueJob
    ) {

        const queue =
            this.getQueue(
                payload.queue
            );

        return queue.add(

            payload.name,

            payload.data,

            payload.options

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Add Email Job
    |--------------------------------------------------------------------------
    */

    async addEmailJob(
        data: Record<string, unknown>,
        options?: IQueueJob["options"]
    ) {

        return this.addJob({

            queue: QueueType.EMAIL,

            name: "SEND_EMAIL",

            data,

            options,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Add PDF Job
    |--------------------------------------------------------------------------
    */

    async addPdfJob(
        data: Record<string, unknown>,
        options?: IQueueJob["options"]
    ) {

        return this.addJob({

            queue: QueueType.PDF,

            name: "GENERATE_PDF",

            data,

            options,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Add Report Job
    |--------------------------------------------------------------------------
    */

    async addReportJob(
        data: Record<string, unknown>,
        options?: IQueueJob["options"]
    ) {

        return this.addJob({

            queue: QueueType.REPORT,

            name: "GENERATE_REPORT",

            data,

            options,

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Get Job
    |--------------------------------------------------------------------------
    */

    async getJob(

        queueType: QueueType,

        jobId: string

    ): Promise<Job> {

        const queue =
            this.getQueue(
                queueType
            );

        const job =
            await queue.getJob(jobId);

        if (!job) {

            throw new ApiError(

                HTTP_STATUS.NOT_FOUND,

                "Job not found."

            );

        }

        return job;

    }

    /*
    |--------------------------------------------------------------------------
    | Get Jobs
    |--------------------------------------------------------------------------
    */

    async getJobs(
        queueType: QueueType
    ) {

        const queue =
            this.getQueue(
                queueType
            );

        return queue.getJobs([
            "waiting",
            "active",
            "completed",
            "failed",
            "delayed",
        ]);

    }

    /*
    |--------------------------------------------------------------------------
    | Retry Job
    |--------------------------------------------------------------------------
    */

    async retryJob(

        queueType: QueueType,

        jobId: string

    ) {

        const job =
            await this.getJob(
                queueType,
                jobId
            );

        await job.retry();

        return {

            success: true,

            message:
                "Job retried successfully.",

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Remove Job
    |--------------------------------------------------------------------------
    */

    async removeJob(

        queueType: QueueType,

        jobId: string

    ) {

        const job =
            await this.getJob(
                queueType,
                jobId
            );

        await job.remove();

        return {

            success: true,

            message:
                "Job removed successfully.",

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Pause Queue
    |--------------------------------------------------------------------------
    */

    async pauseQueue(
        queueType: QueueType
    ) {

        const queue =
            this.getQueue(
                queueType
            );

        await queue.pause();

        return {

            success: true,

            message:
                `${queueType} queue paused successfully.`,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Resume Queue
    |--------------------------------------------------------------------------
    */

    async resumeQueue(
        queueType: QueueType
    ) {

        const queue =
            this.getQueue(
                queueType
            );

        await queue.resume();

        return {

            success: true,

            message:
                `${queueType} queue resumed successfully.`,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Clean Queue
    |--------------------------------------------------------------------------
    */

    async cleanQueue(
        queueType: QueueType
    ) {

        const queue =
            this.getQueue(
                queueType
            );

        await queue.clean(

            0,

            1000,

            "completed"

        );

        await queue.clean(

            0,

            1000,

            "failed"

        );

        return {

            success: true,

            message:
                `${queueType} queue cleaned successfully.`,

        };

    }

}

export default new QueueService();
