import mongoose from "mongoose";
import { env } from "./env";
import dns from "dns";

// Force Node.js to use Google DNS to bypass any local Windows DNS cache or ISP issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDatabase = async () => {
    try {
        mongoose.set("strictQuery", true);

        let uri = env.MONGODB_URI;
        if (uri.includes('retryWrites=true')) {
            uri = uri.replace('retryWrites=true', 'retryWrites=false');
        } else if (!uri.includes('retryWrites=false')) {
            uri = uri.includes('?') ? `${uri}&retryWrites=false` : `${uri}?retryWrites=false`;
        }

        const connection = await mongoose.connect(uri, {
            family: 4,
            maxPoolSize: 200,
            serverSelectionTimeoutMS: 10000,
        });

        console.log(
            `MongoDB Connected : ${connection.connection.host}`
        );

        // Auto-drop email index for managers to support multiple paper setters with same email
        try {
            const db = mongoose.connection.db;
            if (db) {
                const collection = db.collection('managers');
                await collection.dropIndex('email_1');
                console.log("Dropped email_1 index on managers collection successfully.");
            }
        } catch (e: any) {
            if (e.codeName !== 'IndexNotFound') {
                console.log("Note: email_1 index not dropped (might not exist).");
            }
        }
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    console.log("Database Connected");
});

mongoose.connection.on("disconnected", () => {
    console.log("Database Disconnected");
});

mongoose.connection.on("error", (err) => {
    console.log(err);
});