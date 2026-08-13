import mongoose from 'mongoose';
import { env } from './config/env';
import { ConfigurationHistory } from './modules/system-settings/configurationHistory.model';

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI || 'mongodb://localhost:27017/exam-saas');
    console.log('Connected to DB');

    const count = await ConfigurationHistory.countDocuments();
    if (count === 0) {
      await ConfigurationHistory.create([
        {
          configurationName: 'siteName',
          module: 'GENERAL',
          category: 'GENERAL',
          oldValue: 'Old Site Name',
          newValue: 'ExamGuard Pro',
          status: 'PUBLISHED',
          approvalStatus: 'APPROVED',
          version: 1,
          changedBy: new mongoose.Types.ObjectId(),
        },
        {
          configurationName: 'maintenanceMode',
          module: 'GENERAL',
          category: 'GENERAL',
          oldValue: false,
          newValue: true,
          status: 'PUBLISHED',
          approvalStatus: 'APPROVED',
          version: 1,
          changedBy: new mongoose.Types.ObjectId(),
        },
        {
          configurationName: 'maxLoginAttempts',
          module: 'SECURITY',
          category: 'SECURITY',
          oldValue: 3,
          newValue: 5,
          status: 'PUBLISHED',
          approvalStatus: 'APPROVED',
          version: 1,
          changedBy: new mongoose.Types.ObjectId(),
        },
        {
          configurationName: 'backupFrequency',
          module: 'BACKUP',
          category: 'BACKUP',
          oldValue: 'weekly',
          newValue: 'daily',
          status: 'PUBLISHED',
          approvalStatus: 'APPROVED',
          version: 1,
          changedBy: new mongoose.Types.ObjectId(),
        }
      ] as any);
      console.log('Seeded Configuration History records');
    } else {
      console.log('Records already exist, count:', count);
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  }
}

seed();
