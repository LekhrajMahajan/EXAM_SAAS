import os from "os";
import process from "process";
import mongoose from "mongoose";

import {
    HealthComponent,
    HealthStatus,
} from "./health.types";

class HealthService {

    /*
    |--------------------------------------------------------------------------
    | Overall Health
    |--------------------------------------------------------------------------
    */

    async getHealth() {
        const [database, redis] = await Promise.all([
            this.checkDatabase(),
            this.checkRedis(),
        ]);

        return {
            status:
                database.status === HealthStatus.HEALTHY &&
                redis.status === HealthStatus.HEALTHY
                    ? HealthStatus.HEALTHY
                    : HealthStatus.DEGRADED,
            timestamp: new Date(),
            checks: {
                database,
                redis,
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Liveness
    |--------------------------------------------------------------------------
    */

    async getLiveness() {
        return {
            status: HealthStatus.HEALTHY,
            timestamp: new Date(),
            uptime: process.uptime(),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Readiness
    |--------------------------------------------------------------------------
    */

    async getReadiness() {
        const database = await this.checkDatabase();
        return {
            ready: database.status === HealthStatus.HEALTHY,
            database,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | System Information
    |--------------------------------------------------------------------------
    */

    async getSystemInformation() {
        return {
            hostname: os.hostname(),
            platform: process.platform,
            architecture: process.arch,
            environment: process.env.NODE_ENV,
            nodeVersion: process.version,
            uptime: process.uptime(),
            cpuCount: os.cpus().length,
            cpuUsage: process.cpuUsage(),
            loadAverage: os.loadavg(),
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem(),
                process: process.memoryUsage(),
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Database Health
    |--------------------------------------------------------------------------
    */

    async checkDatabase() {
        const start = Date.now();
        const connected = mongoose.connection.readyState === 1;

        return {
            component: HealthComponent.DATABASE,
            status: connected ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
            responseTime: Date.now() - start,
            message: connected ? "MongoDB connected." : "MongoDB disconnected.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Redis Health
    |--------------------------------------------------------------------------
    */

    async checkRedis() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Redis Ping
        | BullMQ Connection
        |
        */

        return {
            component: HealthComponent.REDIS,
            status: HealthStatus.HEALTHY,
            responseTime: 0,
            message: "Redis connected.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Queue Health
    |--------------------------------------------------------------------------
    */

    async checkQueue() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | BullMQ Queue Health
        | Waiting Jobs
        | Active Jobs
        | Failed Jobs
        |
        */

        return {
            component: HealthComponent.QUEUE,
            status: HealthStatus.HEALTHY,
            responseTime: 0,
            message: "Queue service is running.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Storage Health
    |--------------------------------------------------------------------------
    */

    async checkStorage() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Cloudinary
        | AWS S3
        | Local Storage
        |
        */

        return {
            component: HealthComponent.STORAGE,
            status: HealthStatus.HEALTHY,
            responseTime: 0,
            message: "Storage service is available.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | SMTP Health
    |--------------------------------------------------------------------------
    */

    async checkSMTP() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Verify SMTP Transport
        |
        */

        return {
            component: HealthComponent.SMTP,
            status: HealthStatus.HEALTHY,
            responseTime: 0,
            message: "SMTP service is available.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | SMS Health
    |--------------------------------------------------------------------------
    */

    async checkSMS() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | MSG91
        | Twilio
        | Fast2SMS
        |
        */

        return {
            component: HealthComponent.SMS,
            status: HealthStatus.HEALTHY,
            responseTime: 0,
            message: "SMS provider is available.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Push Notification Health
    |--------------------------------------------------------------------------
    */

    async checkPushNotification() {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Firebase Cloud Messaging
        |
        */

        return {
            component: HealthComponent.PUSH_NOTIFICATION,
            status: HealthStatus.HEALTHY,
            responseTime: 0,
            message: "Push notification service is available.",
        };
    }

}

export default new HealthService();
