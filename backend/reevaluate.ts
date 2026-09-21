import mongoose from "mongoose";
import dotenv from "dotenv";
import { ResultService } from "./src/modules/result/result.service";

dotenv.config();

const uri = process.env.MONGODB_URI;

async function run() {
    try {
        await mongoose.connect(uri as string);
        console.log("Connected to MongoDB");

        const resultService = new ResultService();
        const resultId = "6aaa767ceed532f9656f1ec3"; // From user's URL

        console.log(`Re-evaluating result: ${resultId}`);
        const updatedResult = await resultService.evaluate(resultId);
        
        console.log("Evaluation complete. Updating result details...");
        
        console.log("Done!");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
