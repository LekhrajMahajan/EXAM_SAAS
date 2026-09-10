import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import meritListRepository from './src/modules/merit-list/meritList.repository';

async function test() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const meritLists = await meritListRepository.findAll({ limit: 1 });
    if (meritLists.data && meritLists.data.length > 0) {
        const meritId = meritLists.data[0]._id.toString();
        console.log("Merit ID:", meritId);
        
        const merit = await meritListRepository.findById(meritId);
        console.log("Candidate populated:", merit?.candidateId);
        console.log("Result populated:", JSON.stringify(merit?.resultId, null, 2));
    } else {
        console.log("No merit lists found");
    }
    await mongoose.disconnect();
}

test().catch(console.error);
