import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database';

async function updateNames() {
    await connectDatabase();
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("Database connection failed");
    }

    const realisticNames = [
        { first: 'Rahul', last: 'Sharma' },
        { first: 'Priya', last: 'Patel' },
        { first: 'Amit', last: 'Kumar' },
        { first: 'Sneha', last: 'Gupta' },
        { first: 'Vikram', last: 'Singh' },
        { first: 'Neha', last: 'Verma' },
        { first: 'Rohan', last: 'Desai' },
        { first: 'Anjali', last: 'Mehta' },
        { first: 'Karan', last: 'Joshi' }
    ];

    const attendances = await db.collection('attendances').find().toArray();
    
    let index = 0;
    for (const att of attendances) {
        if (!att.candidateId) continue;
        
        const nameData = realisticNames[index % realisticNames.length];
        const fullName = `${nameData.first} ${nameData.last}`;
        const email = `${nameData.first.toLowerCase()}.${nameData.last.toLowerCase()}@example.com`;

        await db.collection('candidates').updateOne(
            { _id: att.candidateId },
            { 
                $set: { 
                    firstName: nameData.first,
                    lastName: nameData.last,
                    fullName: fullName,
                    email: email
                }
            }
        );
        index++;
    }

    console.log(`Updated names for ${index} candidates to be more realistic.`);
    process.exit(0);
}

updateNames().catch(console.error);
