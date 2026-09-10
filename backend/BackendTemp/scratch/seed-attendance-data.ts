import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database';

async function seedData() {
    await connectDatabase();
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("Database connection failed");
    }

    const attendances = await db.collection('attendances').find().toArray();
    const baseCandidate = await db.collection('candidates').findOne();

    if (!baseCandidate) {
        console.log("No base candidate found.");
        process.exit(1);
    }

    const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE'];
    const verifStatuses = ['SUCCESS', 'SUCCESS', 'PENDING', 'FAILED'];

    let i = 1;
    for (const att of attendances) {
        // Create a unique candidate for this attendance
        const newCandidate: any = { ...baseCandidate };
        delete newCandidate._id;
        const timestamp = Date.now();
        newCandidate.candidateCode = `CAND-${timestamp}-${i}`;
        newCandidate.applicationNo = `APP-${timestamp}-${i}`;
        newCandidate.enrollmentNo = `ENR-${timestamp}-${i}`;
        newCandidate.firstName = `Candidate`;
        newCandidate.lastName = `${i}`;
        newCandidate.fullName = `Candidate ${i}`;
        newCandidate.email = `candidate${timestamp}${i}@example.com`;

        const insertRes = await db.collection('candidates').insertOne(newCandidate);
        const candId = insertRes.insertedId;

        // Randomize attendance
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const faceStatus = verifStatuses[Math.floor(Math.random() * verifStatuses.length)];
        const bioStatus = verifStatuses[Math.floor(Math.random() * verifStatuses.length)];
        
        const updateDoc: any = {
            candidateId: candId,
            attendanceStatus: status,
            faceVerification: faceStatus,
            biometricVerification: bioStatus,
        };

        if (status === 'PRESENT' || status === 'LATE') {
            const checkIn = new Date();
            checkIn.setHours(9, 30, 0); // 9:30 AM
            if (status === 'LATE') checkIn.setMinutes(45);
            
            const checkOut = new Date(checkIn);
            checkOut.setHours(checkIn.getHours() + 3); // 3 hours later
            
            updateDoc.checkInTime = checkIn;
            updateDoc.checkOutTime = checkOut;
        } else {
            updateDoc.checkInTime = null;
            updateDoc.checkOutTime = null;
        }

        await db.collection('attendances').updateOne(
            { _id: att._id },
            { $set: updateDoc }
        );

        i++;
    }

    console.log(`Updated ${attendances.length} records with diverse data.`);
    process.exit(0);
}

seedData().catch(console.error);
