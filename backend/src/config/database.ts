import mongoose from "mongoose";
import { env } from "./env";
import dns from "dns";

// Force Node.js to use Google DNS to bypass any local Windows DNS cache or ISP issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDatabase = async () => {
    try {
        mongoose.set("strictQuery", true);

        let uri = env.MONGODB_URI;
        if (!uri.includes('retryWrites=false')) {
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