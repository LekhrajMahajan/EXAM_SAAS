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
// Trigger restart