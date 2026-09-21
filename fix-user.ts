import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, 'backend/.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.mongodb.net/test');
    console.log('Connected to DB');

    const User = mongoose.connection.collection('users');
    const Center = mongoose.connection.collection('centers');
    
    const email = 'lekhrajmahajan506@gmail.com';
    
    // Find COMPANY_ADMIN
    const companyAdmin = await User.findOne({ email, role: 'COMPANY_ADMIN' });
    if (!companyAdmin) {
      console.log('No company admin found for this email');
      process.exit(0);
    }
    
    // Find if CENTER_MANAGER already exists
    const centerManager = await User.findOne({ email, role: 'CENTER_MANAGER' });
    if (centerManager) {
      console.log('Center manager already exists. Nothing to fix.');
      process.exit(0);
    }
    
    // Create CENTER_MANAGER by cloning COMPANY_ADMIN
    const newManager = {
      ...companyAdmin,
      _id: new mongoose.Types.ObjectId(),
      role: 'CENTER_MANAGER',
      status: 'ACTIVE',
      managerCode: `RDEC-RAJ-01_MGR`,
    };
    
    await User.insertOne(newManager);
    console.log('Created new CENTER_MANAGER user with ID:', newManager._id);
    
    // Update center to point to new manager
    const center = await Center.findOne({ email });
    if (center) {
      await Center.updateOne({ _id: center._id }, { $set: { centerManagerId: newManager._id } });
      console.log('Updated center manager ID in center');
    }
    
    console.log('Fix applied successfully');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();
