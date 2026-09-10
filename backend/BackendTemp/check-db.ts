import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Center from './src/modules/center/center.model';
import User from './src/modules/user/user.model';
import Company from './src/modules/company/company.model';

dotenv.config();

async function checkDb() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const centers = await Center.find().lean();
  console.log(`Total Centers: ${centers.length}`);
  centers.forEach((c: any) => {
    console.log(`Center ID: ${c._id}, Name: ${c.centerName}, companyId: ${c.companyId} (type: ${typeof c.companyId})`);
  });

  const companies = await Company.find().lean();
  console.log(`Total Companies: ${companies.length}`);
  companies.forEach((c: any) => {
    console.log(`Company ID: ${c._id}, Name: ${c.companyName}`);
  });

  const users = await User.find({ role: 'COMPANY_ADMIN' }).lean();
  console.log(`Total COMPANY_ADMIN Users: ${users.length}`);
  users.forEach((u: any) => {
    console.log(`User ID: ${u._id}, Email: ${u.email}, companyId: ${u.companyId}, role: ${u.role}`);
  });

  mongoose.disconnect();
}

checkDb().catch(console.error);
