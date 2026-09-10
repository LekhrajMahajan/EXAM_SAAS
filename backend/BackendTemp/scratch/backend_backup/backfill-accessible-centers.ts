import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const MONGO_URI = (process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL) as string;
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);

  const requests = await mongoose.connection.collection('companyadminrequests').find({ status: 'APPROVED' }).toArray();
  console.log('Found APPROVED CompanyAdminRequests:', requests.length);

  for (const req of requests) {
    const result = await mongoose.connection.collection('centers').updateOne(
      { _id: req.centerId },
      { $addToSet: { accessibleByCompanies: req.companyId } } as any
    );
    console.log(
      `Center ${req.centerId} -> added companyId ${req.companyId} | modified: ${result.modifiedCount}`
    );
  }

  console.log('Backfill complete!');
  await mongoose.disconnect();
}

main().catch(console.error);
