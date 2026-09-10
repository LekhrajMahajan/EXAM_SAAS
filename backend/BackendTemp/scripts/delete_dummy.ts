import mongoose from 'mongoose';
import { ImportCandidate } from '../src/modules/import-candidate/importcandidate.model';
import { env } from '../src/config';

const dummyNames = [
  'Kunal Verma',
  'Nandini Rao',
  'Manav Desai',
  'Riya Kulkarni',
  'Mihir Joshi'
];

async function run() {
  try {
    await mongoose.connect(env.database.uri);
    console.log('Connected to DB');
    
    const result = await ImportCandidate.deleteMany({
      candidateFullName: { $in: dummyNames }
    });
    
    console.log(`Deleted ${result.deletedCount} dummy candidates.`);
    
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
