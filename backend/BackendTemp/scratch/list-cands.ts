import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database';

async function listCands() {
    await connectDatabase();
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("Database connection failed");
    }

    const cands = await db.collection('candidates').find().toArray();
    console.log("ALL CANDIDATES:");
    cands.forEach(c => console.log(`${c._id} - ${c.fullName} - ${c.email}`));

    const atts = await db.collection('attendances').find().toArray();
    console.log("\nALL ATTENDANCES:");
    atts.forEach(a => console.log(`${a._id} - CandID: ${a.candidateId} - Status: ${a.attendanceStatus}`));

    process.exit(0);
}

listCands().catch(console.error);
